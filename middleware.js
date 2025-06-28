import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware({
  async afterAuth(auth, req) {
    const { userId, user } = auth;

    if (!userId || !user) return NextResponse.next();

    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    // Avoid redirect loops (if already at a dashboard)
    const alreadyOnDashboard =
      pathname.startsWith('/teacher-dashboard') ||
      pathname.startsWith('/student-dashboard') ||
      pathname.startsWith('/unknown-role');

    if (alreadyOnDashboard) return NextResponse.next();

    const role = user.publicMetadata?.role;

    if (role === 'teacher') {
      url.pathname = '/teacher-dashboard';
      return NextResponse.redirect(url);
    } else if (role === 'student') {
      url.pathname = '/student-dashboard';
      return NextResponse.redirect(url);
    } else {
      url.pathname = '/unknown-role';
      return NextResponse.redirect(url);
    }
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};