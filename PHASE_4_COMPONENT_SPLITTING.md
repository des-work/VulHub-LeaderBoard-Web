# 🧩 Phase 4: Component Architecture Refinement Plan

**Goal**: Break down massive components (<300 lines each) while maintaining functionality

**Current State**: SubmissionForm (582 lines), grading pages (442+ lines)
**Target State**: Modular, focused components with clear responsibilities

---

## 📋 PHASE 4 OBJECTIVES

### Component Size Reduction
- ✅ Split components >300 lines into smaller, focused pieces
- ✅ Each component has single responsibility
- ✅ Improve reusability and testability
- ✅ Reduce cognitive load for developers

### Architecture Improvements
- ✅ Clear component hierarchy
- ✅ Proper prop interfaces
- ✅ Consistent patterns
- ✅ Better error boundaries

### Developer Experience
- ✅ Easier to understand and modify
- ✅ Better testing capabilities
- ✅ Faster development iteration
- ✅ Reduced merge conflicts

---

## 🔧 DETAILED IMPLEMENTATION PLAN

### Step 4.1: Component Analysis & Planning (Week 1, Days 1-2)

#### Current Large Components Inventory
```bash
# Find components over 300 lines
find apps/web/src -name "*.tsx" -exec wc -l {} \; | sort -nr | head -10
```

**Results**:
```
582 apps/web/src/components/submissions/SubmissionForm.tsx
442 apps/web/src/app/grading/page.tsx
446 apps/web/src/app/grading/[submissionId]/page.tsx
379 apps/web/src/app/community/page.tsx
374 apps/web/src/app/profile/page.tsx
337 apps/web/src/lib/auth/context.tsx
```

#### Component Splitting Strategy

**1. SubmissionForm.tsx (582 lines) → Multiple Components**

**Current Structure**:
```typescript
function SubmissionForm() {
  // 100+ lines: Form state management
  // 150+ lines: File upload logic
  // 100+ lines: Validation logic
  // 80+ lines: UI rendering
  // 50+ lines: API calls
  // 50+ lines: Error handling
}
```

**Target Structure**:
```
components/submissions/
├── SubmissionForm.tsx (150 lines - orchestrator)
├── FileUploadArea.tsx (80 lines - file handling)
├── FormFields.tsx (100 lines - input fields)
├── ValidationDisplay.tsx (50 lines - error display)
├── SubmissionPreview.tsx (100 lines - preview)
└── hooks/
    ├── useSubmissionForm.ts (100 lines - form logic)
    ├── useFileUpload.ts (80 lines - upload logic)
    └── useValidation.ts (70 lines - validation logic)
```

**2. Grading Pages → Modular Components**

**grading/page.tsx (442 lines)**:
```
components/grading/
├── GradingDashboard.tsx (120 lines)
├── SubmissionList.tsx (100 lines)
├── BulkActions.tsx (80 lines)
├── GradingFilters.tsx (60 lines)
└── GradingStats.tsx (50 lines)
```

**grading/[submissionId]/page.tsx (446 lines)**:
```
components/grading/
├── GradingForm.tsx (150 lines)
├── SubmissionViewer.tsx (120 lines)
├── RubricDisplay.tsx (80 lines)
├── FeedbackEditor.tsx (60 lines)
└── GradeHistory.tsx (50 lines)
```

### Step 4.2: SubmissionForm Refactoring (Week 1, Days 3-5)

#### Create Custom Hooks First

**Step 2.2.1: Extract useSubmissionForm Hook**
```typescript
// hooks/useSubmissionForm.ts
interface SubmissionFormData {
  title: string;
  description: string;
  files: File[];
  tags: string[];
  category: string;
}

export function useSubmissionForm() {
  const [formData, setFormData] = useState<SubmissionFormData>({
    title: '',
    description: '',
    files: [],
    tags: [],
    category: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: keyof SubmissionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.files.length === 0) {
      newErrors.files = 'At least one file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submit = useCallback(async (): Promise<Submission> => {
    if (!validate()) {
      throw new Error('Validation failed');
    }

    setIsSubmitting(true);
    try {
      const submission = await SubmissionApi.create(formData);
      return submission;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate]);

  return {
    formData,
    updateField,
    errors,
    isSubmitting,
    submit,
    validate
  };
}
```

