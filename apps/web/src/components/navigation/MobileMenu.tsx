/**
 * Mobile Menu Component
 * 
 * Responsive mobile navigation menu with hamburger icon
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Target, Award, Upload, BookOpen, LogOut, X 
} from 'lucide-react';
import { useFocusTrap } from '../../lib/accessibility/hooks';

interface MobileMenuProps {
  userName: string;
  userPoints: number;
  onLogout: () => void;
}

export function MobileMenu({ userName, userPoints, onLogout }: MobileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useFocusTrap(isOpen);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { icon: Users, label: 'Community', path: '/community', description: 'Join discussions' },
    { icon: Target, label: 'Challenges', path: '/challenges', description: 'View challenges' },
    { icon: Award, label: 'Badges', path: '/badges', description: 'Your achievements' },
    { icon: Upload, label: 'Submissions', path: '/submissions', description: 'Submit work' },
    { icon: BookOpen, label: 'Resources', path: '/resources', description: 'Learning materials' },
    { icon: Users, label: 'Profile', path: '/profile', description: 'Your profile' },
  ];

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="hamburger show-mobile"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 z-40 show-mobile"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <nav
            ref={menuRef}
            id="mobile-menu"
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-black border-l-2 border-matrix z-50 show-mobile overflow-y-auto"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-matrix">
                <div>
                  <div className="text-lg font-bold text-matrix-glow">{userName}</div>
                  <div className="text-sm text-muted">{userPoints} points</div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-matrix/20 rounded"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-matrix" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 py-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-matrix/10 transition-colors text-left"
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <Icon className="w-5 h-5 text-matrix flex-shrink-0" aria-hidden="true" />
                      <div className="flex-1">
                        <div className="text-bright font-medium">{item.label}</div>
                        <div className="text-xs text-muted">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t border-matrix">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-matrix/20 hover:bg-matrix/30 border border-matrix rounded transition-colors"
                  aria-label="Logout from application"
                >
                  <LogOut className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}

export default MobileMenu;

