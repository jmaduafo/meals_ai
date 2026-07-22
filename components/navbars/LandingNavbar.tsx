import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

function LandingNavbar() {
  return (
    <header className="flex justify-between items-center py-4 top-0 sticky bg-background dark:bg-foreground z-50">
      <button className="font-serif text-lg">MealWise AI</button>
      <nav className="hidden sm:block">
        <ul className="flex items-center gap-3 text-sm font-medium">
          <li>
            <Link href="/#how-it-works">How It Works</Link>
          </li>
          <li>
            <Link href="/#pricing">Pricing</Link>
          </li>
        </ul>
      </nav>
      <nav className="flex items-center gap-3">
        <ul className="text-sm font-medium">
          <li>
            <Link href={"/sign-in"}>Log In</Link>
          </li>
        </ul>
        <Link href="/sign-up">
          <Button>Get Started</Button>
        </Link>
      </nav>
    </header>
  );
}

export default LandingNavbar;
