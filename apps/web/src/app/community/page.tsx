"use client";

import React, { useMemo, useState } from 'react';
import { ForumProvider, useForum } from '../../lib/forum/context';
import { ForumSearchFilters, ChallengeTag } from '../../lib/forum/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Button } from '../../lib/ui/button';
import { Plus, Tag, MessageCircle, ThumbsUp, ArrowBigUp, ArrowLeft, Search, Flame, Swords } from 'lucide-react';
import { challengeCatalog } from '../../lib/challenges/catalog';

const TagChip: React.FC<{ tag: ChallengeTag, onRemove?: () => void }> = ({ tag, onRemove }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 mr-2 mb-2">
    <Tag className="h-3 w-3 mr-1"/>{tag.label}
    {onRemove && <button onClick={onRemove} className="ml-1 text-neutral-400">✕</button>}
  </span>
);

const ThreadCard: React.FC<{ id: string; title: string; body: string; tags: ChallengeTag[]; likes: number; upvotes: number; comments: number; onOpen: () => void; }>
= ({ id, title, body, tags, likes, upvotes, comments, onOpen }) => (
  <Card key={id} className="spectacular-hover-lift cursor-pointer" onClick={onOpen}>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-display text-purple-200 mb-1">{title}</h3>
          <p className="text-neutral-400 text-sm line-clamp-2">{body}</p>
          <div className="mt-2">{tags.map(t => <TagChip key={t.id} tag={t} />)}</div>
        </div>
        <div className="text-right text-sm text-neutral-400 min-w-[160px]">
          <div className="flex items-center justify-end gap-3">
            <span className="inline-flex items-center"><ArrowBigUp className="h-4 w-4 mr-1"/> {upvotes}</span>
            <span className="inline-flex items-center"><ThumbsUp className="h-4 w-4 mr-1"/> {likes}</span>
            <span className="inline-flex items-center"><MessageCircle className="h-4 w-4 mr-1"/> {comments}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TopicList: React.FC<{ onOpen: (id: string) => void, onNew: () => void }> = ({ onOpen, onNew }) => {
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
  }, [topics, filters, env]);

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Environments sidebar */}
      <div className="lg:col-span-1 space-y-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-300 font-display">Environments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
            {environments.map(e => (
              <button key={e} className={`w-full text-left px-3 py-2 rounded border ${env===e?'border-purple-500/50 bg-purple-500/10 text-purple-300':'border-neutral-700 hover:bg-neutral-800/50 text-neutral-300'}`} onClick={() => setEnv(e)}>
                {e}
              </button>
            ))}
          </CardContent>
        </Card>
        <Button className="btn-professional btn-primary w-full" onClick={onNew}><Plus className="h-4 w-4 mr-2"/> New Topic</Button>
      </div>

      {/* Threads */}
      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-300 font-display">Community Forum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                placeholder="Search topics (text or tag)"
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
                value={filters.q ?? ''}
                onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

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
      <Button variant="outline" className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2"/> Back
      </Button>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-2xl font-display text-purple-200 mb-2">{topic.title}</h2>
          <p className="text-neutral-300 whitespace-pre-wrap">{topic.content}</p>
          <div className="mt-3">
            {topic.tags.map(tag => <TagChip key={tag.id} tag={tag} />)}
          </div>
          <div className="mt-4 flex items-center gap-3 text-neutral-300">
            <Button size="sm" className="btn-professional btn-primary" onClick={() => toggleUpvoteTopic(topic.id)}><ArrowBigUp className="h-4 w-4 mr-1"/> Upvote</Button>
            <Button size="sm" variant="outline" className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50" onClick={() => toggleLikeTopic(topic.id)}><ThumbsUp className="h-4 w-4 mr-1"/> Like</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-purple-300 font-display">Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="border border-neutral-800 rounded p-3">
              <div className="text-sm text-neutral-400 mb-1">{c.author.name} • {new Date(c.createdAt).toLocaleString()}</div>
              <div className="text-neutral-200 whitespace-pre-wrap">{c.content}</div>
              <div className="mt-2">
                {c.tags.map(tag => <TagChip key={tag.id} tag={tag} />)}
              </div>
              <div className="mt-2 flex items-center gap-2 text-neutral-300">
                <Button size="sm" variant="outline" className="border-neutral-600/50" onClick={() => toggleUpvoteComment(c.id)}><ArrowBigUp className="h-4 w-4 mr-1"/> {c.votes.upvoters.length}</Button>
                <Button size="sm" variant="outline" className="border-neutral-600/50" onClick={() => toggleLikeComment(c.id)}><ThumbsUp className="h-4 w-4 mr-1"/> {c.votes.likers.length}</Button>
              </div>
            </div>
          ))}

          {/* New Comment */}
          <div className="border border-neutral-800 rounded p-3">
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-neutral-100"
              rows={4}
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                placeholder="Tag a Vulhub path (e.g., langflow/CVE-2025-3248)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
              />
              <Button variant="outline" className="border-neutral-600/50" onClick={addTag}>Add Tag</Button>
              <Button className="btn-professional btn-primary" onClick={submitComment}>Post Comment</Button>
            </div>
            <div className="mt-2">
              {tags.map((t, i) => <TagChip key={i} tag={t} onRemove={() => setTags(prev => prev.filter(x => x !== t))} />)}
            </div>
          </div>
        </CardContent>
      </Card>
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
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-3xl p-6 text-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display text-purple-300">Create Topic</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">✕</button>
        </div>
        <div className="space-y-3">
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
          />
          <textarea
            placeholder="Share your thoughts, steps, or questions..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-neutral-100"
            rows={6}
          />
          <div className="flex items-center gap-2">
            <input
              placeholder="Tag a Vulhub path (e.g., langflow/CVE-2025-3248)"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
            />
            <Button variant="outline" className="border-neutral-600/50" onClick={addTag}>Add Tag</Button>
          </div>
          <div>
            {tags.map((t, i) => <TagChip key={i} tag={t} onRemove={() => setTags(prev => prev.filter(x => x !== t))} />)}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" className="border-neutral-600/50" onClick={onClose}>Cancel</Button>
            <Button className="btn-professional btn-primary" onClick={() => { onCreate(title.trim(), content.trim(), tags); onClose(); }}>Create Topic</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Local shell that uses TopicList/TopicView/NewTopicModal from the earlier version in this file
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
        // Reuse the old TopicView from earlier message; import if split
        // For brevity, assume TopicView exists in same file scope from earlier implementation
        // @ts-ignore
        <TopicView id={activeTopicId} onBack={() => setActiveTopicId(null)} />
      ) : (
        <TopicList onOpen={setActiveTopicId} onNew={() => setShowNew(true)} />
      )}
      {/* @ts-ignore */}
      {showNew && <NewTopicModal onClose={() => setShowNew(false)} onCreate={onCreate} />}
    </>
  );
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black">
      <ForumProvider>
        {/* Using the previous CommunityShell implementation to preserve behavior */}
        {/* We render TopicList with environment filters above */}
        {/* Inline re-implementation of CommunityShell */}
        <div className="container mx-auto px-4 py-10 text-neutral-100">
          {/* Local shell state */}
          <CommunityShell />
        </div>
      </ForumProvider>
    </div>
  );
}
