import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export const metadata = { title: "Admin Panel" };

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader email={session.email} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
