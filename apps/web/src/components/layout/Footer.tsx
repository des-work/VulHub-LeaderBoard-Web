'use client';

import { UnifiedIcon, Terminology, VisualEffect } from '../../ui-library';
import { Trophy, Github, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-black border-t border-green-500/30 py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <VisualEffect type="neon">
                <UnifiedIcon name="trophy" size={24} className="text-green-400" />
              </VisualEffect>
              <span className="text-xl font-bold text-green-400 font-mono">
                <Terminology>VulHub Leaderboard</Terminology>
              </span>
            </div>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              <Terminology>
                Empowering the next generation of cybersecurity professionals 
                through competitive learning and real-world challenges.
              </Terminology>
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 font-mono">
              <Terminology>Platform</Terminology>
            </h4>
            <ul className="space-y-2 text-gray-400 font-mono">
              <li>
                <a href="/leaderboard" className="hover:text-green-400 transition-colors duration-300">
                  <Terminology>Leaderboards</Terminology>
                </a>
              </li>
              <li>
                <a href="/challenges" className="hover:text-green-400 transition-colors duration-300">
                  <Terminology>Challenges</Terminology>
                </a>
              </li>
              <li>
                <a href="/badges" className="hover:text-green-400 transition-colors duration-300">
                  <Terminology>Badges</Terminology>
                </a>
              </li>
              <li>
                <a href="/community" className="hover:text-green-400 transition-colors duration-300">
                  <Terminology>Community</Terminology>
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 font-mono">
              <Terminology>Resources</Terminology>
            </h4>
            <ul className="space-y-2 text-gray-400 font-mono">
              <li>
                <a href="/docs" className="hover:text-green-400 transition-colors duration-300">
                  <Terminology>Documentation</Terminology>
                </a>
              </li>
              <li>
                <a href="/tutorials" className="hover:text-green-400 transition-colors duration-300">
                  <Terminology>Tutorials</Terminology>
                </a>
              </li>
              <li>
                <a href="/api" className="hover:text-green-400 transition-colors duration-300">
                  <Terminology>API</Terminology>
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-green-400 transition-colors duration-300">
                  <Terminology>Support</Terminology>
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 font-mono">
              <Terminology>Connect</Terminology>
            </h4>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://discord.gg/vulhub" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                aria-label="Discord"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
              <a 
                href="https://github.com/vulhub" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com/vulhub" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com/company/vulhub" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-500 font-mono text-xs">
              <Terminology>Join our community of hackers</Terminology>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-500/20 mt-8 pt-8 text-center">
          <p className="text-gray-500 font-mono text-sm">
            © 2025 CSUSB Cybersecurity Program. <Terminology>All rights reserved.</Terminology>
          </p>
        </div>
      </div>
    </footer>
  );
}
