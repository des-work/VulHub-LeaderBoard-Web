// Forum domain types

export interface ChallengeTag {
  id: string;              // e.g., 'langflow/CVE-2025-3248'
  label: string;           // display text
  url?: string;            // optional link to readme
}

export interface ForumUserRef {
  id: string;
  name: string;
}

export interface VoteState {
  upvoters: string[]; // userIds
  likers: string[];   // userIds
}

export interface Comment {
  id: string;
  topicId: string;
  author: ForumUserRef;
  content: string;
  createdAt: string; // ISO
  tags: ChallengeTag[];
  votes: VoteState;
}

export interface Topic {
  id: string;
  author: ForumUserRef;
  title: string;
  content: string;
  createdAt: string; // ISO
  tags: ChallengeTag[];
  votes: VoteState;
  commentCount: number;
  lastActivityAt: string; // ISO
}

export interface ForumSearchFilters {
  q?: string;
  tagIds?: string[]; // match any
  sortBy?: 'new' | 'active' | 'top';
}
