import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!request.cookies.has("token")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // لوحة الأدمن: للمدير فقط (الباك اند بيفرض الصلاحية الفعلية)
  if (
    pathname.startsWith("/admin") &&
    request.cookies.get("role")?.value !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/categories/:path*",
    "/brands/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};