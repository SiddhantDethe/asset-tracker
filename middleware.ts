//middleware.ts

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const { pathname } = req.nextUrl;

  // ✅ Allow admin registration WITHOUT login
  if (pathname === "/admin/register") {
    return NextResponse.next();
  }

  // 🔒 Protect admin dashboard
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🔒 Protect user dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
