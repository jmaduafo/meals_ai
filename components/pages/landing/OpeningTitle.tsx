import Header1 from "@/components/headings/Header1";
import Header2 from "@/components/headings/Header2";
import Paragraph from "@/components/headings/Paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

function OpeningTitle({
  badgeText,
  title,
  subtitle,
  subtitleClassName,
  buttonText,
  isHeader1,
  link,
}: {
  readonly badgeText: string;
  readonly title: string;
  readonly subtitle: string;
  readonly subtitleClassName?: string;
  readonly buttonText?: string;
  readonly isHeader1?: boolean;
  readonly link?: string;
}) {
  return (
    <div className="sm:w-[80%] md:w-[60%] xl:w-[40%] mx-auto flex flex-col items-center gap-4 pt-[10vh] pb-[6vh]">
      <div className="flex flex-col items-center gap-2">
        <Badge variant={"outline"}>{badgeText}</Badge>
        {isHeader1 ? (
          <Header1 text={title} className="text-center font-medium capitalize" />
        ) : (
          <Header2 text={title} className="text-center font-medium capitalize" />
        )}
      </div>
      <Paragraph
        text={subtitle}
        className={cn("text-center opacity-70", subtitleClassName)}
      />
      {buttonText && link && (
        <Link href={link}>
          <Button>
            {buttonText} <ArrowUpRight strokeWidth={1} className="" />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default OpeningTitle;
