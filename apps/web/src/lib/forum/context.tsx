"use client";

import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Topic, Comment, ForumSearchFilters, ChallengeTag, ForumUserRef } from './types';
import { useAuth } from '../auth/context';

interface ForumState {
  topics: Topic[];
  comments: Comment[];
}

type ForumAction =
  | { type: 'SET_ALL'; payload: ForumState }
  | { type: 'UPSERT_TOPIC'; payload: Topic }
  | { type: 'UPSERT_COMMENT'; payload: Comment };

const STORAGE_KEY = 'vulhub.forum.v1';

function load(): ForumState {
  if (typeof window === 'undefined') return { topics: [], comments: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ForumState) : { topics: [], comments: [] };
  } catch {
    return { topics: [], comments: [] };
  }
}

function save(state: ForumState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function reducer(state: ForumState, action: ForumAction): ForumState {
  switch (action.type) {
    case 'SET_ALL':
      return action.payload;
    case 'UPSERT_TOPIC': {
      const idx = state.topics.findIndex(t => t.id === action.payload.id);
      const topics = [...state.topics];
      if (idx >= 0) topics[idx] = action.payload; else topics.unshift(action.payload);
      const next = { ...state, topics };
      save(next);
      return next;
    }
    case 'UPSERT_COMMENT': {
      const idx = state.comments.findIndex(c => c.id === action.payload.id);
      const comments = [...state.comments];
      if (idx >= 0) comments[idx] = action.payload; else comments.push(action.payload);
      // bump topic meta
      const tIdx = state.topics.findIndex(t => t.id === action.payload.topicId);
      const topics = [...state.topics];
      if (tIdx >= 0) {
        const t = topics[tIdx];
        topics[tIdx] = { ...t, commentCount: (t.commentCount || 0) + (idx >= 0 ? 0 : 1), lastActivityAt: action.payload.createdAt };
      }
      const next = { topics, comments };
      save(next);
      return next;
    }
    default:
      return state;
  }
}

interface ForumContextValue {
  topics: Topic[];
  commentsByTopic: (topicId: string) => Comment[];
  createTopic: (title: string, content: string, tags: ChallengeTag[]) => Topic;
  addComment: (topicId: string, content: string, tags: ChallengeTag[]) => Comment;
  toggleUpvoteTopic: (topicId: string) => void;
  toggleLikeTopic: (topicId: string) => void;
  toggleUpvoteComment: (commentId: string) => void;
  toggleLikeComment: (commentId: string) => void;
  search: (filters: ForumSearchFilters) => Topic[];
}

const ForumContext = createContext<ForumContextValue | null>(null);

export const ForumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => load());
  const { user } = useAuth();

  const ensureUser = (): ForumUserRef => ({ id: user?.id || 'anon', name: user?.name || 'Anonymous' });

  const commentsByTopic = (topicId: string) => state.comments.filter(c => c.topicId === topicId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const createTopic = (title: string, content: string, tags: ChallengeTag[]): Topic => {
    const now = new Date().toISOString();
    const t: Topic = {
      id: crypto.randomUUID(),
      author: ensureUser(),
      title,
      content,
      createdAt: now,
      lastActivityAt: now,
      tags,
      votes: { upvoters: [], likers: [] },
      commentCount: 0,
    };
    dispatch({ type: 'UPSERT_TOPIC', payload: t });
    return t;
  };

  const addComment = (topicId: string, content: string, tags: ChallengeTag[]): Comment => {
    const now = new Date().toISOString();
    const c: Comment = {
      id: crypto.randomUUID(),
      topicId,
      author: ensureUser(),
      content,
      createdAt: now,
      tags,
      votes: { upvoters: [], likers: [] },
    };
    dispatch({ type: 'UPSERT_COMMENT', payload: c });
    return c;
  };

  function toggle(list: string[], id: string) {
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
  }

  const toggleUpvoteTopic = (topicId: string) => {
    const u = ensureUser().id;
    const t = state.topics.find(x => x.id === topicId);
    if (!t) return;
    const next: Topic = { ...t, votes: { ...t.votes, upvoters: [...t.votes.upvoters] } };
    toggle(next.votes.upvoters, u);
    dispatch({ type: 'UPSERT_TOPIC', payload: next });
  };

  const toggleLikeTopic = (topicId: string) => {
    const u = ensureUser().id;
    const t = state.topics.find(x => x.id === topicId);
    if (!t) return;
    const next: Topic = { ...t, votes: { ...t.votes, likers: [...t.votes.likers] } };
    toggle(next.votes.likers, u);
    dispatch({ type: 'UPSERT_TOPIC', payload: next });
  };

  const toggleUpvoteComment = (commentId: string) => {
    const u = ensureUser().id;
    const c = state.comments.find(x => x.id === commentId);
    if (!c) return;
    const next: Comment = { ...c, votes: { ...c.votes, upvoters: [...c.votes.upvoters] } };
    toggle(next.votes.upvoters, u);
    dispatch({ type: 'UPSERT_COMMENT', payload: next });
  };

  const toggleLikeComment = (commentId: string) => {
    const u = ensureUser().id;
    const c = state.comments.find(x => x.id === commentId);
    if (!c) return;
    const next: Comment = { ...c, votes: { ...c.votes, likers: [...c.votes.likers] } };
    toggle(next.votes.likers, u);
    dispatch({ type: 'UPSERT_COMMENT', payload: next });
  };

  const search = (filters: ForumSearchFilters): Topic[] => {
    const { q, tagIds, sortBy = 'active' } = filters;
    let list = [...state.topics];
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(t => `${t.title} ${t.content} ${t.tags.map(x => x.label).join(' ')}`.toLowerCase().includes(qq));
    }
    if (tagIds && tagIds.length) {
      list = list.filter(t => t.tags.some(tag => tagIds.includes(tag.id)));
    }
    list.sort((a, b) => {
      if (sortBy === 'new') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'top') return (b.votes.upvoters.length + b.votes.likers.length) - (a.votes.upvoters.length + a.votes.likers.length);
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });
    return list;
  };

  const value: ForumContextValue = useMemo(() => ({
    topics: search({}),
    commentsByTopic,
    createTopic,
    addComment,
    toggleUpvoteTopic,
    toggleLikeTopic,
    toggleUpvoteComment,
    toggleLikeComment,
    search,
  }), [state, user?.id]);

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
};

export const useForum = () => {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error('useForum must be used within ForumProvider');
  return ctx;
};
