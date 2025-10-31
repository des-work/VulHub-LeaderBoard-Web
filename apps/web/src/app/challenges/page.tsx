"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { challengeCatalog } from '../../lib/challenges/catalog';
import { Flame, Sword, Shield, Filter, Tag, Rocket, ArrowLeft } from 'lucide-react';

export default function ChallengesPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    challengeCatalog.challenges.forEach(c => set.add(c.category));
    return ['all', ...Array.from(set)];
  }, []);

  const list = useMemo(() => {
    return challengeCatalog.challenges.filter(c => {
      if (category !== 'all' && c.category !== category) return false;
      if (q && !(`${c.title} ${c.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, category]);

  const RouteChip = ({ id }: { id: string }) => {
    const map: Record<string, { label: string; icon: React.ReactNode }> = {
      standard: { label: 'Standard', icon: <Rocket className="h-3 w-3 mr-1"/> },
      redTeam: { label: 'Red', icon: <Sword className="h-3 w-3 mr-1"/> },
      blueTeam: { label: 'Blue', icon: <Shield className="h-3 w-3 mr-1"/> },
    };
    const item = map[id] || { label: id, icon: null };
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 mr-2">{item.icon}{item.label}</span>;
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => router.push('/')}
          className="matrix-button matrix-button-outline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display text-matrix-glow">Challenges</h1>
          <p className="text-muted mt-2">Mapped to official Vulhub environments. Pick a route and start hacking.</p>
        </div>

        <div className="matrix-card mb-6">
          <div className="matrix-card-header">
            <h2 className="text-xl font-display font-bold text-matrix">Filters</h2>
          </div>
          <div className="matrix-card-content flex flex-col md:flex-row gap-3">
            <input 
              className="flex-1 bg-neutral-900/50 border border-matrix/30 rounded px-3 py-2 text-bright focus:border-matrix focus:ring-1 focus:ring-matrix" 
              placeholder="Search title or tags" 
              value={q} 
              onChange={e => setQ(e.target.value)} 
            />
            <select 
              className="bg-neutral-900/50 border border-matrix/30 rounded px-3 py-2 text-bright focus:border-matrix focus:ring-1 focus:ring-matrix" 
              value={category} 
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(ch => (
            <div key={ch.id} className="matrix-card hover-lift">
              <div className="matrix-card-header">
                <div className="flex items-center justify-between">
                  <span className="text-matrix font-display font-bold">{ch.title}</span>
                  <span className="text-sm text-yellow-400 inline-flex items-center"><Flame className="h-4 w-4 mr-1"/>{ch.defaultPoints} pts</span>
                </div>
              </div>
              <div className="matrix-card-content space-y-3">
                <div className="text-muted text-sm">{ch.category} {ch.cve ? `• ${ch.cve}` : ''}</div>
                <div>
                  {ch.routeIds.map(id => <RouteChip key={id} id={id} />)}
                </div>
                <div>
                  {ch.tags.map(t => <span key={t} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-neutral-800 text-bright border border-matrix/30 mr-2"><Tag className="h-3 w-3 mr-1"/>{t}</span>)}
                </div>
                <a className="text-sm text-matrix hover:text-matrix-bright underline" href={ch.vulhub.url} target="_blank" rel="noreferrer">Vulhub docs</a>
                <div className="pt-2">
                  <button className="matrix-button matrix-button-primary w-full">Start • {ch.difficulty}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
