# 🎯 Phase 2: State Management Simplification Plan

**Goal**: Reduce redundant state management from 5 contexts + 142 useState + 84 useEffect to 2 contexts + local state

**Current State**: Complex overlapping state management systems
**Target State**: Clean, predictable state flow with minimal abstraction

---

## 📋 PHASE 2 OBJECTIVES

### Simplify Architecture
- ✅ Remove 3 redundant contexts (Forum, Grading, Notifications)
- ✅ Convert useReducer to simple useState where appropriate
- ✅ Consolidate related state into single contexts
- ✅ Remove unnecessary effect dependencies

### Improve Data Flow
- ✅ Direct prop passing instead of context drilling
- ✅ Clear state ownership boundaries
- ✅ Predictable update patterns
- ✅ Remove circular dependencies

### Performance Optimization
- ✅ Reduce re-renders from context changes
- ✅ Optimize effect dependencies
- ✅ Implement proper memoization
- ✅ Remove unnecessary subscriptions

---

## 🔧 DETAILED IMPLEMENTATION PLAN

### Step 2.1: Context Analysis & Consolidation (Week 1, Days 1-2)

#### Current Context Usage Analysis
```typescript
// Current contexts (5 total):
1. AuthContext - ✅ KEEP (essential)
2. ThemeContext - ✅ KEEP (needed for theming)
3. GradingContext - ❌ REMOVE (local state sufficient)
4. ForumContext - ❌ REMOVE (local state sufficient)
5. NotificationsContext - ❌ REMOVE (local to components)
```

#### Grading Context Removal Plan

**Current Usage**:
```typescript
// Grading context used in:
- grading/page.tsx (main grading dashboard)
- grading/[submissionId]/page.tsx (individual grading)
- components/grading/GradingDashboard.tsx

// State managed:
- selectedSubmission: Submission | null
- gradingMode: 'quick' | 'detailed'
- bulkActions: boolean
- filters: GradingFilters
```

**Replacement Strategy**:
```typescript
// Convert to local state + URL params
function GradingPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradingMode, setGradingMode] = useState<'quick' | 'detailed'>('detailed');
  const [bulkActions, setBulkActions] = useState(false);
  const [filters, setFilters] = useState<GradingFilters>({});

  // Persist to URL for bookmarkable state
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode') as 'quick' | 'detailed' || 'detailed';
    const bulk = searchParams.get('bulk') === 'true';
    setGradingMode(mode);
    setBulkActions(bulk);
  }, [searchParams]);

  const updateFilters = useCallback((newFilters: Partial<GradingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Expose state and actions
  return (
    <GradingContext.Provider value={{
      selectedSubmission,
      setSelectedSubmission,
      gradingMode,
      setGradingMode,
      bulkActions,
      setBulkActions,
      filters,
      updateFilters
    }}>
      {/* content */}
    </GradingContext.Provider>
  );
}
```

**Migration Steps**:
1. Move state to local component state
2. Use URL params for shareable state
3. Pass state down as props instead of context
4. Remove GradingContext entirely

#### Forum Context Removal Plan

**Current Usage**:
```typescript
// Forum context used in:
- community/page.tsx
- community/thread/[id]/page.tsx
- components/forum/ForumPost.tsx

// State managed:
- currentThread: Thread | null
- replies: Reply[]
- sortOrder: 'newest' | 'oldest' | 'popular'
- searchQuery: string
```

**Replacement Strategy**:
```typescript
// Convert to local state with data fetching
function CommunityPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Data fetching
  useEffect(() => {
    fetchThreads(sortOrder, searchQuery).then(setThreads);
  }, [sortOrder, searchQuery]);

  // Thread selection
  const selectThread = useCallback(async (thread: Thread) => {
    setCurrentThread(thread);
    const threadReplies = await fetchReplies(thread.id);
    setReplies(threadReplies);
  }, []);

  // Expose actions
  const contextValue = useMemo(() => ({
    threads,
    currentThread,
    replies,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    selectThread,
    loading
  }), [threads, currentThread, replies, sortOrder, searchQuery, selectThread, loading]);

  return <ForumContext.Provider value={contextValue}>{/* content */}</ForumContext.Provider>;
}
```

