// Challenge domain types for mapping Vulhub environments to app challenges

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CompletionStep {
  id: string;            // e.g., 'recon', 'setup', 'exploit', 'proof', 'hardening'
  title: string;         // Display
  description: string;   // Guidance
  required: boolean;     // Must complete to finish
}

export interface CompletionRoute {
  id: string;            // e.g., 'standard', 'blue-team', 'red-team'
  name: string;
  steps: CompletionStep[];
}

export interface VulhubRef {
  path: string;         // e.g., 'framework/nextjs/CVE-2025-29927' (category/name/CVE)
  url: string;          // full URL to docs
}

export interface Challenge {
  id: string;                     // stable id
  title: string;                  // display title
  category: string;               // e.g., 'RCE', 'Auth Bypass', 'Path Traversal'
  cve?: string;                   // CVE if available
  difficulty: Difficulty;
  defaultPoints: number;          // baseline points for leaderboard
  vulhub: VulhubRef;              // reference to vulhub environment
  routeIds: string[];             // supported completion route ids
  tags: string[];                 // search facets
}

export interface ChallengeCatalog {
  routes: Record<string, CompletionRoute>;
  challenges: Challenge[];
}
