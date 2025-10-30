import { ChallengeCatalog } from './types';

// Completion routes capture standard learning flows for students
const routes = {
  standard: {
    id: 'standard',
    name: 'Standard Exploitation',
    steps: [
      { id: 'recon', title: 'Recon', description: 'Identify the service, version, and attack surface.', required: true },
      { id: 'setup', title: 'Setup', description: 'Launch the Vulhub environment locally using Docker Compose.', required: true },
      { id: 'exploit', title: 'Exploit', description: 'Trigger the vulnerability to obtain impact (e.g., RCE, auth bypass).', required: true },
      { id: 'proof', title: 'Proof', description: 'Capture proof-of-work (screenshot, output, or file) showing success.', required: true },
      { id: 'hardening', title: 'Hardening', description: 'Explain a mitigation or configuration to prevent the issue.', required: false },
    ],
  },
  redTeam: {
    id: 'redTeam',
    name: 'Red Team Focus',
    steps: [
      { id: 'recon', title: 'Recon', description: 'Fingerprint and enumerate the exposed surface.', required: true },
      { id: 'exploit', title: 'Exploit', description: 'Achieve exploitation reliably (weaponize PoC).', required: true },
      { id: 'post', title: 'Post-Exploitation', description: 'Demonstrate impact (persistence, data access, etc.).', required: false },
      { id: 'proof', title: 'Proof', description: 'Provide evidence of impact and method.', required: true },
    ],
  },
  blueTeam: {
    id: 'blueTeam',
    name: 'Blue Team Focus',
    steps: [
      { id: 'setup', title: 'Setup', description: 'Launch the vulnerable environment and instrument logs.', required: true },
      { id: 'detect', title: 'Detect', description: 'Detect exploitation attempts and collect indicators.', required: true },
      { id: 'hardening', title: 'Hardening', description: 'Apply configuration or patch; validate fix.', required: true },
      { id: 'report', title: 'Report', description: 'Write a short incident/mitigation summary.', required: true },
    ],
  },
} as const;

// A compact seed list of challenges mapped to official Vulhub environments
// Source list reference: https://vulhub.org/environments
export const challengeCatalog: ChallengeCatalog = {
  routes: routes as any,
  challenges: [
    {
      id: 'nextjs-cve-2025-29927',
      title: 'Next.js Middleware Authorization Bypass',
      category: 'Framework / Auth Bypass',
      cve: 'CVE-2025-29927',
      difficulty: 'intermediate',
      defaultPoints: 150,
      vulhub: {
        path: 'framework/nextjs/CVE-2025-29927',
        url: 'https://vulhub.org/environments',
      },
      routeIds: ['standard', 'redTeam', 'blueTeam'],
      tags: ['framework', 'auth-bypass', 'nextjs'],
    },
    {
      id: 'langflow-cve-2025-3248',
      title: 'Langflow validate/code Pre-Auth RCE',
      category: 'LLM / RCE',
      cve: 'CVE-2025-3248',
      difficulty: 'advanced',
      defaultPoints: 250,
      vulhub: {
        path: 'llm/langflow/CVE-2025-3248',
        url: 'https://vulhub.org/environments',
      },
      routeIds: ['standard', 'redTeam', 'blueTeam'],
      tags: ['llm', 'rce', 'langflow'],
    },
    {
      id: 'h2-cve-2018-10054',
      title: 'H2 Console Authentication RCE',
      category: 'Database / RCE',
      cve: 'CVE-2018-10054',
      difficulty: 'intermediate',
      defaultPoints: 180,
      vulhub: {
        path: 'database/h2/CVE-2018-10054',
        url: 'https://vulhub.org/environments',
      },
      routeIds: ['standard', 'redTeam'],
      tags: ['database', 'rce', 'h2'],
    },
    {
      id: 'confluence-cve-2022-26134',
      title: 'Confluence OGNL Pre-Auth RCE',
      category: 'Expression Injection / RCE',
      cve: 'CVE-2022-26134',
      difficulty: 'advanced',
      defaultPoints: 220,
      vulhub: {
        path: 'expression-injection/confluence/CVE-2022-26134',
        url: 'https://vulhub.org/environments',
      },
      routeIds: ['standard', 'redTeam'],
      tags: ['ognl', 'rce', 'confluence'],
    },
    {
      id: 'spring-cve-2022-22963',
      title: 'Spring Cloud Function SpEL Injection',
      category: 'Expression Injection / RCE',
      cve: 'CVE-2022-22963',
      difficulty: 'intermediate',
      defaultPoints: 160,
      vulhub: {
        path: 'expression-injection/spring/CVE-2022-22963',
        url: 'https://vulhub.org/environments',
      },
      routeIds: ['standard', 'blueTeam'],
      tags: ['spring', 'spel', 'rce'],
    },
    {
      id: 'pgsql-cve-2018-1058',
      title: 'PostgreSQL Privilege Escalation',
      category: 'Privilege Escalation',
      cve: 'CVE-2018-1058',
      difficulty: 'advanced',
      defaultPoints: 200,
      vulhub: { path: 'priv-esc/postgresql/CVE-2018-1058', url: 'https://vulhub.org/environments' },
      routeIds: ['standard', 'blueTeam'],
      tags: ['postgresql', 'priv-esc'],
    },
    {
      id: 'drupal-cve-2019-6341',
      title: 'Drupal XSS by File Upload',
      category: 'CMS / XSS',
      cve: 'CVE-2019-6341',
      difficulty: 'beginner',
      defaultPoints: 120,
      vulhub: { path: 'cms/drupal/CVE-2019-6341', url: 'https://vulhub.org/environments' },
      routeIds: ['standard'],
      tags: ['cms', 'xss', 'file-upload'],
    },
  ],
};
