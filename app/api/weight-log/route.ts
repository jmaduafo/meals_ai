import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  weightLbs: z.coerce.number().min(60).max(600),
  loggedAt: z.coerce.date().optional(),
});

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const log = await prisma.weightLog.create({
    data: {
      userId: user.id,
      weightLbs: parsed.data.weightLbs,
      loggedAt: parsed.data.loggedAt ?? new Date(),
    },
  });

  return NextResponse.json({ log }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 12);

  const logs = await prisma.weightLog.findMany({
    where: { userId: user.id },
    orderBy: { loggedAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ logs: logs.reverse() });
}
