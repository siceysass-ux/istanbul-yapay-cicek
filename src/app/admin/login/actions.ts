"use server";

import { redirect } from "next/navigation";
import { authenticateAdmin, createSession, destroySession } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "E-posta ve şifre gerekli." };
  }

  const session = await authenticateAdmin(email, password);
  if (!session) {
    return { error: "Geçersiz e-posta veya şifre." };
  }

  await createSession(session);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
