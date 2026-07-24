import DashboardNav from "@/components/navbars/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden flex justify-center items-center">
      <div className="flex h-[98vh] w-[98vw]">
        <DashboardNav />
        <div className="flex-1 overflow-y-auto">
          <div className="rounded-lg border border-input h-full overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
