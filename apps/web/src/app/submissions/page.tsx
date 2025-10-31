'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileImage, 
  FileText, 
  CheckCircle, 
  Clock, 
  Star, 
  Target,
  Trophy,
  AlertCircle,
  X,
  Plus,
  Eye,
  Download,
  ArrowLeft
} from 'lucide-react';
import RippleGridV2 from '../../components/RippleGrid/RippleGridV2';

interface Submission {
  id: string;
  challengeName: string;
  environment: string;
  description: string;
  files: File[];
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  points: number;
  submittedAt: Date;
  reviewedAt?: Date;
  feedback?: string;
}

const VULHUB_CHALLENGES = [
  {
    id: 'nextjs-middleware',
    name: 'Next.js Middleware Authorization Bypass',
    environment: 'framework/nextjs/CVE-2025-29927',
    difficulty: 'intermediate',
    points: 150,
    category: 'Framework / Auth Bypass',
    description: 'Exploit Next.js middleware authorization bypass vulnerability'
  },
  {
    id: 'langflow-rce',
    name: 'Langflow validate/code Pre-Auth RCE',
    environment: 'llm/langflow/CVE-2025-3248',
    difficulty: 'advanced',
    points: 250,
    category: 'LLM / RCE',
    description: 'Remote code execution through Langflow validation'
  },
  {
    id: 'h2-console-rce',
    name: 'H2 Console Authentication RCE',
    environment: 'database/h2/CVE-2018-10054',
    difficulty: 'intermediate',
    points: 180,
    category: 'Database / RCE',
    description: 'H2 database console remote code execution'
  },
  {
    id: 'confluence-ognl',
    name: 'Confluence OGNL Pre-Auth RCE',
    environment: 'expression-injection/confluence/CVE-2022-26134',
    difficulty: 'advanced',
    points: 220,
    category: 'Expression Injection / RCE',
    description: 'Confluence OGNL expression injection vulnerability'
  },
  {
    id: 'spring-spel',
    name: 'Spring Cloud Function SpEL Injection',
    environment: 'expression-injection/spring/CVE-2022-22963',
    difficulty: 'intermediate',
    points: 160,
    category: 'Expression Injection / RCE',
    description: 'Spring Cloud Function SpEL injection vulnerability'
  },
  {
    id: 'postgresql-privesc',
    name: 'PostgreSQL Privilege Escalation',
    environment: 'priv-esc/postgresql/CVE-2018-1058',
    difficulty: 'advanced',
    points: 200,
    category: 'Privilege Escalation',
    description: 'PostgreSQL privilege escalation vulnerability'
  },
  {
    id: 'drupal-xss',
    name: 'Drupal XSS by File Upload',
    environment: 'cms/drupal/CVE-2019-6341',
    difficulty: 'beginner',
    points: 120,
    category: 'CMS / XSS',
    description: 'Drupal XSS vulnerability through file upload'
  }
];

