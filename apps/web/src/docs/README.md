# VulHub Leaderboard Documentation

Welcome to the VulHub Leaderboard documentation! This directory contains comprehensive guides for developers, designers, and users.

## 📚 Documentation Index

### **Design System**
- [🎨 Design System Guide](./design-system.md) - Complete color palette, typography, and visual effects documentation
- [⚡ Quick Reference](./quick-reference.md) - Developer quick reference for colors, fonts, and effects

### **API Documentation**
- [🔌 API Reference](./api.md) - Complete API endpoints, data models, and authentication

### **Component Documentation**
- [📊 Leaderboard Components](../components/leaderboard/) - Stacked bar chart and leaderboard display components
- [🔐 Authentication Components](../components/auth/) - Login, registration, and user management
- [📤 Submission Components](../components/submissions/) - File upload and submission handling

## 🎯 Quick Start

### **For Developers**
1. Read the [Quick Reference](./quick-reference.md) for immediate coding help
2. Check the [Design System Guide](./design-system.md) for styling guidelines
3. Review the [API Documentation](./api.md) for backend integration

### **For Designers**
1. Start with the [Design System Guide](./design-system.md) for color and typography
2. Use the [Quick Reference](./quick-reference.md) for CSS classes and effects
3. Check component documentation for implementation details

### **For Users**
1. Visit the main application at `http://localhost:3000`
2. Register with your school ID and password
3. Complete the tutorial to get started
4. Submit proof of completed vulnerabilities
5. Watch your progress on the live leaderboard

## 🎨 Design System Overview

### **Color Palette**
- **Purple** (`#a855f7`) - Primary brand color
- **Red** (`#ef4444`) - Accent and highlights  
- **Black** (`#000000`) - Background
- **Green** (`#22c55e`) - Success states

### **Typography**
- **Orbitron** - Headers and titles (futuristic)
- **Exo 2** - Body text (modern geometric)
- **JetBrains Mono** - Code and technical content
- **Audiowide** - Display text (bold futuristic)

### **Visual Effects**
- Flickering text animations
- Neon glow effects
- Gradient backgrounds
- WebGL ripple effects

## 🔧 Development

### **Font Switching**
```typescript
import { fontClasses } from '../lib/fonts/font-utils';

// Use in JSX
<h1 className={`${fontClasses.header} text-4xl`}>Title</h1>
<p className={`${fontClasses.body} text-base`}>Body</p>
<code className={`${fontClasses.code} text-sm`}>Code</code>
<div className={`${fontClasses.display} text-6xl`}>Display</div>
```

### **Color Usage**
```html
<!-- Primary purple -->
<h1 class="text-purple-400">Title</h1>

<!-- Red accent -->
<h2 class="text-red-400">Subtitle</h2>

<!-- Green success -->
<p class="text-green-400">Success</p>

<!-- Black background -->
<div class="bg-black">Container</div>
```

### **Visual Effects**
```html
<!-- Flickering text -->
<h1 class="flicker">Flickering Text</h1>

<!-- Neon glow -->
<h2 class="neon-glow-purple">Purple Glow</h2>

<!-- Rainbow text -->
<h3 class="text-rainbow">Rainbow Text</h3>
```

## 📊 Features

### **Authentication**
- Student registration with school ID
- Secure login system
- User profile management
- Tutorial system for new users

### **Leaderboard**
- Real-time stacked bar chart
- Live user comparisons
- Point-based ranking system
- Level progression tracking

### **Submissions**
- File upload system
- Activity linking
- Grading workflow
- Progress tracking

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:3000`

4. **Register and explore**
   Create an account and explore the features

## 📝 Contributing

1. Read the relevant documentation
2. Follow the design system guidelines
3. Use the established color palette and typography
4. Test your changes thoroughly
5. Update documentation as needed

## 🆘 Support

- Check the [Quick Reference](./quick-reference.md) for common questions
- Review the [Design System Guide](./design-system.md) for styling help
- Consult the [API Documentation](./api.md) for backend integration
- Create an issue in the repository for bugs or feature requests

---

**Happy coding! 🚀**
