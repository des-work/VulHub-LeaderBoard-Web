'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Terminal, Send, ThumbsUp, MessageSquare, User, Clock } from 'lucide-react';
import { VULHUB_VULNERABILITIES, type VulnerabilityInfo } from '../../../../lib/vulhub/categories';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export default function ThreadPage() {
  const router = useRouter();
  const params = useParams();
  const [vuln, setVuln] = useState<VulnerabilityInfo | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [typedContent, setTypedContent] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find vulnerability
    const found = VULHUB_VULNERABILITIES.find(v => v.id === params.id);
    setVuln(found || null);

    // Generate mock comments
    if (found) {
      setComments([
        {
          id: '1',
          author: 'NeoYOU',
          content: `Successfully exploited this! The key is to intercept the request and modify the middleware chain. Check out the PoC I posted in the resources section.`,
          timestamp: new Date(Date.now() - 3600000),
          likes: 12
        },
        {
          id: '2',
          author: 'Trinity',
          content: `Anyone know if this works on the latest version? Trying to replicate in my lab environment.`,
          timestamp: new Date(Date.now() - 1800000),
          likes: 5
        },
        {
          id: '3',
          author: 'Morpheus',
          content: `Great discussion! I've documented the full attack chain here: https://github.com/...`,
          timestamp: new Date(Date.now() - 900000),
          likes: 8
        }
      ]);
    }
  }, [params.id]);

  // Typing animation for thread header
  useEffect(() => {
    if (vuln && isTyping) {
      const fullText = `Thread: ${vuln.name}\n${vuln.cve || 'No CVE'} | Category: ${vuln.category}\n\n${vuln.description}\n\nTags: ${vuln.tags.map(t => `#${t}`).join(' ')}\n\n───────────────────────────────────────\nDiscussion Thread - ${comments.length} comments\n`;
      
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < fullText.length) {
          setTypedContent(prev => prev + fullText[index]);
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 15);

      return () => clearInterval(typeInterval);
    }
  }, [vuln, comments.length]);

  // Auto-scroll
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [typedContent, comments]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'Des',
        content: comment,
        timestamp: new Date(),
        likes: 0
      };
      setComments(prev => [...prev, newComment]);
      setComment('');
    }
  };

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  if (!vuln) {
    return (
      <div className="min-h-screen bg-black text-matrix font-mono flex items-center justify-center">
        <div className="text-center">
          <Terminal className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <div>Thread not found</div>
          <button onClick={() => router.push('/community')} className="matrix-button matrix-button-outline mt-4">
            Return to Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-matrix font-mono relative overflow-hidden">
      {/* Effects */}
      <div className="fixed inset-0 pointer-events-none scan-lines opacity-10" />
      <div className="fixed inset-0 matrix-grid opacity-5 pointer-events-none" />
      <div className="fixed inset-0 vignette pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 border-b border-matrix/30 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/community')}
                className="matrix-button matrix-button-outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Terminal
              </button>
              
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-matrix animate-pulse" />
                <span className="text-lg font-bold text-matrix-glow">Discussion Thread</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-matrix">
              <Clock className="h-4 w-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thread Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="matrix-card border-2 border-matrix/50 shadow-cyber-lg">
          {/* Terminal Header */}
          <div className="bg-neutral-900/90 border-b border-matrix/30 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-matrix" />
              <span className="ml-4 text-sm text-muted">thread/{vuln.id}</span>
            </div>
            <div className="text-xs text-dim">{comments.length} comments</div>
          </div>

          {/* Thread Info */}
          <div 
            ref={threadRef}
            className="bg-black p-6 h-[calc(100vh-400px)] overflow-y-auto scroll-smooth"
          >
            {/* Typed Header */}
            <div className="text-matrix whitespace-pre-wrap mb-6 font-mono text-sm">
              {typedContent}
              {isTyping && <span className="inline-block w-2 h-4 bg-matrix animate-pulse ml-1" />}
            </div>

            {/* Comments */}
            {!isTyping && comments.map((commentItem, index) => (
              <div 
                key={commentItem.id} 
                className="mb-4 border-l-2 border-matrix/30 pl-4 hover:border-matrix transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-matrix" />
                    <span className="text-cyan-400 font-semibold">{commentItem.author}</span>
                    <span className="text-dim text-xs">
                      {Math.floor((Date.now() - commentItem.timestamp.getTime()) / 60000)} min ago
                    </span>
                  </div>
                  <button
                    onClick={() => handleLike(commentItem.id)}
                    className="flex items-center gap-1 text-muted hover:text-matrix transition-colors group"
                  >
                    <ThumbsUp className="h-3 w-3 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">{commentItem.likes}</span>
                  </button>
                </div>
                <div className="text-bright text-sm leading-relaxed">
                  {commentItem.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-neutral-900/90 border-t border-matrix/30 px-4 py-3">
            <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
              <span className="text-matrix font-bold">$</span>
              <User className="h-4 w-4 text-cyan-400" />
              <input
                ref={commentInputRef}
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-transparent text-matrix outline-none font-mono placeholder-matrix/30 disabled:opacity-50"
                placeholder={isTyping ? "Loading thread..." : "Type your comment..."}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="submit"
                disabled={!comment.trim() || isTyping}
                className="matrix-button matrix-button-primary text-sm disabled:opacity-50"
              >
                <Send className="h-3 w-3 mr-2" />
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        {!isTyping && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => window.open(`https://vulhub.org/environments`, '_blank')}
              className="matrix-button matrix-button-outline text-sm"
            >
              View on VulHub.org
            </button>
            <button
              onClick={() => router.push('/challenges')}
              className="matrix-button matrix-button-outline text-sm"
            >
              Practice Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

