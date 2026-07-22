import { cn } from '@/lib/utils';
import React from 'react'

function Header2({
  text,
  className,
}: {
  readonly text: string;
  readonly className?: string;
}) {
  return <h2 className={cn("text-[40px] leading-none", className)}>{text}</h2>;
}

export default Header2