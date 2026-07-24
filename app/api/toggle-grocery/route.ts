import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { GroceryItem } from "@/types/type";
import { Prisma } from "@/app/generated/prisma/client";

const bodySchema = z.object({
  mealPlanId: z.string(),
  itemName: z.string(),
  checked: z.boolean(),
});


export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten }, { status: 400 });
  }

  const groceryList = await prisma.groceryList.findFirst({
    where: { mealPlanId: parsed.data.mealPlanId, mealPlan: { user: { clerkId } } },
  });
  if (!groceryList) return NextResponse.json({ error: "Grocery list not found" }, { status: 404 });

  const items = groceryList.items as unknown as GroceryItem[];
  const nextItems = items.map((item) =>
    item.name === parsed.data.itemName ? { ...item, checked: parsed.data.checked } : item
  );

  const updated = await prisma.groceryList.update({
    where: { id: groceryList.id },
    data: { 
      // 2. Cast the array so Prisma accepts it as valid JSON input
      items: nextItems as unknown as Prisma.InputJsonValue 
    },
  });

  return NextResponse.json({ groceryList: updated });
}
