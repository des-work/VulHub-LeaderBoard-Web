'use client';

import React, { useState, useRef } from 'react';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Upload, X, File, Image, FileText, Trash2, Plus } from 'lucide-react';
import { Activity, FileUpload } from '../../lib/auth/types';

interface SubmissionFormProps {
  activities: Activity[];
  onSubmit: (submission: {
    activityId: string;
    activityName: string;
    description: string;
    files: FileUpload[];
  }) => void;
  onCancel: () => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  activities,
  onSubmit,
  onCancel,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setIsUploading(true);

    try {
      const newFiles: FileUpload[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Simulate file upload - in real app, upload to your backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const fileUpload: FileUpload = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('text/') ? 'text' : 'other',
          size: file.size,
          url: URL.createObjectURL(file), // In real app, this would be the uploaded file URL
          uploadedAt: new Date(),
        };
        
        newFiles.push(fileUpload);
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmit = () => {
    if (!selectedActivity || !description.trim() || files.length === 0) {
      return;
    }

    onSubmit({
      activityId: selectedActivity.id,
      activityName: selectedActivity.name,
      description: description.trim(),
      files,
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4 text-green-400" />;
      case 'text':
        return <FileText className="h-4 w-4 text-blue-400" />;
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

  const isFormValid = selectedActivity && description.trim() && files.length > 0;

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
        {/* Activity Selection */}
        <div>
          <label className="block text-sm font-mono text-green-300 mb-3">
            Select Completed Activity
          </label>
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
            Description of Your Solution
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe how you completed the challenge, what you learned, and any key insights..."
            className="w-full h-32 px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-mono text-green-300 mb-3">
            Upload Proof Files
          </label>
          
          <div
            className="border-2 border-dashed border-green-500/30 rounded-lg p-6 text-center hover:border-green-500/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 font-mono mb-2">
              Click to upload files or drag and drop
            </p>
            <p className="text-gray-400 font-mono text-sm">
              Screenshots, text files, or other proof (Max 10MB per file)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.txt,.md,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-green-400 font-mono text-sm font-bold">
                Uploaded Files ({files.length})
              </h4>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-green-400 font-mono text-sm">
                        {file.name}
                      </p>
                      <p className="text-gray-400 font-mono text-xs">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
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
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
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
            className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
          >
            Cancel
          </Button>
          <Button
            variant="matrix"
            onClick={handleSubmit}
            disabled={!isFormValid || isUploading}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Proof</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
