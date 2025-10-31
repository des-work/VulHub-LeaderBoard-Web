'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth/context';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  FileImage,
  Download,
  Clock,
  User,
  Target,
  MessageSquare,
  Loader,
} from 'lucide-react';
import RippleGridV2 from '../../../components/RippleGrid/RippleGridV2';
import { GradingPermissions } from '../../../lib/grading/permissions';
import { GRADING_RUBRIC, FEEDBACK_TEMPLATES, SCORING_GUIDELINES } from '../../../lib/grading/config';
import { GradingApi } from '../../../lib/api/endpoints';
import { Submission } from '../../../lib/auth/types';

interface RubricScore {
  criterionId: string;
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}

export default function GradingDetailPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const submissionId = params?.submissionId as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Grading state
  const [rubricScores, setRubricScores] = useState<RubricScore[]>([]);
  const [feedback, setFeedback] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [status, setStatus] = useState<'approved' | 'rejected' | 'needs_revision'>('approved');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Permission check & load submission
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    const permission = GradingPermissions.canAccessGradingInterface(user);
    if (!permission.allowed) {
      router.replace('/');
      return;
    }

    const loadSubmission = async () => {
      try {
        setIsLoading(true);
        setError('');

        const sub = await GradingApi.getSubmission(submissionId);
        setSubmission(sub);

        // Initialize rubric scores
        const initialScores: RubricScore[] = GRADING_RUBRIC.map(criterion => ({
          criterionId: criterion.id,
          score: criterion.maxPoints * 0.8, // Default to 'good'
          level: 'good',
        }));
        setRubricScores(initialScores);
      } catch (err: any) {
        setError(err.message || 'Failed to load submission');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmission();
  }, [isAuthenticated, user, router, submissionId]);

  const handleRubricScoreChange = (criterionId: string, level: 'excellent' | 'good' | 'fair' | 'poor') => {
    const criterion = GRADING_RUBRIC.find(c => c.id === criterionId);
    if (!criterion) return;

    const score = criterion.maxPoints * criterion.weights[level];

    setRubricScores(prev =>
      prev.map(r =>
        r.criterionId === criterionId
          ? { ...r, score, level }
          : r
      )
    );
  };

  const handleAddTemplate = (templateId: string) => {
    const template = FEEDBACK_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setFeedback(prev => {
      const newFeedback = prev ? `${prev}\n\n${template.content}` : template.content;
      return newFeedback;
    });

    setSelectedTemplates(prev => [...new Set([...prev, templateId])]);
  };

  const handleRemoveTemplate = (templateId: string) => {
    setSelectedTemplates(prev => prev.filter(id => id !== templateId));
  };

  const calculateTotalPoints = (): number => {
    return Math.round(rubricScores.reduce((sum, score) => sum + score.score, 0));
  };

  const handleSubmitGrade = async () => {
    if (!submission || !feedback.trim()) {
      setError('Please provide feedback before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      setError('');

      const rubricScoresMap: Record<string, number> = {};
      rubricScores.forEach(score => {
        rubricScoresMap[score.criterionId] = score.score;
      });

      await GradingApi.submitGrade(submissionId, {
        status,
        pointsAwarded: calculateTotalPoints(),
        rubricScores: rubricScoresMap,
        feedback: feedback.trim(),
      });

      setSuccessMessage('Grade submitted successfully!');
      setTimeout(() => {
        router.push('/grading');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

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
      <div className="sticky top-0 layer-header header-surface z-40">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/grading')}
            className="matrix-button matrix-button-outline mb-4 flex items-center space-x-2"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-display font-bold text-matrix-glow">
            Grade Submission
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="layer-content container mx-auto px-4 py-6 max-w-6xl">
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 text-matrix">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Loading submission...</span>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="matrix-card bg-red-500/10 border-red-500/30 mb-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="matrix-card bg-green-500/10 border-green-500/30 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400">{successMessage}</p>
            </div>
          </div>
        )}

        {submission && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Submission Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Student Info */}
              <div className="matrix-card">
                <h2 className="text-lg font-bold text-bright mb-4 flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Student</span>
                </h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-dim">Name</p>
                    <p className="text-bright">{(submission as any).studentName || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-dim">Challenge</p>
                    <p className="text-bright">{(submission as any).challengeName || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-dim">Submitted</p>
                    <p className="text-bright flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Points */}
              <div className="matrix-card bg-matrix/5 border-matrix/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-dim mb-1">Total Points</p>
                    <p className="text-3xl font-bold text-matrix-glow">{calculateTotalPoints()}</p>
                    <p className="text-xs text-dim mt-1">/ 100</p>
                  </div>
                  <Target className="h-8 w-8 text-matrix-glow opacity-50" />
                </div>
              </div>

              {/* Status Selection */}
              <div className="matrix-card">
                <h3 className="text-sm font-bold text-bright mb-3">Grade Status</h3>
                <div className="space-y-2">
                  {['approved', 'rejected', 'needs_revision'].map(s => (
                    <label key={s} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={status === s}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm capitalize">{s.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Files */}
              {(submission as any).files && (submission as any).files.length > 0 && (
                <div className="matrix-card">
                  <h3 className="text-sm font-bold text-bright mb-3 flex items-center space-x-2">
                    <FileImage className="h-4 w-4" />
                    <span>Proof Files</span>
                  </h3>
                  <div className="space-y-2">
                    {(submission as any).files.map((file: any, idx: number) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded bg-matrix/5 border border-matrix/20 hover:border-matrix/50 transition-colors text-xs"
                      >
                        <span className="truncate text-bright">{file.name}</span>
                        <Download className="h-3 w-3 text-dim flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Grading Interface */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rubric Scoring */}
              <div className="matrix-card">
                <h2 className="text-lg font-bold text-bright mb-4 flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Rubric Scoring</span>
                </h2>

                <div className="space-y-6">
                  {GRADING_RUBRIC.map(criterion => {
                    const score = rubricScores.find(s => s.criterionId === criterion.id);
                    const guidelines = SCORING_GUIDELINES[criterion.id];

                    return (
                      <div key={criterion.id} className="p-4 bg-black/50 rounded border border-matrix/20">
                        <div className="mb-3">
                          <h4 className="font-bold text-bright">{criterion.name}</h4>
                          <p className="text-xs text-dim mt-1">{criterion.description}</p>
                          <p className="text-xs text-matrix mt-2">
                            {score?.score || 0} / {criterion.maxPoints} pts
                          </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {(['excellent', 'good', 'fair', 'poor'] as const).map(level => (
                            <button
                              key={level}
                              onClick={() => handleRubricScoreChange(criterion.id, level)}
                              className={`px-3 py-2 rounded text-xs font-semibold transition-all ${
                                score?.level === level
                                  ? 'bg-matrix text-black border border-matrix'
                                  : 'bg-matrix/10 text-bright border border-matrix/20 hover:border-matrix/50'
                              }`}
                              aria-pressed={score?.level === level}
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                              <div className="text-xs opacity-75 mt-0.5">
                                {criterion.maxPoints * criterion.weights[level]} pts
                              </div>
                            </button>
                          ))}
                        </div>

                        {guidelines && (
                          <div className="mt-3 p-2 bg-matrix/5 rounded text-xs text-dim border border-matrix/10">
                            <p className="font-mono">
                              {guidelines[score?.level || 'good']}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="matrix-card">
                <h2 className="text-lg font-bold text-bright mb-4 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Feedback</span>
                </h2>

                {/* Feedback Templates */}
                <div className="mb-4">
                  <p className="text-xs text-dim mb-2">Quick Templates:</p>
                  <div className="flex flex-wrap gap-2">
                    {FEEDBACK_TEMPLATES.slice(0, 8).map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleAddTemplate(template.id)}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          selectedTemplates.includes(template.id)
                            ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                            : 'bg-matrix/10 text-bright border border-matrix/20 hover:border-matrix/50'
                        }`}
                        title={template.title}
                      >
                        {template.shortcut || template.title.substring(0, 10)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Textarea */}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter detailed feedback for the student... (min 20 characters)"
                  className="w-full h-40 px-4 py-3 bg-black/50 border border-matrix/30 rounded text-bright placeholder-dim focus:border-matrix focus:outline-none focus:ring-2 focus:ring-matrix/20 resize-none"
                  aria-label="Feedback"
                  aria-invalid={feedback.trim().length < 20 && feedback.length > 0}
                />
                <p className="text-xs text-dim mt-2">
                  {feedback.length} characters | {Math.max(0, 20 - feedback.trim().length)} min required
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmitGrade}
                  disabled={isSubmitting || feedback.trim().length < 20}
                  className="flex-1 matrix-button matrix-button-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Submit Grade</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => router.push('/grading')}
                  disabled={isSubmitting}
                  className="matrix-button matrix-button-outline flex items-center space-x-2 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
