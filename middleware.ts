import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }
        if (pathname === "/" || pathname.startsWith("/api/video")) {
          return true;
        }
        return !!token; //converts it into boolean
      },
    },
  }
);
export const config = {
  // Match all paths except for the ones in the public folder
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};