export default function SubmissionsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedChallenge || !submissionDescription.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const challenge = VULHUB_CHALLENGES.find(c => c.id === selectedChallenge);
    if (challenge) {
      const newSubmission: Submission = {
        id: Date.now().toString(),
        challengeName: challenge.name,
        environment: challenge.environment,
        description: submissionDescription,
        files: uploadedFiles,
        status: 'pending',
        points: challenge.points,
        submittedAt: new Date()
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      setShowSubmissionForm(false);
      setSelectedChallenge('');
      setSubmissionDescription('');
      setUploadedFiles([]);
    }

    setIsSubmitting(false);
  };

  const getStatusColor = (status: Submission['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'under_review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusIcon = (status: Submission['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body relative">
      {/* RippleGrid Background */}
      <div className="fixed inset-0 z-0">
        <RippleGridV2
          enableRainbow={false}
          gridColor="#00ff00"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          fadeDistance={1.5}
          vignetteStrength={2.0}
          glowIntensity={0.1}
          opacity={0.3}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 layer-header header-surface">
        <div className="container mx-auto px-4 py-6">
          <button 
            onClick={() => router.push('/')}
            className="matrix-button matrix-button-outline mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-matrix-glow mb-2">Challenge Submissions</h1>
              <p className="text-muted">Submit your VulHub challenge completions with proof</p>
            </div>
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="matrix-button matrix-button-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Submission
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="layer-content container mx-auto px-4 py-8">
        {submissions.length === 0 ? (
          <div className="matrix-card hover-lift">
            <div className="text-center py-12 px-6">
              <Trophy className="h-16 w-16 text-dim mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-bright mb-2">No Submissions Yet</h3>
              <p className="text-muted mb-6">Start your cybersecurity journey by completing VulHub challenges and submitting your proof!</p>
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="matrix-button matrix-button-primary"
              >
                <Target className="h-4 w-4 mr-2" />
                Submit Your First Challenge
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="matrix-card hover-lift">
                <div className="matrix-card-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-display font-bold text-matrix">{submission.challengeName}</h2>
                      <p className="text-sm text-muted mt-1">{submission.environment}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)} border`}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1 capitalize">{submission.status.replace('_', ' ')}</span>
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-matrix-glow">{submission.points}</div>
                        <div className="text-xs text-muted">points</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="matrix-card-content">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-bright mb-2">Description</h4>
                      <p className="text-muted text-sm">{submission.description}</p>
                    </div>
                    
                    {submission.files.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-bright mb-2">Proof Files</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {submission.files.map((file, index) => (
                            <div key={index} className="rounded-lg p-3 row-surface hover-lift-subtle">
                              <div className="flex items-center space-x-2 mb-2">
                                {file.type.startsWith('image/') ? (
                                  <FileImage className="h-4 w-4 text-blue-400" />
                                ) : (
                                  <FileText className="h-4 w-4 text-matrix" />
                                )}
                                <span className="text-xs text-bright truncate">{file.name}</span>
                              </div>
                              <div className="text-xs text-dim">
                                {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-neutral-500">
                      <span>Submitted: {submission.submittedAt.toLocaleDateString()}</span>
                      {submission.reviewedAt && (
                        <span>Reviewed: {submission.reviewedAt.toLocaleDateString()}</span>
                      )}
                    </div>

                    {submission.feedback && (
                      <div className="rounded-lg p-3 row-surface">
                        <h4 className="text-sm font-medium text-bright mb-2">Feedback</h4>
                        <p className="text-muted text-sm">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl surface-3 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary font-display">Submit Challenge Completion</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSubmissionForm(false)}
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Challenge Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Select Challenge *
                </label>
                <select
                  value={selectedChallenge}
                  onChange={(e) => setSelectedChallenge(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-neutral-100 focus:outline-none focus:border-primary"
                >
                  <option value="">Choose a challenge...</option>
                  {VULHUB_CHALLENGES.map((challenge) => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.name} ({challenge.points} pts) - {challenge.difficulty}
                    </option>
                  ))}
                </select>
                {selectedChallenge && (
                  <div className="mt-2 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
                    {(() => {
                      const challenge = VULHUB_CHALLENGES.find(c => c.id === selectedChallenge);
                      return challenge ? (
                        <div>
                          <h4 className="font-medium text-neutral-200">{challenge.name}</h4>
                          <p className="text-sm text-neutral-400 mt-1">{challenge.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {challenge.category}
                            </Badge>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              {challenge.difficulty}
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {challenge.points} points
                            </Badge>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Description *
                </label>
                <Textarea
                  value={submissionDescription}
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                  placeholder="Describe how you completed the challenge, what vulnerabilities you found, and your approach..."
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-primary"
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Proof Files (Screenshots, Videos, Documents)
                </label>
                <div className="border-2 border-dashed border-neutral-600 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                  <p className="text-neutral-400 mb-2">Upload screenshots, videos, or documents as proof</p>
                  <p className="text-xs text-neutral-500 mb-4">PNG, JPG, MP4, PDF, TXT files accepted</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-primary text-black rounded font-medium cursor-pointer hover:bg-primary/90"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-neutral-300 mb-2">Uploaded Files</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                          <div className="flex items-center space-x-2">
                            {file.type.startsWith('image/') ? (
                              <FileImage className="h-4 w-4 text-blue-400" />
                            ) : file.type.startsWith('video/') ? (
                              <FileText className="h-4 w-4 text-purple-400" />
                            ) : (
                              <FileText className="h-4 w-4 text-green-400" />
                            )}
                            <span className="text-sm text-neutral-300">{file.name}</span>
                            <span className="text-xs text-neutral-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedChallenge || !submissionDescription.trim() || isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Challenge
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSubmissionForm(false)}
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
