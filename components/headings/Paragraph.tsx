import { cn } from '@/lib/utils';
import React from 'react'

function Paragraph({
  text,
  className,
}: {
  readonly text: string;
  readonly className?: string;
}) {
  return <p className={cn("text-sm 2xl:text-base leading-snug", className)}>{text}</p>;
}

export default Paragraph