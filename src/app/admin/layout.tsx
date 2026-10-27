import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export const metadata = {
  title: "Yönetim Paneli",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // /admin/login sayfasında sonsuz yönlendirme döngüsünü önlemek için
  // oturum yoksa doğrudan alt sayfayı (login formunu) render et.
  // Diğer tüm /admin/* rotaları zaten middleware.ts tarafından /admin/login'e yönlendirilir.
  if (!session || session.role !== "ADMIN") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-ink">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader email={session.email} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
