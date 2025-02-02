import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 미들웨어 설정
export default withAuth(
  function middleware(req) {
    // 현재 경로
    const pathname = req.nextUrl.pathname;
    // 토큰 (로그인 상태)
    const token = req.nextauth.token;

    // 공개 경로 (auth 페이지)에 로그인된 상태로 접근하는 경우
    if (pathname.startsWith("/auth") && token) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
      return NextResponse.redirect(new URL(callbackUrl || "/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // 인증이 필요한 페이지 설정
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // 공개 경로는 인증 불필요
        if (pathname.startsWith("/auth")) return true;

        // 그 외 경로는 인증 필요
        return !!token;
      },
    },
  }
);

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
