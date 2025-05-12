import AuthWrapper from "@/lib/AuthWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 p-4 w-full">{children}</div>;
}
