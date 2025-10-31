"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ForumProvider, useForum } from '../../lib/forum/context';
import { ForumSearchFilters, ChallengeTag } from '../../lib/forum/types';
import { Plus, Tag, MessageCircle, ThumbsUp, ArrowBigUp, ArrowLeft, Search, Flame, Swords } from 'lucide-react';
import { challengeCatalog } from '../../lib/challenges/catalog';

const TagChip: React.FC<{ tag: ChallengeTag, onRemove?: () => void }> = ({ tag, onRemove }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 mr-2 mb-2">
    <Tag className="h-3 w-3 mr-1"/>{tag.label}
    {onRemove && <button onClick={onRemove} className="ml-1 text-muted">✕</button>}
  </span>
);

const ThreadCard: React.FC<{ id: string; title: string; body: string; tags: ChallengeTag[]; likes: number; upvotes: number; comments: number; onOpen: () => void; }>
= ({ id, title, body, tags, likes, upvotes, comments, onOpen }) => (
  <div key={id} className="matrix-card hover-lift cursor-pointer" onClick={onOpen}>
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-display text-matrix mb-1">{title}</h3>
          <p className="text-muted text-sm line-clamp-2">{body}</p>
          <div className="mt-2">{tags.map(t => <TagChip key={t.id} tag={t} />)}</div>
        </div>
        <div className="text-right text-sm text-muted min-w-[160px]">
          <div className="flex items-center justify-end gap-3">
            <span className="inline-flex items-center"><ArrowBigUp className="h-4 w-4 mr-1"/> {upvotes}</span>
            <span className="inline-flex items-center"><ThumbsUp className="h-4 w-4 mr-1"/> {likes}</span>
            <span className="inline-flex items-center"><MessageCircle className="h-4 w-4 mr-1"/> {comments}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TopicList: React.FC<{ onOpen: (id: string) => void, onNew: () => void }> = ({ onOpen, onNew }) => {
  const router = useRouter();
  const { topics, search } = useForum();
  const [filters, setFilters] = useState<ForumSearchFilters>({});
  const [env, setEnv] = useState<string>('all');

  const environments = useMemo(() => {
    const tags = new Set<string>();
    challengeCatalog.challenges.forEach(c => tags.add(c.vulhub.path));
    return ['all', ...Array.from(tags).sort()];
  }, []);

  const list = useMemo(() => {
    const tagIds = env === 'all' ? undefined : [env];
    return search({ ...filters, tagIds });
  }, [topics, filters, env, search]);

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Environments sidebar */}
      <div className="lg:col-span-1 space-y-3">
        <button 
          onClick={() => router.push('/')}
          className="matrix-button matrix-button-outline w-full mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>

        <div className="matrix-card">
          <div className="matrix-card-header">
            <h2 className="text-xl font-display font-bold text-matrix">Environments</h2>
          </div>
          <div className="matrix-card-content space-y-2 max-h-[60vh] overflow-y-auto">
            {environments.map(e => (
              <button 
                key={e} 
                className={`w-full text-left px-3 py-2 rounded border transition-colors ${env===e?'border-matrix bg-matrix/10 text-matrix':'border-neutral-700 hover:bg-neutral-800/50 text-bright'}`} 
                onClick={() => setEnv(e)}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <button className="matrix-button matrix-button-primary w-full" onClick={onNew}>
          <Plus className="h-4 w-4 mr-2"/> New Topic
        </button>
      </div>

      {/* Threads */}
      <div className="lg:col-span-3 space-y-4">
        <div className="matrix-card">
          <div className="matrix-card-header">
            <h2 className="text-xl font-display font-bold text-matrix">Community Forum</h2>
          </div>
          <div className="matrix-card-content">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                placeholder="Search topics (text or tag)"
                className="flex-1 bg-neutral-900/50 border border-matrix/30 rounded px-3 py-2 text-bright focus:border-matrix focus:ring-1 focus:ring-matrix"
                value={filters.q ?? ''}
                onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {list.map(t => (
          <ThreadCard
            key={t.id}
            id={t.id}
            title={t.title}
            body={t.content}
            tags={t.tags}
            likes={t.votes.likers.length}
            upvotes={t.votes.upvoters.length}
            comments={t.commentCount}
            onOpen={() => onOpen(t.id)}
          />
        ))}
      </div>
    </div>
  );
};

const TopicView: React.FC<{ id: string, onBack: () => void }> = ({ id, onBack }) => {
  const { topics, commentsByTopic, addComment, toggleLikeTopic, toggleUpvoteTopic, toggleLikeComment, toggleUpvoteComment } = useForum();
  const topic = topics.find(t => t.id === id);
  const comments = commentsByTopic(id);
  const [commentText, setCommentText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<ChallengeTag[]>([]);

  if (!topic) return null;

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    const tag: ChallengeTag = { id: v, label: v, url: `https://github.com/vulhub/vulhub/tree/master/${v}` };
    setTags(prev => [...prev, tag]);
    setTagInput('');
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    addComment(topic.id, commentText.trim(), tags);
    setCommentText('');
    setTags([]);
  };

  return (
    <div className="space-y-4">
      <button className="matrix-button matrix-button-outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2"/> Back
      </button>

      <div className="matrix-card">
        <div className="p-5">
          <h2 className="text-2xl font-display text-matrix-glow mb-2">{topic.title}</h2>
          <p className="text-bright whitespace-pre-wrap">{topic.content}</p>
          <div className="mt-3">
            {topic.tags.map(tag => <TagChip key={tag.id} tag={tag} />)}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button className="matrix-button matrix-button-primary" onClick={() => toggleUpvoteTopic(topic.id)}>
              <ArrowBigUp className="h-4 w-4 mr-1"/> Upvote
            </button>
            <button className="matrix-button matrix-button-outline" onClick={() => toggleLikeTopic(topic.id)}>
              <ThumbsUp className="h-4 w-4 mr-1"/> Like
            </button>
          </div>
        </div>
      </div>

      <div className="matrix-card">
        <div className="matrix-card-header">
          <h2 className="text-xl font-display font-bold text-matrix">Comments ({comments.length})</h2>
        </div>
        <div className="matrix-card-content space-y-4">
          {comments.map(c => (
            <div key={c.id} className="border border-neutral-800 rounded p-3 row-surface">
              <div className="text-sm text-muted mb-1">{c.author.name} • {new Date(c.createdAt).toLocaleString()}</div>
              <div className="text-bright whitespace-pre-wrap">{c.content}</div>
              <div className="mt-2">
                {c.tags.map(tag => <TagChip key={tag.id} tag={tag} />)}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button className="matrix-button matrix-button-outline text-sm" onClick={() => toggleUpvoteComment(c.id)}>
                  <ArrowBigUp className="h-4 w-4 mr-1"/> {c.votes.upvoters.length}
                </button>
                <button className="matrix-button matrix-button-outline text-sm" onClick={() => toggleLikeComment(c.id)}>
                  <ThumbsUp className="h-4 w-4 mr-1"/> {c.votes.likers.length}
                </button>
              </div>
            </div>
          ))}

          {/* New Comment */}
          <div className="border border-neutral-800 rounded p-3 row-surface">
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="w-full bg-neutral-900/50 border border-matrix/30 rounded p-2 text-bright focus:border-matrix focus:ring-1 focus:ring-matrix"
              rows={4}
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                placeholder="Tag a Vulhub path (e.g., langflow/CVE-2025-3248)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className="flex-1 bg-neutral-900/50 border border-matrix/30 rounded px-3 py-2 text-bright focus:border-matrix focus:ring-1 focus:ring-matrix"
              />
              <button className="matrix-button matrix-button-outline" onClick={addTag}>Add Tag</button>
              <button className="matrix-button matrix-button-primary" onClick={submitComment}>Post Comment</button>
            </div>
            <div className="mt-2">
              {tags.map((t, i) => <TagChip key={i} tag={t} onRemove={() => setTags(prev => prev.filter(x => x !== t))} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewTopicModal: React.FC<{ onClose: () => void, onCreate: (title: string, content: string, tags: ChallengeTag[]) => void }> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<ChallengeTag[]>([]);

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    const tag: ChallengeTag = { id: v, label: v, url: `https://github.com/vulhub/vulhub/tree/master/${v}` };
    setTags(prev => [...prev, tag]);
    setTagInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="matrix-card w-full max-w-3xl mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display text-matrix-glow">Create Topic</h3>
            <button onClick={onClose} className="text-muted hover:text-bright">✕</button>
          </div>
          <div className="space-y-3">
            <input
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-neutral-900/50 border border-matrix/30 rounded px-3 py-2 text-bright focus:border-matrix focus:ring-1 focus:ring-matrix"
            />
            <textarea
              placeholder="Share your thoughts, steps, or questions..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-neutral-900/50 border border-matrix/30 rounded p-2 text-bright focus:border-matrix focus:ring-1 focus:ring-matrix"
              rows={6}
            />
            <div className="flex items-center gap-2">
              <input
                placeholder="Tag a Vulhub path (e.g., langflow/CVE-2025-3248)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className="flex-1 bg-neutral-900/50 border border-matrix/30 rounded px-3 py-2 text-bright focus:border-matrix focus:ring-1 focus:ring-matrix"
              />
              <button className="matrix-button matrix-button-outline" onClick={addTag}>Add Tag</button>
            </div>
            <div>
              {tags.map((t, i) => <TagChip key={i} tag={t} onRemove={() => setTags(prev => prev.filter(x => x !== t))} />)}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button className="matrix-button matrix-button-outline" onClick={onClose}>Cancel</button>
              <button className="matrix-button matrix-button-primary" onClick={() => { onCreate(title.trim(), content.trim(), tags); onClose(); }}>Create Topic</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunityShell: React.FC = () => {
  const { createTopic } = useForum();
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const onCreate = (title: string, content: string, tags: ChallengeTag[]) => {
    if (!title || !content) return;
    const t = createTopic(title, content, tags);
    setActiveTopicId(t.id);
  };

  return (
    <>
      {activeTopicId ? (
        <TopicView id={activeTopicId} onBack={() => setActiveTopicId(null)} />
      ) : (
        <TopicList onOpen={setActiveTopicId} onNew={() => setShowNew(true)} />
      )}
      {showNew && <NewTopicModal onClose={() => setShowNew(false)} onCreate={onCreate} />}
    </>
  );
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black">
      <ForumProvider>
        <div className="container mx-auto px-4 py-10 text-neutral-100">
          <CommunityShell />
        </div>
      </ForumProvider>
    </div>
  );
}
