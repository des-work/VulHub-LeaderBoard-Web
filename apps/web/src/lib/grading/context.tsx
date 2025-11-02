"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { GradeEvent, GradeInput, Submission, SubmissionFilters } from './types';
import { GradingApi } from '../api/endpoints';
import { useAuth } from '../auth/context';

interface GradingState {
  submissions: Submission[];
  isLoading: boolean;
  error?: string;
}

type GradingAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Submission[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'UPSERT_SUBMISSION'; payload: Submission }
  | { type: 'BULK_SET'; payload: Submission[] };

const initialState: GradingState = {
  submissions: [],
  isLoading: false,
};

function reducer(state: GradingState, action: GradingAction): GradingState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: undefined };
    case 'LOAD_SUCCESS':
      return { ...state, isLoading: false, submissions: action.payload };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'UPSERT_SUBMISSION': {
      const idx = state.submissions.findIndex(s => s.id === action.payload.id);
      const submissions = [...state.submissions];
      if (idx >= 0) submissions[idx] = action.payload; else submissions.unshift(action.payload);
      return { ...state, submissions };
    }
    case 'BULK_SET':
      return { ...state, submissions: action.payload };
    default:
      return state;
  }
}

interface GradingContextValue {
  submissions: Submission[];
  isLoading: boolean;
  search: (filters: SubmissionFilters) => Submission[];
  grade: (input: GradeInput) => Promise<GradeEvent>;
  addSubmission: (s: Submission) => void; // For SubmissionForm hookup
  reload: () => void;
}

const GradingContext = createContext<GradingContextValue | null>(null);

const STORAGE_KEY = 'vulhub.submissions.v1';

function loadFromStorage(): Submission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Submission[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(submissions: Submission[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch {}
}

export const GradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user: currentUser, updateUserPoints } = useAuth();

  useEffect(() => {
    const init = async () => {
      dispatch({ type: 'LOAD_START' });
      try {
        // Try server with timeout
        const list = await Promise.race([
          GradingApi.listSubmissions(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ]);
        persistServer(list as any);
        dispatch({ type: 'LOAD_SUCCESS', payload: list as any });
      } catch (error) {
        console.warn('Server submissions load failed, using local storage:', error);
        const data = loadFromStorage();
        dispatch({ type: 'LOAD_SUCCESS', payload: data });
      }
    };
    init();
  }, []);

  const reload = () => {
    const data = loadFromStorage();
    dispatch({ type: 'LOAD_SUCCESS', payload: data });
  };

  const persist = (submissions: Submission[]) => {
    saveToStorage(submissions);
    dispatch({ type: 'BULK_SET', payload: submissions });
  };

  const persistServer = (submissions: Submission[]) => {
    // normalize Dates if server returns strings
    const norm = submissions.map(s => ({ ...s })) as Submission[];
    saveToStorage(norm);
  };

  const addSubmission = (s: Submission) => {
    const next = [s, ...state.submissions];
    persist(next);
  };

  const search = (filters: SubmissionFilters): Submission[] => {
    const f = filters;
    return state.submissions.filter(s => {
      if (f.status && f.status !== 'all' && s.status !== f.status) return false;
      if (f.studentId && s.userId !== f.studentId) return false;
      if (f.studentName && !s.userName.toLowerCase().includes(f.studentName.toLowerCase())) return false;
      if (f.activityId && s.activityId !== f.activityId) return false;
      if (f.activityName && !s.activityName.toLowerCase().includes(f.activityName.toLowerCase())) return false;
      if (f.q) {
        const q = f.q.toLowerCase();
        const hay = `${s.userName} ${s.activityName} ${s.description ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (f.from && new Date(s.createdAt) < new Date(f.from)) return false;
      if (f.to && new Date(s.createdAt) > new Date(f.to)) return false;
      return true;
    });
  };

  const grade = async (input: GradeInput): Promise<GradeEvent> => {
    const idx = state.submissions.findIndex(s => s.id === input.submissionId);
    if (idx < 0) throw new Error('Submission not found');

    const s = state.submissions[idx];
    const now = new Date().toISOString();

    const updated: Submission = {
      ...s,
      status: input.status,
      pointsAwarded: input.pointsAwarded,
      feedback: input.feedback,
      gradedAt: now,
      gradedBy: currentUser?.id,
    };

    // Try server; fallback to local
    try {
      await GradingApi.grade(updated.id, { status: updated.status as any, pointsAwarded: input.pointsAwarded, feedback: input.feedback });
    } catch {}
    const next = [...state.submissions];
    next[idx] = updated;
    persist(next);

    // Update the student's points in Auth context (mock/local)
    const delta = input.status === 'approved' ? input.pointsAwarded ?? 0 : 0;
    let newTotal = 0;
    if (delta && typeof updateUserPoints === 'function') {
      newTotal = await updateUserPoints(updated.userId, delta);
    }

    const evt: GradeEvent = {
      submissionId: updated.id,
      userId: updated.userId,
      deltaPoints: delta,
      newTotalPoints: newTotal,
      status: updated.status as any,
      gradedAt: now,
    };
    return evt;
  };

  const value = useMemo<GradingContextValue>(() => ({
    submissions: state.submissions,
    isLoading: state.isLoading,
    search,
    grade,
    addSubmission,
    reload,
  }), [state.submissions, state.isLoading]);

  return <GradingContext.Provider value={value}>{children}</GradingContext.Provider>;
};

export const useGrading = () => {
  const ctx = useContext(GradingContext);
  if (!ctx) throw new Error('useGrading must be used within GradingProvider');
  return ctx;
};
