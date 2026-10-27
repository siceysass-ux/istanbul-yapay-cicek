import { NextRequest, NextResponse } from "next/server";
import { checkIyzicoInstallments } from "@/lib/iyzico";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { binNumber?: string; price?: number };
    const bin = (body.binNumber ?? "").replace(/\D/g, "").slice(0, 8);
    const price = Number(body.price ?? 0);

    if (bin.length < 6 || price <= 0) {
      return NextResponse.json({
        status: "failure",
        errorMessage: "Geçerli kart BIN numarası ve tutar gerekli.",
      });
    }

    const result = await checkIyzicoInstallments(bin, price);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { status: "failure", errorMessage: "Taksit sorgulanamadı." },
      { status: 500 }
    );
  }
}
