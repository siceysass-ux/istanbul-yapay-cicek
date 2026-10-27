import { jwtVerify } from "jose";

export function getSessionSecretKey(): Uint8Array {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "cicekyapay-prod-session-secret-99887766554433221100"
  );
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export const SESSION_COOKIE = "admin-session";

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