#### Notifications Context Removal Plan

**Current Usage**:
```typescript
// Notifications context used in:
- components/ToastContainer.tsx
- components/NotificationCenter.tsx

// State managed:
- notifications: Notification[]
- unreadCount: number
- settings: NotificationSettings
```

**Replacement Strategy**:
```typescript
// Convert to local state per component
function AppLayout() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({});

  // Notification actions
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const unreadCount = useMemo(() =>
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      settings,
      setSettings,
      addNotification,
      markAsRead
    }}>
      {/* content */}
    </NotificationsContext.Provider>
  );
}
```

### Step 2.2: useReducer Simplification (Week 1, Days 3-4)

#### Identify Over-Engineered useReducer Usage

**Current Complex Reducers**:
```typescript
// Find useReducer usage
grep -r "useReducer" apps/web/src --include="*.tsx" --include="*.ts"
```

**Simplification Strategy**:
```typescript
// BEFORE: Complex reducer for simple state
const [state, dispatch] = useReducer(formReducer, initialState);

// AFTER: Simple useState
const [formData, setFormData] = useState(initialFormData);
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

// Helper functions instead of actions
const updateField = useCallback((field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  // Clear error for this field
  setErrors(prev => ({ ...prev, [field]: undefined }));
}, []);

const validateAndSubmit = useCallback(async () => {
  setIsSubmitting(true);
  try {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await submitForm(formData);
  } finally {
    setIsSubmitting(false);
  }
}, [formData]);
```

**Conversion Criteria**:
- ✅ Convert if state has < 5 properties
- ✅ Convert if logic is mostly synchronous
- ✅ Keep reducer if complex async state transitions
- ✅ Keep reducer if undo/redo functionality needed

### Step 2.3: Effect Optimization (Week 1, Day 5)

#### Current Effect Issues
```typescript
// BEFORE: Over-broad dependencies
useEffect(() => {
  fetchData(filters, sortOrder, searchQuery, page, pageSize);
}, [filters, sortOrder, searchQuery, page, pageSize]); // Too many deps

// BEFORE: Missing dependencies
useEffect(() => {
  const handler = () => setWindowSize(getWindowSize());
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []); // Missing handler dependency - ESLint error
```

#### Optimization Strategy
```typescript
// AFTER: Debounced with proper dependencies
const debouncedFetch = useCallback(
  debounce((filters, sort, search, page, size) => {
    fetchData(filters, sort, search, page, size);
  }, 300),
  [] // Empty deps since debounce creates stable function
);

useEffect(() => {
  debouncedFetch(filters, sortOrder, searchQuery, page, pageSize);
}, [debouncedFetch, filters, sortOrder, searchQuery, page, pageSize]);

// AFTER: Proper cleanup with dependencies
useEffect(() => {
  const handler = () => setWindowSize(getWindowSize());
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []); // Handler is stable, no dependencies needed

// AFTER: useEventListener custom hook
function useWindowSize() {
  const [size, setSize] = useState(getWindowSize());

  useEffect(() => {
    const handler = () => setSize(getWindowSize());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []); // Stable handler

  return size;
}
```

### Step 2.4: Context Performance Optimization (Week 2, Days 1-2)

#### Current Performance Issues
```typescript
// BEFORE: Context re-renders everything on any change
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [colors, setColors] = useState<ColorPalette>(defaultColors);
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  // Every change re-renders all consumers
  const value = {
    theme,
    colors,
    fontSize,
    setTheme,
    setColors,
    setFontSize
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### Optimization Strategy
```typescript
// AFTER: Split contexts to reduce re-renders
const ThemeContext = createContext<Theme | undefined>(undefined);
const ThemeActionsContext = createContext<ThemeActions | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <ThemeActionsContext.Provider value={{ setTheme }}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </ThemeActionsContext.Provider>
  );
}