**Step 2.2.2: Extract useFileUpload Hook**
```typescript
// hooks/useFileUpload.ts
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const addFiles = useCallback(async (newFiles: FileList) => {
    setUploading(true);
    try {
      const uploadedFiles: UploadedFile[] = [];

      for (const file of Array.from(newFiles)) {
        const uploaded = await UploadApi.upload(file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        });
        uploadedFiles.push(uploaded);
      }

      setFiles(prev => [...prev, ...uploadedFiles]);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  return {
    files,
    uploading,
    uploadProgress,
    addFiles,
    removeFile
  };
}
```

#### Create Component Modules

**Step 2.2.3: FileUploadArea Component**
```typescript
// components/submissions/FileUploadArea.tsx
interface FileUploadAreaProps {
  files: UploadedFile[];
  uploading: boolean;
  uploadProgress: Record<string, number>;
  onAddFiles: (files: FileList) => void;
  onRemoveFile: (fileId: string) => void;
}

export function FileUploadArea({
  files,
  uploading,
  uploadProgress,
  onAddFiles,
  onRemoveFile
}: FileUploadAreaProps) {
  return (
    <div className="file-upload-area">
      <div className="upload-zone">
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && onAddFiles(e.target.files)}
          disabled={uploading}
          className="file-input"
        />
        {uploading && <UploadProgress progress={uploadProgress} />}
      </div>

      <FileList files={files} onRemove={onRemoveFile} />
    </div>
  );
}
```

**Step 2.2.4: FormFields Component**
```typescript
// components/submissions/FormFields.tsx
interface FormFieldsProps {
  formData: SubmissionFormData;
  errors: Record<string, string>;
  onUpdateField: (field: keyof SubmissionFormData, value: any) => void;
}

export function FormFields({ formData, errors, onUpdateField }: FormFieldsProps) {
  return (
    <div className="form-fields">
      <div className="field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => onUpdateField('title', e.target.value)}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdateField('description', e.target.value)}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => onUpdateField('category', e.target.value)}
        >
          <option value="">Select category</option>
          <option value="web">Web Development</option>
          <option value="mobile">Mobile Development</option>
          <option value="data">Data Science</option>
        </select>
      </div>

      <TagInput
        tags={formData.tags}
        onChange={(tags) => onUpdateField('tags', tags)}
      />
    </div>
  );
}
```

**Step 2.2.5: Refactored SubmissionForm Orchestrator**
```typescript
// components/submissions/SubmissionForm.tsx
export function SubmissionForm() {
  const form = useSubmissionForm();
  const fileUpload = useFileUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await form.submit();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="submission-form">
      <FormFields
        formData={form.formData}
        errors={form.errors}
        onUpdateField={form.updateField}
      />

      <FileUploadArea
        files={fileUpload.files}
        uploading={fileUpload.uploading}
        uploadProgress={fileUpload.uploadProgress}
        onAddFiles={fileUpload.addFiles}
        onRemoveFile={fileUpload.removeFile}
      />

      <SubmissionPreview
        formData={form.formData}
        files={fileUpload.files}
      />

      <button
        type="submit"
        disabled={form.isSubmitting || fileUpload.uploading}
        className="submit-button"
      >
        {form.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Step 4.3: Grading Pages Refactoring (Week 2, Days 1-3)

#### Refactor grading/page.tsx

**Current**: 442 lines of mixed concerns
**Target**: Modular components

**Step 4.3.1: Create GradingDashboard**
```typescript
// components/grading/GradingDashboard.tsx
interface GradingDashboardProps {
  submissions: Submission[];
  filters: GradingFilters;
  onFilterChange: (filters: GradingFilters) => void;
  onBulkAction: (action: string, submissionIds: string[]) => void;
}

