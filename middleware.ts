import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const USERTYPE = { CUSTOMER: "CUSTOMER", ADMIN: "ADMIN" };
export const config = {
  matcher: ["/admin/:path*"],
};

export default withAuth(
  function middleware(req) {
    //user is not admin, redirect from admin pages
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // If on admin path
      if (req.nextauth.token?.role !== USERTYPE.ADMIN) {
        // If user is not admin
        return req.nextauth.token?.role === USERTYPE.CUSTOMER
          ? NextResponse.redirect(
              new URL("/user/products?message=You Are Not Authorized!", req.url)
            )
          : NextResponse.redirect(
              new URL("/auth/login?message=You Are Not Logined!", req.url)
            );
      }
    }
    return;
    // else if (req.nextUrl.pathname.startsWith("/user")) {
    //   //If on user path
    //   if (req.nextauth.token?.role === USERTYPE.ADMIN) return;
    //   // If user is admin allow
    //   else if (req.nextauth.token?.role === USERTYPE.CUSTOMER) return;
    //   // If user is
    //   else return NextResponse.redirect(new URL("/auth/login?message=You Are Not Logined!", req.url));
    // }
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
