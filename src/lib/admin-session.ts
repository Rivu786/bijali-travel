import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "bijali_admin";

function credentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

function expectedToken() {
  const { username, password } = credentials();
  return createHmac("sha256", password).update(username).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function credentialsMatch(username: string, password: string) {
  const expected = credentials();
  return safeEqual(username, expected.username) && safeEqual(password, expected.password);
}

export async function isAdmin() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value ?? "";
  const expected = expectedToken();
  if (!token || !expected) return false;
  return safeEqual(token, expected);
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function assertAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}
