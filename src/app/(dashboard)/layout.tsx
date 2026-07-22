import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-1">
      <AppSidebar userName={session.user.name ?? session.user.email} />
      <div className="flex min-w-0 flex-1 flex-col bg-background">{children}</div>
    </div>
  );
}
