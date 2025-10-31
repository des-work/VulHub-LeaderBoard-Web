'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Terminal, Search, List, MessageSquare, Users } from 'lucide-react';
import { 
  VULHUB_CATEGORIES, 
  VULHUB_VULNERABILITIES,
  searchCategories,
  searchVulnerabilities,
  getCategoryById,
  getVulnerabilitiesByCategory,
  type CategoryInfo,
  type VulnerabilityInfo
} from '../../lib/vulhub/categories';

export default function CommunityPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{type: 'system' | 'user' | 'result', content: string | React.ReactNode}>>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentView, setCurrentView] = useState<'welcome' | 'search' | 'category' | 'thread'>('welcome');
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityInfo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = `Welcome to VulHub Community Terminal

> Initializing knowledge base...
> Loading ${VULHUB_VULNERABILITIES.length} vulnerabilities...
> ${VULHUB_CATEGORIES.length} categories indexed
> System ready.

What knowledge do you seek?`;

  // Typing animation effect
  useEffect(() => {
    if (currentView === 'welcome' && isTyping) {
      const lines = welcomeMessage.split('\n');
      let lineIndex = 0;
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (lineIndex < lines.length) {
          if (charIndex < lines[lineIndex].length) {
            const currentHistory = history.slice();
            const lastEntry = currentHistory[currentHistory.length - 1];
            
            if (!lastEntry || lastEntry.type !== 'system') {
              currentHistory.push({ type: 'system', content: lines[lineIndex][charIndex] });
            } else {
              lastEntry.content = (lastEntry.content as string) + lines[lineIndex][charIndex];
            }
            
            setHistory(currentHistory);
            charIndex++;
          } else {
            // Move to next line
            const currentHistory = history.slice();
            const lastEntry = currentHistory[currentHistory.length - 1];
            if (lastEntry) {
              lastEntry.content = (lastEntry.content as string) + '\n';
            }
            setHistory(currentHistory);
            lineIndex++;
            charIndex = 0;
          }
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    }
  }, [currentView]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on load
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add user input to history
    setHistory(prev => [...prev, { type: 'user', content: `$ ${cmd}` }]);
    
    if (!trimmedCmd) return;

    // Special commands
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
      setIsTyping(false);
      return;
    }

    if (trimmedCmd === 'back') {
      setHistory([]);
      setCurrentView('welcome');
      setIsTyping(false);
      setSelectedCategory(null);
      setSelectedVuln(null);
      return;
    }

    if (trimmedCmd === 'list categories' || trimmedCmd === 'categories') {
      setHistory(prev => [...prev, {
        type: 'result',
        content: (
          <div className="space-y-2 my-4">
            <div className="text-matrix-glow font-bold">╔═══ Available Categories ═══╗</div>
            {VULHUB_CATEGORIES.map(cat => (
              <div key={cat.id} className="text-bright hover:text-matrix cursor-pointer pl-2 hover:pl-4 transition-all"
                onClick={() => {
                  setInput(cat.name);
                  handleCommand(cat.name);
                }}
              >
                {cat.icon} [{cat.count}] {cat.name} - {cat.description}
              </div>
            ))}
            <div className="text-matrix-glow font-bold">╚════════════════════════════╝</div>
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
            <div className="text-matrix-glow font-bold text-xl">
              ╔═══ {categoryMatch.icon} {categoryMatch.name} ═══╗
            </div>
            <div className="text-muted pl-2">{categoryMatch.description}</div>
            <div className="text-cyan-400 pl-2">Found {vulns.length} vulnerabilities:</div>
            <div className="space-y-2 pl-2">
              {vulns.map(vuln => (
                <div key={vuln.id} className="border-l-2 border-matrix/30 pl-3 hover:border-matrix hover:pl-4 transition-all cursor-pointer"
                  onClick={() => handleVulnSelect(vuln)}
                >
                  <div className="text-bright font-semibold">{vuln.name}</div>
                  {vuln.cve && <div className="text-yellow-400 text-sm">{vuln.cve}</div>}
                  <div className="text-muted text-sm">{vuln.description}</div>
                  <div className="text-xs text-dim mt-1">
                    {vuln.tags.map(tag => `#${tag}`).join(' ')}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-matrix-glow font-bold">╚════════════════════════════╝</div>
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
            <div className="text-matrix-glow font-bold">╔═══ Search Results ═══╗</div>
            
            {catResults.length > 0 && (
              <div>
                <div className="text-cyan-400 font-semibold pl-2">Categories ({catResults.length}):</div>
                {catResults.map(cat => (
                  <div key={cat.id} className="text-bright hover:text-matrix cursor-pointer pl-4 hover:pl-6 transition-all"
                    onClick={() => handleCommand(cat.name)}
                  >
                    {cat.icon} {cat.name} ({cat.count} vulns)
                  </div>
                ))}
              </div>
            )}
            
            {vulnResults.length > 0 && (
              <div>
                <div className="text-cyan-400 font-semibold pl-2">Vulnerabilities ({vulnResults.length}):</div>
                {vulnResults.map(vuln => (
                  <div key={vuln.id} className="border-l-2 border-matrix/30 pl-3 hover:border-matrix hover:pl-4 transition-all cursor-pointer my-2"
                    onClick={() => handleVulnSelect(vuln)}
                  >
                    <div className="text-bright font-semibold">{vuln.name}</div>
                    {vuln.cve && <div className="text-yellow-400 text-sm">{vuln.cve}</div>}
                    <div className="text-muted text-sm">{vuln.description}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-matrix-glow font-bold">╚══════════════════════════╝</div>
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
    <div className="min-h-screen bg-black text-matrix font-mono relative overflow-hidden">
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none scan-lines opacity-10" />
      
      {/* Matrix grid background */}
      <div className="fixed inset-0 matrix-grid opacity-5 pointer-events-none" />
      
      {/* Vignette */}
      <div className="fixed inset-0 vignette pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 border-b border-matrix/30 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')}
                className="matrix-button matrix-button-outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Terminal
              </button>
              
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-matrix animate-pulse" />
                <span className="text-lg font-bold text-matrix-glow">VulHub Community Terminal</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-matrix">
              <Users className="h-4 w-4" />
              <span>Online: {Math.floor(Math.random() * 50) + 10}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="matrix-card border-2 border-matrix/50 shadow-cyber-lg">
          {/* Terminal Header */}
          <div className="bg-neutral-900/90 border-b border-matrix/30 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-matrix" />
              <span className="ml-4 text-sm text-muted">user@vulhub:~$</span>
            </div>
            <div className="text-xs text-dim">Press 'help' for commands</div>
          </div>

          {/* Terminal Content */}
          <div 
            ref={historyRef}
            className="bg-black p-6 h-[calc(100vh-280px)] overflow-y-auto scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Command History */}
            <div className="space-y-2">
              {history.map((entry, index) => (
                <div key={index} className={`
                  ${entry.type === 'system' ? 'text-matrix whitespace-pre-wrap' : ''}
                  ${entry.type === 'user' ? 'text-cyan-400 font-bold' : ''}
                  ${entry.type === 'result' ? '' : ''}
                `}>
                  {entry.content}
                </div>
              ))}
              
              {/* Blinking cursor during typing */}
              {isTyping && <span className="inline-block w-2 h-4 bg-matrix animate-pulse ml-1" />}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-neutral-900/90 border-t border-matrix/30 px-4 py-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-matrix font-bold">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-transparent text-matrix outline-none font-mono placeholder-matrix/30 disabled:opacity-50"
                placeholder={isTyping ? "System initializing..." : "Enter command or search query..."}
                autoComplete="off"
                spellCheck="false"
              />
              {!isTyping && <span className="w-2 h-4 bg-matrix animate-pulse" />}
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        {!isTyping && history.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleCommand('list categories')}
              className="matrix-button matrix-button-outline text-sm"
            >
              <List className="h-3 w-3 mr-2" />
              List Categories
            </button>
            <button
              onClick={() => handleCommand('help')}
              className="matrix-button matrix-button-outline text-sm"
            >
              <Terminal className="h-3 w-3 mr-2" />
              Help
            </button>
            <button
              onClick={() => handleCommand('clear')}
              className="matrix-button matrix-button-outline text-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
