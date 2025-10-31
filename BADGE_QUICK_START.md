# 🏆 Badge System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide gets you up and running with the VulHub Badge System **fast**.

---

## 📦 What's in the Box?

```
✅ 20 pre-built badges across 5 categories
✅ 4 ready-to-use React components
✅ Complete TypeScript type safety
✅ Advanced filtering & search
✅ Beautiful Matrix-themed UI
✅ Production-ready architecture
```

---

## 🎯 Basic Usage

### **1. Display All Badges**

```tsx
// app/badges/page.tsx (already implemented!)
import { initializeBadges } from '@/lib/badges/utils';
import { BadgeCard } from '@/components/badges';

const badges = initializeBadges();

{badges.map(badge => (
  <BadgeCard key={badge.id} badge={badge} />
))}
```

### **2. Filter Badges**

```tsx
import { filterBadges } from '@/lib/badges/utils';

// Show only unlocked gold-tier badges
const filtered = filterBadges(badges, {
  tier: 'gold',
  status: 'unlocked'
});
```

### **3. Show Statistics**

```tsx
import { calculateBadgeStats } from '@/lib/badges/utils';
import { BadgeStats } from '@/components/badges';

const stats = calculateBadgeStats(badges);

<BadgeStats stats={stats} animated={true} />
```

### **4. Open Badge Details**

```tsx
import { BadgeModal } from '@/components/badges';

const [selectedBadge, setSelectedBadge] = useState(null);

<BadgeCard
  badge={badge}
  onClick={(badge) => setSelectedBadge(badge)}
/>

<BadgeModal
  badge={selectedBadge}
  isOpen={!!selectedBadge}
  onClose={() => setSelectedBadge(null)}
/>
```

---

## 🎨 Customization

### **Change Badge Card Size**

```tsx
<BadgeCard badge={badge} size="small" />   // Compact
<BadgeCard badge={badge} size="medium" />  // Default
<BadgeCard badge={badge} size="large" />   // Prominent
```

### **Hide Progress Bars**

```tsx
<BadgeCard badge={badge} showProgress={false} />
```

### **Disable Animations**

```tsx
<BadgeCard badge={badge} animated={false} />
```

---

## ➕ Add a New Badge

### **Step 1: Define the Badge**

Edit `lib/badges/data.ts`:

```typescript
export const BADGE_DEFINITIONS = [
  // ... existing badges ...
  {
    id: 'my-new-badge',
    name: 'My New Badge',
    description: 'Awarded for doing something awesome',
    category: 'achievement',
    tier: 'gold',
    rarity: 'rare',
    points: 150,
    icon: '🎉',
    requirements: [
      {
        id: 'req-awesome',
        description: 'Complete 10 awesome challenges',
        progress: 0,
        target: 10
      }
    ]
  }
];
```

### **Step 2: Done!**

That's it. The badge will automatically:
- ✅ Appear in the gallery
- ✅ Be filterable by category/tier/rarity
- ✅ Show in statistics
- ✅ Work with the modal
- ✅ Track progress

---

## 🔍 Search & Filter

### **Available Filters**

```typescript
interface BadgeFilterOptions {
  searchQuery?: string;           // Text search
  category?: 'all' | 'challenge' | 'streak' | 'milestone' | 'special' | 'achievement';
  tier?: 'all' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  rarity?: 'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  status?: 'all' | 'unlocked' | 'locked';
  sortBy?: 'name' | 'points' | 'rarity' | 'progress';
  sortOrder?: 'asc' | 'desc';
}
```

### **Example: Show Challenge Badges, Sorted by Points**

```tsx
const filtered = filterBadges(badges, {
  category: 'challenge',
  sortBy: 'points',
  sortOrder: 'desc'
});
```

---

## 📊 Get Badge Stats

```tsx
import { calculateBadgeStats } from '@/lib/badges/utils';

const stats = calculateBadgeStats(badges);

console.log(stats);
// {
//   total: 20,
//   unlocked: 3,
//   locked: 17,
//   byTier: { bronze: 4, silver: 6, gold: 7, platinum: 2, diamond: 1 },
//   byRarity: { common: 4, uncommon: 6, rare: 6, epic: 3, legendary: 1 },
//   byCategory: { challenge: 4, streak: 3, milestone: 4, special: 6, achievement: 5 },
//   totalPoints: 5000,
//   earnedPoints: 360
// }
```

