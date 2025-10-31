# Security Hardening - VulHub Leaderboard

## 🔒 Overview

This document outlines the security measures implemented in the VulHub Leaderboard application to protect against common web vulnerabilities and attacks.

---

## 📋 Table of Contents

1. [Content Security Policy (CSP)](#content-security-policy-csp)
2. [Input Validation](#input-validation)
3. [Rate Limiting](#rate-limiting)
4. [Authentication Security](#authentication-security)
5. [API Security](#api-security)
6. [Security Headers](#security-headers)
7. [Best Practices](#best-practices)

---

## 🛡️ Content Security Policy (CSP)

### Production CSP

The application implements a **strict Content Security Policy** in production:

```
default-src 'self'
script-src 'self' 'nonce-{random}'
style-src 'self' 'nonce-{random}' https://fonts.googleapis.com
img-src 'self' data: https:
font-src 'self' https://fonts.gstatic.com data:
connect-src 'self' {API_DOMAIN} wss: ws:
frame-ancestors 'none'
form-action 'self'
base-uri 'self'
object-src 'none'
upgrade-insecure-requests
```

### Development CSP

For development, the CSP is more permissive to allow hot reload and dev tools:

```
default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:
connect-src 'self' http://localhost:* ws://localhost:*
```

### Implementation

CSP is configured in `apps/web/src/middleware.ts` and automatically switches between production and development modes based on `NODE_ENV`.

---

## ✅ Input Validation

### Validation System

All user inputs are validated using a comprehensive validation system:

**Location**: `apps/web/src/lib/validation/schemas.ts`

### Validators

| Validator | Purpose | Rules |
|-----------|---------|-------|
| `email` | Email validation | RFC 5322 compliant, max 254 chars |
| `password` | Password strength | 8-128 chars, uppercase, lowercase, number, special char |
| `username` | Username format | 3-30 chars, alphanumeric with hyphens/underscores |
| `displayName` | Display name | 1-50 chars, alphanumeric with basic punctuation |
| `uuid` | UUID format | Standard UUID format |
| `url` | URL validation | HTTP/HTTPS only |

### Sanitization

**XSS Prevention**:
```typescript
sanitizeHtml(value: string): string
```
- Converts `<` to `&lt;`
- Converts `>` to `&gt;`
- Converts `"` to `&quot;`
- Converts `'` to `&#x27;`
- Converts `/` to `&#x2F;`

**SQL Injection Prevention**:
```typescript
sanitizeSql(value: string): string
```
- Escapes single quotes
- Removes semicolons

### Usage Example

```typescript
import { useValidation } from '@/lib/validation/useValidation';
import { authSchemas } from '@/lib/validation/schemas';

const { errors, isValid, validateField, validateAll } = useValidation(authSchemas.login);

const handleSubmit = (data) => {
  if (validateAll(data)) {
    // Submit form
  }
};
```

---

## ⏱️ Rate Limiting

### Rate Limit Configuration

**Location**: `apps/web/src/lib/security/rate-limiter.ts`

| Action | Max Requests | Time Window | Purpose |
|--------|--------------|-------------|---------|
| Login | 5 | 5 minutes | Prevent brute force |
| Register | 3 | 15 minutes | Prevent spam accounts |
| Password Reset | 3 | 15 minutes | Prevent abuse |
| Submissions | 10 | 1 hour | Prevent spam |
| API General | 100 | 1 minute | Prevent DoS |

### Implementation

Rate limiting is implemented client-side using localStorage and can be enforced server-side via the API.

```typescript
import { loginRateLimiter } from '@/lib/security/rate-limiter';

// Check rate limit
if (!loginRateLimiter.check()) {
  alert(`Too many attempts. Wait ${loginRateLimiter.getResetTime()}`);
  return;
}

// Increment on attempt
loginRateLimiter.increment();

// Reset on success
loginRateLimiter.reset();
```

### Rate Limit Error Handling

```typescript
try {
  await limitedFunction();
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(error.message); // "Rate limit exceeded. Try again in 2m 30s."
    console.log(error.remaining); // 0
  }
}
```

---

## 🔐 Authentication Security

### Token Management

**Location**: `apps/web/src/lib/api/client.ts`

- **Storage**: Access tokens stored in `localStorage`
- **Transmission**: Tokens sent via `Authorization: Bearer {token}` header
- **Refresh**: Automatic token refresh on expiry (401 response)
- **Logout**: Tokens cleared on logout

### Password Requirements

- **Minimum Length**: 8 characters
- **Maximum Length**: 128 characters
- **Complexity**:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### Mock vs. Real Authentication

The application supports two modes:

1. **Mock Mode** (Development):
   - Uses local storage for authentication
   - No API calls
   - Instant response

2. **Real Mode** (Production):
   - Uses backend API
   - Token-based authentication
   - Automatic fallback to mock on API failure

**Configuration**: Set `USE_MOCK_AUTH=true` in `.env` for mock mode.

---

## 🌐 API Security

### API Client Features

**Location**: `apps/web/src/lib/api/client.ts`

| Feature | Description |
|---------|-------------|
| **Retry Logic** | Automatic retry on transient failures (3 attempts) |
| **Timeout** | 10-second timeout on all requests |
| **Circuit Breaker** | Stops requests after 5 consecutive failures |
| **Authentication** | Automatic token injection |
| **Error Handling** | Comprehensive error types and messages |

### Endpoint Security

All API endpoints implement:

- **Authentication**: Bearer token required
- **Authorization**: Role-based access control
- **Validation**: Server-side input validation
- **Sanitization**: SQL injection prevention
- **Rate Limiting**: Per-endpoint rate limits

---

## 📄 Security Headers

**Location**: `apps/web/src/middleware.ts`

### Headers Applied

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `X-DNS-Prefetch-Control` | `off` | Disable DNS prefetching |
| `Permissions-Policy` | `interest-cohort=()` | Disable FLoC tracking |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforce HTTPS (production) |
| `Content-Security-Policy` | (see above) | Restrict resource loading |

---

## ✨ Best Practices

### For Developers

1. **Always Validate Inputs**
   - Use `useValidation` hook for forms
   - Sanitize all user inputs
   - Never trust client-side validation alone

2. **Use Rate Limiters**
   - Apply rate limiting to all sensitive actions
   - Use pre-configured limiters for consistency
   - Reset limiters on successful operations

3. **Handle Errors Securely**
   - Don't expose sensitive error details to users
   - Log errors server-side for debugging
   - Use generic error messages for users

4. **Secure API Calls**
   - Always use the `ApiClient` class
   - Don't bypass authentication
   - Handle token refresh properly

5. **Test Security**
   - Test rate limiting behavior
   - Test input validation edge cases
   - Test authentication flows
   - Test CSP compliance

### For Deployments

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Configure `NEXT_PUBLIC_API_URL` correctly
   - Never commit secrets to version control

2. **HTTPS**
   - Always use HTTPS in production
   - Configure SSL certificates properly
   - Enable HSTS

3. **Monitoring**
   - Monitor failed login attempts
   - Track rate limit violations
   - Log security events

4. **Updates**
   - Keep dependencies up to date
   - Apply security patches promptly
   - Run security audits regularly

---

## 🚨 Incident Response

### If a Security Issue is Discovered

1. **Report**: Email security@vulhub-leaderboard.com (or contact admin)
2. **Don't Disclose Publicly**: Keep details private until patched
3. **Provide Details**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **24 hours**: Initial acknowledgment
- **7 days**: Assessment and fix development
- **14 days**: Patch deployment and disclosure

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)

---

## 📝 Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-31 | 1.0.0 | Initial security hardening implementation |

---

## ✅ Security Checklist

- [x] Content Security Policy configured
- [x] Input validation implemented
- [x] Rate limiting applied
- [x] Authentication secured
- [x] Security headers set
- [x] XSS prevention measures
- [x] SQL injection prevention
- [x] HTTPS enforced (production)
- [x] Error handling secured
- [x] API client hardened
- [ ] Security audit completed
- [ ] Penetration testing performed
- [ ] Security monitoring configured

---

**Last Updated**: October 31, 2025  
**Maintained By**: VulHub Leaderboard Security Team

