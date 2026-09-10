import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Ayarlar</h1>
        <p className="text-sm text-muted">Site genel ayarları</p>
      </div>

      <SettingsForm initial={map} />
    </div>
  );
}
