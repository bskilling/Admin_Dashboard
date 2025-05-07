// middleware/adminAuth.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { AdminRole } from "@/models/AdminUser";

export default withAuth(
  function middleware(req) {
    // Redirect to unauthorized if trying to access super admin routes
    if (
      req.nextUrl.pathname.startsWith("/admin/super") &&
      req.nextauth.token?.role !== AdminRole.SUPER_ADMIN
    ) {
      return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);
