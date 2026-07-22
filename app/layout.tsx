import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "MealWise AI — Meal plans built around your goal, diet, and budget",
  description:
    "Tell us your weight goal, dietary restrictions, and weekly budget. Get a 7-day meal plan, grocery list, and full macros in seconds — or just snap a photo of your fridge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} bg-background text-foreground dark:bg-foreground dark:text-background h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
