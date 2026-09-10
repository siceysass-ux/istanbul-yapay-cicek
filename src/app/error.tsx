"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="font-serif text-2xl font-semibold mb-2">
          Bir şeyler ters gitti
        </h1>
        <p className="text-sm text-muted mb-6">
          Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Tekrar Dene
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="h-4 w-4" /> Anasayfa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
