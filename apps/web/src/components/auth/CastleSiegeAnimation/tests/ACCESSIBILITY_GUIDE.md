# Accessibility Testing Guide

## Overview

This guide covers testing accessibility features of the Castle Siege Animation system.

---

## Screen Reader Testing

### Test with NVDA (Windows)

1. **Install NVDA**: Download from https://www.nvaccess.org/
2. **Start NVDA**: Press Insert + Z to start
3. **Navigate to animation**: Use arrow keys to navigate
4. **Listen for announcements**: 
   - Phase changes should be announced
   - Skip instructions should be provided
   - Error messages should be read

### Test with JAWS (Windows)

1. **Install JAWS**: Commercial screen reader
2. **Navigate**: Use standard navigation keys
3. **Check announcements**: Verify all announcements are read

### Test with VoiceOver (Mac)

1. **Enable VoiceOver**: Cmd + F5
2. **Navigate**: Use VO + Arrow keys
3. **Check announcements**: Verify phase announcements

---

## Keyboard Navigation Testing

### Test Escape Key

```typescript
// Simulate Escape key press
const event = new KeyboardEvent('keydown', {
  key: 'Escape',
  code: 'Escape',
  keyCode: 27,
});

document.dispatchEvent(event);
```

**Expected**: Animation should skip

### Test Tab Navigation

1. **Tab to skip button**: Should be accessible
2. **Enter to activate**: Should skip animation
3. **Focus visible**: Button should have visible focus indicator

---

## Reduced Motion Testing

### Test Reduced Motion Detection

```typescript
// Mock reduced motion preference
window.matchMedia = jest.fn().mockReturnValue({
  matches: true,
  media: '(prefers-reduced-motion: reduce)',
  // ... other properties
});

const shouldShow = shouldShowAnimation();
expect(shouldShow).toBe(false);
```

**Expected**: Animation should not show

---

## High Contrast Testing

### Test High Contrast Detection

```typescript
// Mock high contrast preference
window.matchMedia = jest.fn().mockReturnValue({
  matches: true,
  media: '(prefers-contrast: high)',
  // ... other properties
});

const config = animationAccessibility.getConfig();
expect(config.highContrastMode).toBe(true);
```

**Expected**: High contrast mode should be detected

---

## ARIA Attributes Testing

### Test ARIA Labels

```typescript
const attrs = animationAccessibility.getAccessibilityAttributes();
expect(attrs['aria-label']).toBe('VulHub Leaderboard animation');
expect(attrs.role).toBe('img');
```

**Expected**: Proper ARIA attributes

### Test Live Regions

```typescript
const liveRegion = document.getElementById('animation-live-region');
expect(liveRegion).toBeTruthy();
expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
```

**Expected**: Live region exists with proper attributes

---

## Automated Testing

### Jest Test Example

```typescript
describe('Accessibility', () => {
  it('should announce phase changes', () => {
    const announceSpy = jest.spyOn(animationAccessibility, 'announce');
    
    animationAccessibility.announcePhaseChange('battle', 'Battle phase');
    
    expect(announceSpy).toHaveBeenCalledWith(
      expect.stringContaining('battle'),
      'polite'
    );
  });
});
```

---

## Manual Testing Checklist

- [ ] Screen reader announces animation start
- [ ] Screen reader announces phase changes
- [ ] Skip button is keyboard accessible
- [ ] Escape key skips animation
- [ ] Reduced motion preference is respected
- [ ] High contrast mode is detected
- [ ] ARIA attributes are correct
- [ ] Live regions are properly configured
- [ ] Focus indicators are visible
- [ ] All interactive elements are keyboard accessible

---

## Browser Testing

### Chrome
- Use Chrome DevTools Accessibility panel
- Check ARIA attributes
- Verify contrast ratios

### Firefox
- Use Firefox Accessibility Inspector
- Check keyboard navigation
- Verify screen reader compatibility

### Safari
- Use VoiceOver
- Test reduced motion
- Verify keyboard support

---

## Tools

### Automated Tools
- **axe-core**: Accessibility testing library
- **Pa11y**: Command-line accessibility testing
- **Lighthouse**: Includes accessibility audit

### Manual Tools
- **NVDA**: Free Windows screen reader
- **JAWS**: Commercial Windows screen reader
- **VoiceOver**: Built-in Mac screen reader
- **TalkBack**: Android screen reader

---

## Common Issues

### Issue: Announcements Not Read
**Solution**: Ensure live region is properly configured and updated

### Issue: Keyboard Navigation Not Working
**Solution**: Verify event handlers are attached and not prevented

### Issue: Reduced Motion Not Respected
**Solution**: Check `prefers-reduced-motion` detection

### Issue: Focus Not Visible
**Solution**: Add visible focus indicators via CSS

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

