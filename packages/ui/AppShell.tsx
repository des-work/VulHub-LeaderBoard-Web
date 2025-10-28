import { cn } from '@/lib/utils';
import { Castle, Swords, Shield, User } from 'lucide-react'; // Thematic icons

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', icon: Castle, href: '/dashboard' },
  { name: 'Siege Rankings', icon: Swords, href: '/leaderboard' },
  { name: 'Your Armory', icon: User, href: '/profile' },
  { name: 'Banners', icon: Shield, href: '/badges' },
];

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-surface-1 border-r border-border/50 p-4 flex flex-col">
        <div className="text-2xl font-bold text-foreground-primary text-glow mb-8">
          VulHub Siege
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <a href={item.href} className="flex items-center gap-3 p-2 rounded-md text-foreground-muted hover:bg-surface-2 hover:text-foreground-base transition-colors">
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>
    </div>
  );
};