---

## 🎯 Common Tasks

### **1. Show Recently Unlocked Badges**

```tsx
import { getRecentlyUnlockedBadges } from '@/lib/badges/utils';

const recent = getRecentlyUnlockedBadges(badges, 5);

{recent.map(badge => (
  <div key={badge.id}>
    {badge.icon} {badge.name} - Unlocked {badge.unlockedAt?.toLocaleDateString()}
  </div>
))}
```

### **2. Show Badges Near Completion**

```tsx
import { getBadgesNearCompletion } from '@/lib/badges/utils';

const nearlyDone = getBadgesNearCompletion(badges, 75);

{nearlyDone.map(badge => (
  <div key={badge.id}>
    {badge.icon} {badge.name} - {calculateBadgeProgress(badge)}% complete!
  </div>
))}
```

### **3. Find a Specific Badge**

```tsx
import { getBadgeById } from '@/lib/badges/utils';

const firstBlood = getBadgeById(badges, 'first-blood');
```

### **4. Format Badge Progress**

```tsx
import { formatBadgeProgress } from '@/lib/badges/utils';

const progressText = formatBadgeProgress(badge);
// Returns: "Unlocked" or "67% Complete"
```

---

## 🎨 Styling Tips

### **Colors**

Badges use the Matrix theme color tokens:

```css
/* Tier colors */
Bronze:   bg-amber-600
Silver:   bg-gray-400
Gold:     bg-yellow-400
Platinum: bg-cyan-400
Diamond:  bg-pink-400

/* Rarity colors */
Common:    bg-gray-500
Uncommon:  bg-green-500
Rare:      bg-blue-500
Epic:      bg-purple-500
Legendary: bg-orange-500
```

### **Override Styles**

```tsx
<BadgeCard
  badge={badge}
  className="my-custom-class"  // Add custom classes
/>
```

---

## 🔗 Backend Integration

### **Fetch User Badges from API**

Replace `initializeBadges()` in your page:

```tsx
// BEFORE (mock data)
const badges = initializeBadges();

// AFTER (real API)
const [badges, setBadges] = useState([]);

useEffect(() => {
  async function loadBadges() {
    const response = await fetch(`/api/v1/badges/user/${user.id}`);
    const data = await response.json();
    setBadges(data);
  }
  loadBadges();
}, [user.id]);
```

### **Track Badge Unlock**

```typescript
async function unlockBadge(userId: string, badgeId: string) {
  await fetch('/api/v1/badges/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, badgeId })
  });
  
  // Refresh badges
  const updated = await fetch(`/api/v1/badges/user/${userId}`).then(r => r.json());
  setBadges(updated);
}
```

---

## 🐛 Troubleshooting

### **"No badges showing"**
- Check that `initializeBadges()` is called
- Verify `BADGE_DEFINITIONS` is imported correctly

### **"Filters not working"**
- Ensure you're passing the updated `filters` state to `filterBadges()`
- Check filter values match the badge properties exactly

### **"Modal won't open"**
- Verify `isModalOpen` state is being set to `true`
- Check that `selectedBadge` is not `null`

### **"Progress stuck at 0%"**
- Mock data generates random progress by default
- For production, ensure backend sends progress values in the response

---

## 📚 Full Documentation

For complete details, see:
- **`BADGE_SYSTEM.md`** - Full system documentation
- **`BADGE_REFACTORING_SUMMARY.md`** - Architecture overview
- **Inline code comments** - JSDoc in all files

---

## 🎉 You're Ready!

The badge system is **fully functional** right now at `http://localhost:4010/badges`.

### **Try It Out**
1. Visit the badges page
2. Use the search bar to find badges
3. Apply filters (category, tier, rarity, status)
4. Click a badge to see details
5. Check the statistics dashboard

### **Next Steps**
- [ ] Add your own custom badges
- [ ] Connect to your backend API
- [ ] Add unlock notifications
- [ ] Integrate with leaderboard

---

**Need help?** Check `BADGE_SYSTEM.md` for the complete guide!

---

Built with 💚 for VulHub

