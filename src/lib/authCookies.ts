import type { NextResponse } from "next/server";

export function setAuthCookies(
  response: NextResponse,
  token: string,
  role: string,
) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24,
  };

  response.cookies.set("token", token, options);
  response.cookies.set("role", role, options);
}
