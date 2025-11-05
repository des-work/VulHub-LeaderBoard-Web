'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { List, Search } from 'lucide-react';
import { 
  VULHUB_CATEGORIES, 
  VULHUB_VULNERABILITIES,
  searchCategories,
  searchVulnerabilities,
  getCategoryById as _getCategoryById,
  getVulnerabilitiesByCategory,
  type CategoryInfo,
  type VulnerabilityInfo
} from '../../lib/vulhub/categories';

// Import new modular components
import { WelcomeScreen } from '../../components/community/WelcomeScreen';
import { TerminalHeader } from '../../components/community/TerminalHeader';
import { TerminalWindow } from '../../components/community/TerminalWindow';
import { CategoryCard } from '../../components/community/CategoryCard';
import { VulnerabilityCard } from '../../components/community/VulnerabilityCard';
import { QuickActionButton } from '../../components/community/QuickActionButton';

// Import configuration and utilities
import { COLORS, BACKGROUND_EFFECTS, ANIMATIONS } from '../../lib/community/config';
import { getTypingSpeed } from '../../lib/community/utils';

export default function CommunityPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{type: 'system' | 'user' | 'result', content: string | React.ReactNode}>>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [currentView, setCurrentView] = useState<'welcome' | 'search' | 'category' | 'thread'>('welcome');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityInfo | null>(null);
  const [onlineUsers] = useState(Math.floor(Math.random() * 50) + 10);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMessage = `Welcome to VulHub Community Terminal

> Initializing knowledge base...
> Loading ${VULHUB_VULNERABILITIES.length} vulnerabilities...
> ${VULHUB_CATEGORIES.length} categories indexed
> System ready.

What knowledge do you seek?`;

  // Typing animation using config speed
  useEffect(() => {
    if (currentView === 'welcome' && isTyping && showWelcome) {
      const fullText = welcomeMessage;
      let currentIndex = 0;
      const typingSpeed = getTypingSpeed('normal');
      
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypedText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setTimeout(() => {
            setHistory([{ type: 'system', content: fullText }]);
            setShowWelcome(false);
          }, ANIMATIONS.durations.slow);
        }
      }, typingSpeed);

      return () => clearInterval(typeInterval);
    }
  }, [currentView, isTyping, showWelcome]);

  // Focus input on load
  useEffect(() => {
    if (!isTyping && !showWelcome) {
      inputRef.current?.focus();
    }
  }, [isTyping, showWelcome]);

  // Handle keyboard to dismiss welcome screen
  useEffect(() => {
    if (!isTyping && showWelcome) {
      const handleKeyPress = () => {
        setHistory([{ type: 'system', content: welcomeMessage }]);
        setShowWelcome(false);
      };
      
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isTyping, showWelcome]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    setHistory(prev => [...prev, { type: 'user', content: `$ ${cmd}` }]);
    
    if (!trimmedCmd) {return;}

    if (trimmedCmd === 'help') {
      setHistory(prev => [...prev, {
        type: 'system',
        content: `Available Commands:
• list categories - Show all vulnerability categories
• search <query> - Search for vulnerabilities or categories
• Enter category name to view vulnerabilities
• Enter vulnerability name to open discussion thread
• clear - Clear terminal
• back - Return to welcome screen`
      }]);
      return;
    }

    if (trimmedCmd === 'clear') {
      setHistory([]);
      setCurrentView('welcome');
      setIsTyping(true);
      setShowWelcome(true);
      setTypedText('');
      return;
    }

    if (trimmedCmd === 'back') {
      setHistory([]);
      setCurrentView('welcome');
      setIsTyping(true);
      setShowWelcome(true);
      setTypedText('');
      setSelectedCategory(null);
      setSelectedVuln(null);
      return;
    }

    if (trimmedCmd === 'list categories' || trimmedCmd === 'categories') {
      setHistory(prev => [...prev, {
        type: 'result',
        content: (
          <div className="space-y-2 my-4">
            <div style={{ color: COLORS.matrix.primary }} className="font-bold">╔═══ Available Categories ═══╗</div>
            <div className="space-y-2">
              {VULHUB_CATEGORIES.map(cat => (
                <CategoryCard
                  key={cat.id}
                  icon={cat.icon}
                  name={cat.name}
                  description={cat.description}
                  count={cat.count}
                  onClick={() => {
                    setInput(cat.name);
                    handleCommand(cat.name);
                  }}
                />
              ))}
            </div>
            <div style={{ color: COLORS.matrix.primary }} className="font-bold">╚════════════════════════════╝</div>
          </div>
        )
      }]);
      return;
    }

    // Search for categories or vulnerabilities
    const categoryMatch = VULHUB_CATEGORIES.find(cat => 
      cat.name.toLowerCase() === trimmedCmd || 
      cat.id === trimmedCmd
    );

    if (categoryMatch) {
      const vulns = getVulnerabilitiesByCategory(categoryMatch.id);
      setSelectedCategory(categoryMatch);
      setHistory(prev => [...prev, {
        type: 'result',
        content: (
          <div className="space-y-3 my-4">
            <div style={{ color: COLORS.matrix.primary }} className="font-bold text-xl">
              ╔═══ {categoryMatch.icon} {categoryMatch.name} ═══╗
            </div>
            <div style={{ color: COLORS.text.muted }} className="pl-2">{categoryMatch.description}</div>
            <div style={{ color: COLORS.cyan.primary }} className="pl-2">Found {vulns.length} vulnerabilities:</div>
            <div className="space-y-2 pl-2">
              {vulns.map(vuln => (
                <VulnerabilityCard
                  key={vuln.id}
                  name={vuln.name}
                  cve={vuln.cve}
                  description={vuln.description}
                  tags={vuln.tags}
                  onClick={() => handleVulnSelect(vuln)}
                />
              ))}
            </div>
            <div style={{ color: COLORS.matrix.primary }} className="font-bold">╚════════════════════════════╝</div>
          </div>
        )
      }]);
      return;
    }

    // Search vulnerabilities
    const vulnResults = searchVulnerabilities(trimmedCmd);
    const catResults = searchCategories(trimmedCmd);

    if (vulnResults.length > 0 || catResults.length > 0) {
      setHistory(prev => [...prev, {
        type: 'result',
        content: (
          <div className="space-y-3 my-4">
            <div style={{ color: COLORS.matrix.primary }} className="font-bold">╔═══ Search Results ═══╗</div>
            
            {catResults.length > 0 && (
              <div>
                <div style={{ color: COLORS.cyan.primary }} className="font-semibold pl-2">Categories ({catResults.length}):</div>
                {catResults.map(cat => (
                  <div 
                    key={cat.id} 
                    className="cursor-pointer hover:pl-6 transition-all pl-4"
                    onClick={() => handleCommand(cat.name)}
                    style={{ color: COLORS.text.secondary }}
                  >
                    {cat.icon} {cat.name} ({cat.count} vulns)
                  </div>
                ))}
              </div>
            )}
            
            {vulnResults.length > 0 && (
              <div>
                <div style={{ color: COLORS.cyan.primary }} className="font-semibold pl-2">Vulnerabilities ({vulnResults.length}):</div>
                {vulnResults.map(vuln => (
                  <VulnerabilityCard
                    key={vuln.id}
                    name={vuln.name}
                    cve={vuln.cve}
                    description={vuln.description}
                    tags={vuln.tags}
                    onClick={() => handleVulnSelect(vuln)}
                  />
                ))}
              </div>
            )}
            
            <div style={{ color: COLORS.matrix.primary }} className="font-bold">╚══════════════════════════╝</div>
          </div>
        )
      }]);
    } else {
      setHistory(prev => [...prev, {
        type: 'system',
        content: `No results found for "${cmd}". Try:
• "list categories" to see all categories
• "help" for available commands`
      }]);
    }
  };

  const handleVulnSelect = (vuln: VulnerabilityInfo) => {
    setSelectedVuln(vuln);
    setCurrentView('thread');
    router.push(`/community/thread/${vuln.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div 
      className="min-h-screen font-mono relative overflow-hidden"
      style={{ backgroundColor: COLORS.background.black }}
    >
      {/* Scan line effect */}
      {BACKGROUND_EFFECTS.scanLines.enabled && (
        <div 
          className="fixed inset-0 pointer-events-none opacity-10" 
          style={{
            backgroundImage: `linear-gradient(rgba(${COLORS.matrix.primary === '#00ff00' ? '0, 255, 0' : '0, 255, 255'}, ${BACKGROUND_EFFECTS.scanLines.opacity}) 1px, transparent 1px)`,
            backgroundSize: `100% ${BACKGROUND_EFFECTS.scanLines.lineSpacing}`,
          }}
        />
      )}
      
      {/* Matrix grid background */}
      {BACKGROUND_EFFECTS.gridBackground.enabled && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(${COLORS.matrix.dim} 1px, transparent 1px),
              linear-gradient(90deg, ${COLORS.matrix.dim} 1px, transparent 1px)
            `,
            backgroundSize: BACKGROUND_EFFECTS.gridBackground.cellSize,
            opacity: BACKGROUND_EFFECTS.gridBackground.opacity,
          }}
        />
      )}
      
      {/* Vignette */}
      {BACKGROUND_EFFECTS.vignette.enabled && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, ${BACKGROUND_EFFECTS.vignette.color} 100%)`,
            filter: `blur(${BACKGROUND_EFFECTS.vignette.blur})`,
          }}
        />
      )}

      {/* Welcome Screen Component */}
      <WelcomeScreen
        typedText={typedText}
        isTyping={isTyping}
        visible={showWelcome}
      />

      {/* Terminal Header Component */}
      <TerminalHeader
        onlineUsers={onlineUsers}
        showWelcome={showWelcome}
      />

      {/* Main Terminal Area */}
      <div className={`relative z-10 container mx-auto px-4 py-6 transition-opacity duration-500 ${showWelcome ? 'opacity-0' : 'opacity-100'}`}>
        {/* Terminal Window Component with Input */}
        <TerminalWindow
          inputValue={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          isDisabled={isTyping}
          placeholder={isTyping ? "System initializing..." : "Enter command or search query..."}
        >
          <div className="space-y-2">
            {history.map((entry, index) => (
              <div 
                key={index}
                style={{
                  color: entry.type === 'user' ? COLORS.cyan.primary : COLORS.text.primary,
                  fontWeight: entry.type === 'user' ? 'bold' : 'normal',
                }}
                className={entry.type === 'result' ? '' : 'whitespace-pre-wrap'}
              >
                {entry.content}
              </div>
            ))}
          </div>
        </TerminalWindow>

        {/* Quick Action Buttons */}
        {!isTyping && history.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <QuickActionButton
              icon={List}
              label="List Categories"
              onClick={() => handleCommand('list categories')}
              variant="default"
            />
            <QuickActionButton
              icon={Search}
              label="Help"
              onClick={() => handleCommand('help')}
              variant="default"
            />
            <QuickActionButton
              label="Clear"
              onClick={() => handleCommand('clear')}
              variant="default"
            />
          </div>
        )}
      </div>
    </div>
  );
}
