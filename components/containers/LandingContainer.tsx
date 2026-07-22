import React from "react";
import LandingNavbar from "../navbars/LandingNavbar";
import LandingFooter from "../footers/LandingFooter";

function LandingContainer({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="px-[6vw] md:px-[12vw]">
      <LandingNavbar />
      <main>{children}</main>
      <LandingFooter/>
    </div>
  );
}

export default LandingContainer;
