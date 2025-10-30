# Challenges & Badges

Challenges are mapped directly to official Vulhub environments; badges reward progress and mastery.

> Source catalog referenced: [Vulhub Environments](https://vulhub.org/environments)

## Completion Routes
- Standard: Recon → Setup → Exploit → Proof → (optional) Hardening
- Red Team: Recon → Exploit → Post‑Exploitation → Proof
- Blue Team: Setup → Detect → Hardening → Report

Each challenge supports one or more routes. A route consists of ordered steps students complete when submitting proof.

## Seed Catalog
Examples (extensible):
- Next.js Middleware Authorization Bypass (CVE‑2025‑29927) – 150 pts – Framework/Auth Bypass
- Langflow `validate/code` Pre‑Auth RCE (CVE‑2025‑3248) – 250 pts – LLM/RCE
- H2 Console Authentication RCE (CVE‑2018‑10054) – 180 pts – Database/RCE
- Confluence OGNL Pre‑Auth RCE (CVE‑2022‑26134) – 220 pts – Expression Injection/RCE
- Spring Cloud Function SpEL Injection (CVE‑2022‑22963) – 160 pts – Expression Injection/RCE
- PostgreSQL Privilege Escalation (CVE‑2018‑1058) – 200 pts – Privilege Escalation
- Drupal XSS by File Upload (CVE‑2019‑6341) – 120 pts – CMS/XSS

## Badges
- Category Explorer (Bronze/Silver/Gold): complete `N` challenges in a category (e.g., RCE)
- Auth Assassin: complete an Auth Bypass challenge
- LLM Tamer: complete two LLM challenges
- Tenacious/Legend: reach 2,500/10,000 points total
- Defender: complete Blue Team route with Hardening step
- OGNL Breaker: complete Confluence CVE‑2022‑26134

## Integration
- Submission Form: choose a challenge and route; attach proof per step
- Grading Console: award points based on difficulty/route, trigger badge evaluation
- Leaderboard: updates instantly after approved grades

## Extend
- Bulk import of Vulhub environments into the catalog
- Admin UI for point tuning, difficulty, and badge rules
