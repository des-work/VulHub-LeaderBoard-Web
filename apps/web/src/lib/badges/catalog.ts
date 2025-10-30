import { BadgeCatalog } from './types';

export const badgeCatalog: BadgeCatalog = {
  badges: [
    // Category explorers
    { id: 'explorer-rce-bronze', name: 'RCE Explorer (Bronze)', tier: 'bronze', description: 'Complete 1 RCE challenge.', requirements: [{ type: 'complete-category', category: 'RCE', count: 1 }] },
    { id: 'explorer-rce-silver', name: 'RCE Explorer (Silver)', tier: 'silver', description: 'Complete 3 RCE challenges.', requirements: [{ type: 'complete-category', category: 'RCE', count: 3 }] },
    { id: 'explorer-rce-gold', name: 'RCE Explorer (Gold)', tier: 'gold', description: 'Complete 5 RCE challenges.', requirements: [{ type: 'complete-category', category: 'RCE', count: 5 }] },

    // Auth Bypass
    { id: 'auth-bypass-bronze', name: 'Auth Assassin (Bronze)', tier: 'bronze', description: 'Beat 1 Auth Bypass challenge.', requirements: [{ type: 'complete-category', category: 'Auth Bypass', count: 1 }] },

    // LLM
    { id: 'llm-tamer', name: 'LLM Tamer', tier: 'silver', description: 'Complete 2 LLM challenges.', requirements: [{ type: 'complete-category', category: 'LLM', count: 2 }] },

    // Mastery
    { id: 'tenacious', name: 'Tenacious', tier: 'gold', description: 'Reach 2,500 points total.', requirements: [{ type: 'points', points: 2500 }] },
    { id: 'legend', name: 'Legend', tier: 'platinum', description: 'Reach 10,000 points total.', requirements: [{ type: 'points', points: 10000 }] },

    // Blue team
    { id: 'defender', name: 'Defender', tier: 'silver', description: 'Complete a Blue Team route with Hardening.', requirements: [{ type: 'route-step', routeId: 'blueTeam', stepId: 'hardening', count: 1 }] },

    // CVE specific
    { id: 'cve-confluence-26134', name: 'OGNL Breaker', tier: 'gold', description: 'Exploit Confluence CVE‑2022‑26134 via Vulhub.', requirements: [{ type: 'complete-cve', cve: 'CVE-2022-26134', count: 1 }] },
  ],
};
