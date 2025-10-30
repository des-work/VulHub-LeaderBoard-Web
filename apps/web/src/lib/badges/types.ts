export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface BadgeRequirement {
  type: 'complete-category' | 'complete-cve' | 'streak' | 'points' | 'route-step';
  category?: string;       // for complete-category
  cve?: string;            // for complete-cve
  count?: number;          // number needed
  points?: number;         // points threshold
  routeId?: string;        // for route-step
  stepId?: string;         // for route-step
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;           // optional icon key
  tier: BadgeTier;
  requirements: BadgeRequirement[];
  pointsReward?: number;   // optional bonus points on unlock
}

export interface BadgeCatalog {
  badges: Badge[];
}