// Custom hooks to prevent unnecessary re-renders
function useTheme() {
  const theme = useContext(ThemeContext);
  if (theme === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return theme;
}

function useThemeActions() {
  const actions = useContext(ThemeActionsContext);
  if (actions === undefined) {
    throw new Error('useThemeActions must be used within ThemeProvider');
  }
  return actions;
}
```

#### Memoization Strategy
```typescript
// AFTER: Proper memoization
const ThemeProvider = memo(function ThemeProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<Theme>('dark');

  const actions = useMemo(() => ({
    setTheme: useCallback((newTheme: Theme) => {
      setTheme(newTheme);
    }, [])
  }), []);

  return (
    <ThemeActionsContext.Provider value={actions}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </ThemeActionsContext.Provider>
  );
});
```

### Step 2.5: State Ownership & Boundaries (Week 2, Days 3-5)

#### Current Issues
- State owned by wrong components
- Props drilling through multiple levels
- Unclear state ownership

#### Refactoring Strategy
```typescript
// BEFORE: State owned by layout, drilled down
function AppLayout() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Sidebar user={user} />
      <MainContent user={user} />
    </AuthContext.Provider>
  );
}

// AFTER: State owned by leaf components, lifted only when needed
function AppLayout() {
  return (
    <AuthProvider>
      <Sidebar />
      <MainContent />
    </AuthProvider>
  );
}

function Sidebar() {
  const { user } = useAuth();
  // Component owns its own rendering logic
}

function MainContent() {
  const { user, logout } = useAuth();
  // Component owns its own rendering logic
}
```

#### State Lifting Strategy
```typescript
// Only lift state when multiple components need coordination
function GradingWorkflow() {
  // Local state for coordination
  const [currentStep, setCurrentStep] = useState<'select' | 'grade' | 'review'>('select');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  return (
    <div>
      {currentStep === 'select' && (
        <SubmissionSelector
          onSelect={(submission) => {
            setSelectedSubmission(submission);
            setCurrentStep('grade');
          }}
        />
      )}
      {currentStep === 'grade' && selectedSubmission && (
        <GradingForm
          submission={selectedSubmission}
          onComplete={() => setCurrentStep('review')}
        />
      )}
    </div>
  );
}
```

---

## 📊 PHASE 2 METRICS

### Quantitative Targets
- **Contexts**: Reduce from 5 to 2 (-60%)
- **useState instances**: Maintain or slightly increase (acceptable)
- **useEffect instances**: Reduce by 30% (from 84 to ~60)
- **Re-renders**: Reduce by 40% (measure with React DevTools)

### Qualitative Targets
- ✅ Clear state ownership boundaries
- ✅ Predictable data flow
- ✅ Minimal prop drilling
- ✅ Proper memoization
- ✅ No circular dependencies

---

## 🔗 PHASE 2 DEPENDENCIES

### Prerequisites
- ✅ Phase 1 animation system completed
- ✅ Basic functionality verified
- ✅ No breaking changes introduced

### Risks
- **State Loss**: Careful migration of existing state
- **Breaking Changes**: Gradual rollout with fallbacks
- **Performance Regression**: Monitor re-render patterns

### Testing Requirements
- **Unit Tests**: State management logic
- **Integration Tests**: Component interactions
- **Performance Tests**: Re-render frequencies
- **Regression Tests**: Existing functionality

---

## 🎯 PHASE 2 SUCCESS CRITERIA

**Phase 2 is complete when:**

✅ **Architecture**: Only 2 contexts remain (Auth, Theme)
✅ **Performance**: 40% reduction in unnecessary re-renders
✅ **Maintainability**: Clear state ownership and data flow
✅ **Reliability**: No state loss or inconsistent behavior
✅ **Developer Experience**: Easy to reason about state changes

---

**Ready to begin Phase 2 implementation?** This will significantly simplify your state management while maintaining all functionality.
