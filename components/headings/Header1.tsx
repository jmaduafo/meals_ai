import React from "react";
import { cn } from "@/lib/utils";

function Header1({
  text,
  className,
}: {
  readonly text: string;
  readonly className?: string;
}) {
  return <h1 className={cn("text-5xl leading-none", className)}>{text}</h1>;
}

export default Header1;
