import React from "react";
import OpeningTitle from "./OpeningTitle";
import Image from "next/image";
import MealWise from "@/public/images/mealwise dashboard.png";

function Hero() {
  return (
    <section className="pt-[3vh]">
      <OpeningTitle
        badgeText="Your week, planned to the gram and the dollar"
        title="Tell us your goal. We'll set the table."
        subtitle="Enter your weight goal, dietary restrictions, and weekly budget. Get a full 7-day meal plan, a categorized grocery list, and exact calories & macros for every plate — before your coffee's cold."
        buttonText="Build My First Plan"
        isHeader1
        link="/sign-up"
      />
      <div className="relative w-full">
        <div className="w-full h-[50%] absolute bottom-0 z-3 bg-linear-to-b from-background/0 to-background"></div>
        <div className="">
          <Image
            src={MealWise}
            alt="mealwise dashboard preview"
            className="object-cover w-full rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
