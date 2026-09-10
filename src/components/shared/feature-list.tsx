import { Check } from "lucide-react";

const features = [
  "İç veya dış mekan kullanımı için ideal",
  "Sıfır bakım maliyeti (sulama ve budama yok)",
  "Böcek veya diğer haşereler olmaz",
  "Uzun ömürlü ve 1. kalite malzeme kullanımı",
  "Gürültü sönümleyici özellik",
  "Yüksek kaliteli, ikna edici dekoratif tasarım",
  "Gerçek bitkileri birebir yansıtan tasarım",
  "Tüm iklim koşullarına dayanıklı",
];

export function FeatureList({ items = features }: { items?: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((f) => (
        <div key={f} className="flex items-start gap-3 rounded-xl border border-primary/10 bg-white/60 p-4">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-4 w-4" />
          </span>
          <span className="text-sm text-ink/80">{f}</span>
        </div>
      ))}
    </div>
  );
}