export function GradingDashboard({
  submissions,
  filters,
  onFilterChange,
  onBulkAction
}: GradingDashboardProps) {
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      // Apply filters
      if (filters.status && submission.status !== filters.status) return false;
      if (filters.category && submission.category !== filters.category) return false;
      return true;
    });
  }, [submissions, filters]);

  return (
    <div className="grading-dashboard">
      <GradingFilters
        filters={filters}
        onChange={onFilterChange}
      />

      <GradingStats submissions={filteredSubmissions} />

      <BulkActions
        selectedCount={selectedSubmissions.size}
        onAction={(action) => onBulkAction(action, Array.from(selectedSubmissions))}
      />

      <SubmissionList
        submissions={filteredSubmissions}
        selected={selectedSubmissions}
        onSelectionChange={setSelectedSubmissions}
      />
    </div>
  );
}
```

**Step 4.3.2: Refactored grading/page.tsx**
```typescript
// app/grading/page.tsx
export default function GradingPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filters, setFilters] = useState<GradingFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await SubmissionApi.getPending();
      setSubmissions(data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: string, submissionIds: string[]) => {
    try {
      switch (action) {
        case 'approve':
          await SubmissionApi.bulkApprove(submissionIds);
          break;
        case 'reject':
          await SubmissionApi.bulkReject(submissionIds);
          break;
      }
      await loadSubmissions(); // Refresh
    } catch (error) {
      // Handle error
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="grading-page">
      <h1>Grading Dashboard</h1>
      <GradingDashboard
        submissions={submissions}
        filters={filters}
        onFilterChange={setFilters}
        onBulkAction={handleBulkAction}
      />
    </div>
  );
}
```

### Step 4.4: Profile Page Refactoring (Week 2, Days 4-5)

#### Current Issues
- 374 lines mixing data fetching, UI logic, and business logic
- Complex state management
- Poor separation of concerns

#### Refactoring Strategy

**Step 4.4.1: Extract Profile Data Hook**
```typescript
// hooks/useProfile.ts
export function useProfile(userId: string) {
  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [userData, statsData, submissionsData] = await Promise.all([
        UserApi.getProfile(userId),
        UserApi.getStats(userId),
        SubmissionApi.getByUser(userId)
      ]);

      setProfile(userData);
      setStats(statsData);
      setSubmissions(submissionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const updated = await UserApi.updateProfile(userId, updates);
      setProfile(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    profile,
    stats,
    submissions,
    loading,
    error,
    updateProfile,
    reload: loadProfile
  };
}
```

**Step 4.4.2: Create Profile Components**
```typescript
// components/profile/ProfileStats.tsx
interface ProfileStatsProps {
  stats: UserStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="profile-stats">
      <StatCard title="Total Points" value={stats.totalPoints} />
      <StatCard title="Completed Activities" value={stats.completedActivities} />
      <StatCard title="Current Streak" value={stats.currentStreak} />
      <StatCard title="Best Streak" value={stats.bestStreak} />
    </div>
  );
}

// components/profile/RecentSubmissions.tsx
interface RecentSubmissionsProps {
  submissions: Submission[];
}

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  return (
    <div className="recent-submissions">
      <h3>Recent Submissions</h3>
      <SubmissionList submissions={submissions.slice(0, 5)} />
    </div>
  );
}
```

**Step 4.4.3: Simplified Profile Page**
```typescript
// app/profile/page.tsx
export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, stats, submissions, loading, error, updateProfile } = useProfile(user?.id || '');

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!profile) return <NotFound />;

  return (
    <div className="profile-page">
      <ProfileHeader user={profile} onUpdate={updateProfile} />

      <div className="profile-content">
        <ProfileStats stats={stats} />
        <RecentSubmissions submissions={submissions} />
        <ActivityTimeline activities={profile.completedActivities} />
      </div>
    </div>
  );
}
```

### Step 4.5: Community Page Refactoring (Week 3, Days 1-2)

#### Current Issues
- 379 lines mixing forum logic, search, and UI
- Complex state management
- Poor performance with large datasets

#### Refactoring Strategy

**Step 4.5.1: Extract Community Logic**
```typescript
// hooks/useCommunity.ts
export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [loading, setLoading] = useState(true);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      // Search logic
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  return {
    posts,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    loading
  };
}
```

**Step 4.5.2: Create Community Components**
```typescript
// components/community/SearchAndFilters.tsx
interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortBy: 'newest' | 'popular' | 'trending';
  onSortChange: (sort: 'newest' | 'popular' | 'trending') => void;
  categories: Category[];
}

