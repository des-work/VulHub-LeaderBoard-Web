import { NextResponse, NextRequest } from 'next/server';

// Relaxed CSP for development - allows all necessary functionality
const csp = [
  "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
  "base-uri 'self'",
  "font-src 'self' 'unsafe-inline' https://fonts.gstatic.com data:",
  "img-src 'self' 'unsafe-inline' data: blob: https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "connect-src 'self' http://localhost:4000 ws://localhost:*",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Essential security headers only
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Relaxed CSP for development
  res.headers.set('Content-Security-Policy', csp);
  
  // Only enable HSTS when served over HTTPS
  if (req.nextUrl.protocol === 'https:') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};