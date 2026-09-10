import { jwtVerify } from "jose";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-change-in-production-min-32-chars"
);

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
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
