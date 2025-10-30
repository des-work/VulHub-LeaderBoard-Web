import { Badge, BadgeCatalog } from './types';
import { Submission } from '../grading/types';
import { ChallengeCatalog } from '../challenges/types';

export interface BadgeProgress {
  unlocked: Badge[];
  locked: Badge[];
}

export function evaluateBadges(
  userPoints: number,
  submissions: Submission[],
  badgeCatalog: BadgeCatalog,
  challengeCatalog: ChallengeCatalog
): BadgeProgress {
  const approved = submissions.filter(s => s.status === 'approved');

  const byCVE = new Set(approved.map(s => s.activityName).filter(Boolean));

  const categoryCount: Record<string, number> = {};
  for (const s of approved) {
    // Map activityName to challenge
    const ch = challengeCatalog.challenges.find(c => c.title === s.activityName || c.cve === s.activityName);
    if (ch) {
      categoryCount[ch.category] = (categoryCount[ch.category] || 0) + 1;
      if (ch.cve) byCVE.add(ch.cve);
    }
  }

  const unlocked: Badge[] = [];
  const locked: Badge[] = [];

  for (const b of badgeCatalog.badges) {
    let ok = true;
    for (const r of b.requirements) {
      if (r.type === 'points') {
        if (!r.points || userPoints < r.points) { ok = false; break; }
      } else if (r.type === 'complete-category') {
        const n = categoryCount[r.category || ''] || 0;
        if (!r.count || n < r.count) { ok = false; break; }
      } else if (r.type === 'complete-cve') {
        if (!r.cve || !byCVE.has(r.cve)) { ok = false; break; }
      } else if (r.type === 'route-step' || r.type === 'streak') {
        // Not implemented in evaluator v1; treat as locked by default
        ok = false; break;
      }
    }
    (ok ? unlocked : locked).push(b);
  }

  return { unlocked, locked };
}
