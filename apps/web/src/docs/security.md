# Security Hardening

This app includes several layers of defense-in-depth.

## Global Security Headers
Configured in `middleware.ts`:
- Content-Security-Policy (CSP): default-src 'self', restricted font/style/script origins
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: disables sensitive features by default
- Cross-Origin-* protections (COOP/COEP/CORP)
- HSTS enabled automatically when served over HTTPS

Adjust CSP if you add new external resources (fonts, CDN, analytics). Avoid `unsafe-inline`/`unsafe-eval`.

## Sanitization Utilities
`lib/security/sanitize.ts` provides:
- `escapeHTML`, `stripTags`, `sanitizeText` for rendering user input safely
- `SafeExternalLink` ensures `rel="noopener noreferrer"` + `_blank`

Use these helpers anywhere user-generated content is displayed.

## Resilient API Client
`lib/api/client.ts` implements:
- Timeout + retries + basic circuit breaker for transient failures
- Health probing via `apiClient.health()`
- Centralized JSON helpers

## Providers: Server-first with Fallback
- AuthProvider and GradingProvider use server API by default and gracefully fall back to local storage if the API is unavailable, preserving UX under outages.

## Error Handling & Observability
- ErrorBoundary wraps the app to prevent error cascades
- `useAsync` hook supports aborts, statuses, and error propagation
- `lib/core/logger.ts` provides structured console logs

## Recommended Next Steps
- Token-based auth header for apiClient + refresh logic (if not handled upstream)
- Server-side input validation and rate limiting
- Secrets management via environment variables (never commit secrets)
- Add SRI (integrity) for any external scripts/styles
- Expand CSP with nonces or hashes and remove `'unsafe-inline'` once inline styles/scripts are removed
