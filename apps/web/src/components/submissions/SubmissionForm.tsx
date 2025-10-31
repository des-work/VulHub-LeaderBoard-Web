'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Upload, X, File, Image, FileText, Trash2, Plus, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Activity, FileUpload } from '../../lib/auth/types';
import { FileUploadService, UploadProgress } from '../../lib/api/upload';
import { SubmissionValidators } from '../../lib/submissions/validators';
import { SubmissionApi } from '../../lib/api/endpoints';

interface SubmissionFormProps {
  activities: Activity[];
  onSubmit: (submission: {
    activityId: string;
    activityName: string;
    description: string;
    files: FileUpload[];
  }) => void;
  onCancel: () => void;
  userSubmissions?: Array<{ challengeId: string; submittedAt: Date }>;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadedAt: Date;
  progress?: UploadProgress;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  activities,
  onSubmit,
  onCancel,
  userSubmissions = [],
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear messages on changes
  useEffect(() => {
    setSuccessMessage('');
  }, [description, selectedActivity, uploadedFiles]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const files = Array.from(selectedFiles);
    setIsUploading(true);
    setUploadErrors({});

    try {
      // Validate files before upload
      const validationErrors: Record<string, string> = {};
      const filesToUpload: File[] = [];

      for (const file of files) {
        const error = FileUploadService.validateFile(file);
        if (error) {
          validationErrors[file.name] = error.message;
        } else {
          filesToUpload.push(file);
        }
      }

      if (Object.keys(validationErrors).length > 0) {
        setUploadErrors(validationErrors);
      }

      // Check if adding these files would exceed the max
      if (uploadedFiles.length + filesToUpload.length > 10) {
        setUploadErrors({
          general: `You can upload a maximum of 10 files. You have ${uploadedFiles.length} files already.`,
        });
        return;
      }

      // Upload valid files
      for (const file of filesToUpload) {
        const uploadedFile: UploadedFile = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'other',
          size: file.size,
          uploadedAt: new Date(),
          progress: {
            fileName: file.name,
            uploadedBytes: 0,
            totalBytes: file.size,
            percentComplete: 0,
            status: 'pending',
            retryCount: 0,
          },
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);

        try {
          // Upload file with progress tracking
          const response = await FileUploadService.uploadFile(file, (progress) => {
            setUploadedFiles(prev =>
              prev.map(f =>
                f.id === uploadedFile.id ? { ...f, progress } : f
              )
            );
          });

          // Update file with upload response
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === uploadedFile.id
                ? {
                    ...f,
                    url: response.fileUrl,
                    progress: { 
                      fileName: f.name,
                      uploadedBytes: f.size,
                      totalBytes: f.size,
                      percentComplete: 100,
                      status: 'completed' as const,
                      retryCount: 0,
                    },
                  }
                : f
            )
          );
        } catch (error: any) {
          setUploadErrors(prev => ({
            ...prev,
            [file.name]: error.message,
          }));

          // Mark as failed
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === uploadedFile.id
                ? {
                    ...f,
                    progress: { 
                      fileName: f.name,
                      uploadedBytes: 0,
                      totalBytes: f.size,
                      percentComplete: 0,
                      status: 'failed' as const,
                      error: error.message,
                      retryCount: 0,
                    },
                  }
                : f
            )
          );
        }
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadErrors(prev => {
      const { [fileId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async () => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    // Validate challenge selection
    if (!selectedActivity) {
      newErrors.activity = 'Please select an activity';
    }

    // Validate description
    const descriptionError = SubmissionValidators.validateDescription(description);
    if (descriptionError) {
      newErrors.description = descriptionError.message;
    }

    // Validate files
    const successfulFiles = uploadedFiles.filter(f => f.progress?.status === 'completed');
    const fileError = SubmissionValidators.validateFileCount(successfulFiles.length);
    if (fileError) {
      newErrors.files = fileError.message;
    }

    // Check for duplicate submission
    if (selectedActivity && userSubmissions) {
      const duplicateError = SubmissionValidators.checkDuplicateSubmission(
        selectedActivity.id,
        userSubmissions
      );
      if (duplicateError) {
        newErrors.duplicate = duplicateError.message;
      }
    }

    // Check daily rate limit
    if (userSubmissions) {
      const rateLimitError = SubmissionValidators.checkDailyRateLimit(userSubmissions);
      if (rateLimitError) {
        newErrors.rateLimit = rateLimitError.message;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create submission via API
      const fileUrls = successfulFiles.map(f => f.url).filter(Boolean) as string[];
      
      const submissionPayload = {
        challengeId: selectedActivity!.id,
        description: description.trim(),
        fileUrl: fileUrls.length > 0 ? fileUrls[0] : undefined,
        screenshotUrl: fileUrls.length > 1 ? fileUrls[1] : undefined,
      };

      await SubmissionApi.createSubmission(submissionPayload);

      setSuccessMessage('Submission created successfully!');
      
      // Call parent callback
      onSubmit({
        activityId: selectedActivity!.id,
        activityName: selectedActivity!.name,
        description: description.trim(),
        files: successfulFiles
          .filter(f => f.url) // Only include files with URLs
          .map(f => ({
            id: f.id,
            name: f.name,
            type: f.type as 'image' | 'text' | 'other',
            size: f.size,
            url: f.url!,
            uploadedAt: f.uploadedAt,
          })),
      });

      // Reset form
      setSelectedActivity(null);
      setDescription('');
      setUploadedFiles([]);
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Failed to submit. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4 text-blue-400" />;
      case 'video':
        return <FileText className="h-4 w-4 text-purple-400" />;
      default:
        return <File className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalUploadSize = uploadedFiles.reduce((sum, f) => sum + f.size, 0);
  const successfulFiles = uploadedFiles.filter(f => f.progress?.status === 'completed');
  const isFormValid = selectedActivity && description.trim() && successfulFiles.length > 0;

  return (
    <Card variant="matrix" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-mono text-green-400 flex items-center">
          <Upload className="h-6 w-6 mr-3" />
          Submit Challenge Proof
        </CardTitle>
        <p className="text-gray-400 font-mono text-sm">
          Upload evidence of your completed challenge to earn points
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <p className="text-green-400 font-mono text-sm">{successMessage}</p>
          </div>
        )}

        {/* General Errors */}
        {errors.submit && (
          <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 font-mono text-sm">{errors.submit}</p>
          </div>
        )}

        {errors.rateLimit && (
          <div className="flex items-center space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-400 font-mono text-sm">{errors.rateLimit}</p>
          </div>
        )}

        {errors.duplicate && (
          <div className="flex items-center space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-400 font-mono text-sm">{errors.duplicate}</p>
          </div>
        )}

        {/* Activity Selection */}
        <div>
          <label className="block text-sm font-mono text-green-300 mb-3">
            Select Completed Activity *
          </label>
          {errors.activity && (
            <p className="text-red-400 font-mono text-xs mb-2">{errors.activity}</p>
          )}
          <div className="grid gap-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedActivity?.id === activity.id
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-600 hover:border-green-500/50'
                }`}
                onClick={() => setSelectedActivity(activity)}
                role="radio"
                aria-checked={selectedActivity?.id === activity.id}
                aria-label={activity.name}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedActivity(activity);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-green-400 font-mono font-bold">
                      {activity.name}
                    </h3>
                    <p className="text-gray-300 font-mono text-sm mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-yellow-400 font-mono text-sm">
                        {activity.points} points
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        activity.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        activity.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {activity.difficulty}
                      </span>
                    </div>
                  </div>
                  {selectedActivity?.id === activity.id && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-mono text-green-300 mb-2">
            Description of Your Solution * <span className="text-gray-400">({description.length}/5000)</span>
          </label>
          {errors.description && (
            <p className="text-red-400 font-mono text-xs mb-2">{errors.description}</p>
          )}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe how you completed the challenge, what you learned, and any key insights (min 10 chars)..."
            className="w-full h-32 px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 resize-none"
            aria-label="Submission description"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-mono text-green-300 mb-3">
            Upload Proof Files * ({uploadedFiles.length}/10 files, {formatFileSize(totalUploadSize)}/50MB)
          </label>
          
          {errors.files && (
            <p className="text-red-400 font-mono text-xs mb-2">{errors.files}</p>
          )}

          {Object.entries(uploadErrors).map(([key, error]) => (
            <div key={key} className="flex items-center space-x-2 p-2 mb-2 bg-red-500/10 border border-red-500/30 rounded">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 font-mono text-xs">{error}</p>
            </div>
          ))}

          <div
            className="border-2 border-dashed border-green-500/30 rounded-lg p-6 text-center hover:border-green-500/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload files"
          >
            <Upload className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 font-mono mb-2">
              Click to upload files or drag and drop
            </p>
            <p className="text-gray-400 font-mono text-sm">
              Images, videos, PDFs, or text files (Max 10MB per file, 50MB total)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.txt,.md"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              aria-label="File input"
            />
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-green-400 font-mono text-sm font-bold">
                Uploaded Files ({successfulFiles.length}/{uploadedFiles.length})
              </h4>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-green-400 font-mono text-sm truncate">
                        {file.name}
                      </p>
                      <p className="text-gray-400 font-mono text-xs">
                        {formatFileSize(file.size)}
                      </p>
                      {file.progress && (
                        <>
                          {file.progress.status === 'uploading' && (
                            <div className="mt-1">
                              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-400 transition-all duration-300"
                                  style={{ width: `${file.progress.percentComplete}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {Math.round(file.progress.percentComplete)}%
                              </p>
                            </div>
                          )}
                          {file.progress.status === 'completed' && (
                            <div className="flex items-center space-x-1 mt-1">
                              <CheckCircle className="h-3 w-3 text-green-400" />
                              <p className="text-xs text-green-400">Uploaded</p>
                            </div>
                          )}
                          {file.progress.status === 'failed' && (
                            <div className="flex items-center space-x-1 mt-1">
                              <AlertCircle className="h-3 w-3 text-red-400" />
                              <p className="text-xs text-red-400">{file.progress.error}</p>
                            </div>
                          )}
                          {file.progress.retryCount > 0 && (
                            <p className="text-xs text-yellow-400 mt-0.5">
                              Retry: {file.progress.retryCount}/{3}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    disabled={file.progress?.status === 'uploading'}
                    className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2 flex-shrink-0"
                    aria-label={`Remove file ${file.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-green-400 font-mono text-sm">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Uploading files...</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-green-500/30">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
            className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
            aria-label="Cancel submission"
          >
            Cancel
          </Button>
          <Button
            variant="matrix"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting || isUploading}
            className="flex items-center space-x-2"
            aria-label="Submit proof"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Submit Proof</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
