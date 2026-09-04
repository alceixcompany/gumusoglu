import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminSession';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/hizmetlerimiz/')) return NextResponse.redirect(new URL('/hizmetlerimiz', request.url));
  const legacyRoutes: Record<string, string> = {
    '/teknik-servis': '/hizmetlerimiz', '/haberler': '/blog',
    '/hizmet-bolgelerimiz': '/hizmetlerimiz', '/gizlilik-politikasi': '/',
  };
  const legacy = Object.keys(legacyRoutes).find((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (legacy) return NextResponse.redirect(new URL(legacyRoutes[legacy], request.url));

  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = secret ? await verifyAdminSessionToken(token, secret) : false;

  if (!authenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/teknik-servis/:path*', '/hizmetlerimiz/:path*', '/haberler/:path*', '/hizmet-bolgelerimiz/:path*', '/gizlilik-politikasi/:path*'],
};
