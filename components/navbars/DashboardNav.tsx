"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { CalendarDays, ShoppingCart, Camera, Settings, LayoutGrid, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/meal-plan", label: "Meal plan", icon: CalendarDays },
  { href: "/dashboard/grocery-list", label: "Grocery list", icon: ShoppingCart },
  { href: "/dashboard/fridge-scan", label: "Scan my fridge", icon: Camera },
  { href: "/dashboard/favorite", label: "Favorite", icon: Heart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 py-6 px-3 flex-col justify-between">
      <div>
        <Link href="/dashboard" className="mb-8 block font-serif text-lg font-semibold">
          MealWise <span className="text-forest-700">AI</span>
        </Link>
        <nav className="space-y-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  active && "bg-foreground text-background"
                )}
              >
                <Icon className="size-4" strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3 border-t border-border pt-4">
        <UserButton />
        <span className="text-xs text-ink/60">Manage account</span>
      </div>
    </aside>
  );
}
