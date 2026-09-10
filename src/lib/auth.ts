import { SignJWT } from "jose";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/session";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-change-in-production-min-32-chars"
);
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

export type { SessionPayload };

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return compare(password, hashed);
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SESSION_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<SessionPayload | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !user.isActive) return null;
  if (user.role !== "ADMIN") return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  return { userId: user.id, email: user.email, role: user.role };
}
