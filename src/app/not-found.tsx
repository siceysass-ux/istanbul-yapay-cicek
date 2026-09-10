import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="font-serif text-8xl font-bold text-gradient">404</div>
      <h1 className="mt-4 font-serif text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-2 text-muted">Aradığınız sayfa taşınmış veya silinmiş olabilir.</p>
      <Button className="mt-8" asChild>
        <Link href="/">Anasayfaya Dön</Link>
      </Button>
    </div>
  );
}
