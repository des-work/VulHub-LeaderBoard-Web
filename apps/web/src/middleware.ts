import { NextResponse, NextRequest } from 'next/server';

// Adjust CSP as needed when adding external sources (fonts, images)
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "connect-src 'self'",
  "frame-ancestors 'none'",
].join('; ');

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  // COOP/COEP/CORP can break 3rd-party fonts/assets; enable as infra permits
  // res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  // res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  // res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  res.headers.set('Content-Security-Policy', csp);
  // NOTE: Only enable HSTS when served over HTTPS
  if (req.nextUrl.protocol === 'https:') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