export function SearchAndFilters({ /* props */ }: SearchAndFiltersProps) {
  return (
    <div className="search-filters">
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={onCategoryChange}
      />
      <SortSelector value={sortBy} onChange={onSortChange} />
    </div>
  );
}

// components/community/PostList.tsx
interface PostListProps {
  posts: Post[];
  loading: boolean;
  onPostClick: (post: Post) => void;
}

export function PostList({ posts, loading, onPostClick }: PostListProps) {
  if (loading) return <PostSkeleton />;

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostCard key={post.id} post={post} onClick={onPostClick} />
      ))}
    </div>
  );
}
```

### Step 4.6: Testing & Validation (Week 3, Days 3-5)

#### Component Testing Strategy
```typescript
// tests/components/SubmissionForm.test.tsx
describe('SubmissionForm', () => {
  it('should render form fields', () => {
    render(<SubmissionForm />);
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const mockSubmit = jest.fn();
    render(<SubmissionForm onSubmit={mockSubmit} />);

    // Fill form
    await userEvent.type(screen.getByLabelText('Title *'), 'Test Title');
    await userEvent.type(screen.getByLabelText('Description *'), 'Test Description');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Test Title',
      description: 'Test Description'
    });
  });
});
```

#### Integration Testing
```typescript
// tests/integration/GradingWorkflow.test.tsx
describe('Grading Workflow', () => {
  it('should complete grading workflow', async () => {
    render(<GradingWorkflow />);

    // Select submission
    await userEvent.click(screen.getByText('Submission 1'));

    // Grade it
    await userEvent.selectOptions(screen.getByLabelText('Grade'), 'A');
    await userEvent.click(screen.getByText('Submit Grade'));

    // Verify completion
    expect(screen.getByText('Grading completed')).toBeInTheDocument();
  });
});
```

---

## 📊 PHASE 4 METRICS

### Quantitative Targets
- **Components >300 lines**: Reduce from 6 to 0 (-100%)
- **Average component size**: <150 lines (from ~400)
- **Test coverage**: >80% for refactored components
- **Reusability**: 3+ usages per shared component

### Qualitative Targets
- ✅ Single responsibility principle
- ✅ Clear component boundaries
- ✅ Consistent prop interfaces
- ✅ Proper error boundaries

---

## 🔗 PHASE 4 DEPENDENCIES

### Prerequisites
- ✅ Phase 3 API simplification completed
- ✅ Component usage patterns understood
- ✅ No breaking changes from previous phases

### Risks
- **Breaking Changes**: Component interface changes
- **Testing Gap**: Need comprehensive testing
- **Performance**: Potential re-render issues

### Testing Requirements
- **Unit Tests**: Individual component behavior
- **Integration Tests**: Component interactions
- **Visual Tests**: UI consistency
- **Performance Tests**: Rendering efficiency

---

## 🎯 PHASE 4 SUCCESS CRITERIA

**Phase 4 is complete when:**

✅ **Size**: No components >300 lines
✅ **Modularity**: Clear separation of concerns
✅ **Reusability**: Components used in multiple places
✅ **Testability**: Easy to test individual components
✅ **Maintainability**: Easy to understand and modify

---

**Ready to begin Phase 4 implementation?** This will transform your large, monolithic components into a well-structured, maintainable component architecture.
