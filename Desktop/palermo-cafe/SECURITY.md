# Security Policy - Palermo Café

## Overview

This document outlines the security measures implemented in the Palermo Café web application and provides guidance for maintaining security in production.

## Security Architecture

### Authentication & Authorization
- **JWT-based authentication** with secure cookie storage
- **Role-based access control (RBAC)**: admin, editor roles
- **Password hashing** with bcrypt (12 rounds)
- **Timing-attack resistant** login verification
- **Session management** with secure, HTTP-only cookies

### Security Headers
All security headers are consistently applied across:
- `next.config.ts` (Next.js level)
- `src/middleware.ts` (Request level)

| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-XSS-Protection | 1; mode=block | XSS protection (legacy browsers) |
| Referrer-Policy | strict-origin-when-cross-origin | Control referrer info |
| Permissions-Policy | camera=(), microphone=(), etc. | Disable browser features |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | Force HTTPS |
| Content-Security-Policy | See middleware.ts | Prevent XSS/injection |
| X-DNS-Prefetch-Control | off | Prevent DNS prefetching |
| X-Download-Options | noopen | Prevent file downloads from executing |
| X-Permitted-Cross-Domain-Policies | none | Prevent cross-domain policy loading |

### Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' https://www.googletagmanager.com;
style-src 'self' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://maps.googleapis.com;
connect-src 'self' https://maps.googleapis.com;
frame-src 'self' https://www.google.com https://maps.google.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests
```

### Input Validation
- **Zod schemas** for all API inputs
- **SQL injection prevention** via Prisma ORM (parameterized queries)
- **XSS prevention** via input sanitization
- **SSRF prevention** via URL validation

### Rate Limiting
- Login: 5 attempts per 15 minutes per IP
- Reservations: 5 per hour per IP
- Contact form: 5 per hour per IP
- Newsletter: 3 per hour per IP

### Data Protection
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with 7-day expiration
- Sensitive data not exposed in API responses
- Database file excluded from git

## Production Deployment Checklist

### Environment Variables
```bash
# Generate a strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Set in production environment
JWT_SECRET=<your-generated-secret>
DATABASE_URL=postgresql://...
ALLOWED_ORIGINS=https://palermocafe.pe
```

### Infrastructure
- [ ] Use HTTPS everywhere (TLS 1.3 preferred)
- [ ] Configure WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Enable database encryption at rest

### Application
- [ ] Change default admin credentials
- [ ] Remove any test/development data
- [ ] Enable production logging
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring

### Database
- [ ] Use PostgreSQL in production (not SQLite)
- [ ] Enable connection pooling
- [ ] Configure automated backups
- [ ] Set up point-in-time recovery
- [ ] Restrict database access by IP

## Known Limitations

### Development vs Production
1. **Rate Limiting**: In-memory only (dev). Use Redis in production.
2. **JWT Secret**: Development fallback exists. MUST set strong secret in production.
3. **Logging**: Console only (dev). Use structured logging service in production.
4. **Database**: SQLite (dev). PostgreSQL required for production.

### Future Improvements
- [ ] Implement CSRF tokens for form submissions
- [ ] Add MFA for admin accounts
- [ ] Implement account lockout after failed attempts
- [ ] Add audit logging for admin actions
- [ ] Implement rate limiting with Redis
- [ ] Add API key authentication for external integrations
- [ ] Set up automated security scanning

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:
1. Do NOT public disclosure
2. Contact the development team directly
3. Provide detailed reproduction steps

## Security Testing

### Manual Testing
- SQL Injection: Test all input fields
- XSS: Test all input/output points
- Authentication: Test login/logout flows
- Authorization: Test role-based access
- CSRF: Test state-changing operations

### Automated Tools
- OWASP ZAP
- Burp Suite
- npm audit
- Snyk

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
