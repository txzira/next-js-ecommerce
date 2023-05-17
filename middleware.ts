import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const USERTYPE = { USER: "CUSTOMER", ADMIN: "ADMIN" };
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};

export default withAuth(
  function middleware(req) {
    //user is not admin, redirect from admin pages
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (req.nextauth.token?.role !== USERTYPE.ADMIN) {
        return req.nextauth.token?.role === USERTYPE.USER
          ? NextResponse.redirect(new URL("/user/products?message=You Are Not Authorized!", req.url))
          : NextResponse.redirect(new URL("/auth/login?message=You Are Not Logined!", req.url));
      }
    } else if (req.nextUrl.pathname.startsWith("/user")) {
      //user is not signed in, redirect from user based pages
      if (req.nextauth.token?.role === USERTYPE.ADMIN) return;
      else if (req.nextauth.token?.role === USERTYPE.USER) return;
      else return NextResponse.redirect(new URL("/auth/login?message=You Are Not Logined!", req.url));
    }
  },
  {
    callbacks: {
      authorized({ token }) {
        if (token) return true;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);
