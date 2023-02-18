import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const USERTYPE = { USER: "user", ADMIN: "admin" };
export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== USERTYPE.ADMIN)
      return NextResponse.rewrite(new URL("/auth/login?message=You Are Not Authorized!", req.url));
    if (req.nextUrl.pathname.startsWith("/user")) {
      if (req.nextauth.token?.role === USERTYPE.ADMIN) return;
      else if (req.nextauth.token?.role === USERTYPE.USER) return;
      else return NextResponse.rewrite(new URL("/auth/login?message=You Are Not Logined!", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
