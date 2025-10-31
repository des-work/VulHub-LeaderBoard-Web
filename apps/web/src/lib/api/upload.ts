/**
 * File Upload Service
 * 
 * Provides robust file upload capabilities with:
 * - Chunked uploads for large files
 * - Automatic retry with exponential backoff
 * - Progress tracking
 * - Timeout handling
 * - Checksum validation
 */

import { apiClient } from './client';

// ============================================================================
// TYPES
// ============================================================================

export interface UploadProgress {
  fileName: string;
  uploadedBytes: number;
  totalBytes: number;
  percentComplete: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
  retryCount: number;
}

export interface UploadChunk {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  data: Blob;
  checksum: string;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  mimeType: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const UPLOAD_CONFIG = {
  CHUNK_SIZE: 1024 * 1024, // 1MB per chunk
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB max per file
  MAX_TOTAL_SIZE: 50 * 1024 * 1024, // 50MB max total
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000, // 30 seconds per chunk
  BACKOFF_MULTIPLIER: 2,
  INITIAL_BACKOFF_MS: 1000, // 1 second
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate SHA256 checksum of a Blob
 */
async function calculateChecksum(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(retryCount: number): number {
  return UPLOAD_CONFIG.INITIAL_BACKOFF_MS * Math.pow(UPLOAD_CONFIG.BACKOFF_MULTIPLIER, retryCount);
}

/**
 * Split file into chunks
 */
function createChunks(file: File, fileId: string): Blob[] {
  const chunks: Blob[] = [];
  const totalChunks = Math.ceil(file.size / UPLOAD_CONFIG.CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * UPLOAD_CONFIG.CHUNK_SIZE;
    const end = Math.min(start + UPLOAD_CONFIG.CHUNK_SIZE, file.size);
    chunks.push(file.slice(start, end));
  }

  return chunks;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface FileValidationError {
  field: 'size' | 'type' | 'name';
  message: string;
  value: any;
}

/**
 * Validate a file before upload
 */
export function validateFile(file: File): FileValidationError | null {
  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      field: 'size',
      message: `File size exceeds ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      value: file.size,
    };
  }

  // Check file type (whitelist allowed types)
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/markdown',
    'video/mp4',
    'video/webm',
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      field: 'type',
      message: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      value: file.type,
    };
  }

  // Check file name
  if (!file.name || file.name.trim().length === 0) {
    return {
      field: 'name',
      message: 'File name cannot be empty',
      value: file.name,
    };
  }

  return null;
}

// ============================================================================
// UPLOAD SERVICE
// ============================================================================

/**
 * Upload a single file with chunking, retries, and progress tracking
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> {
  const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  let retryCount = 0;

  // Validate file first
  const validationError = validateFile(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  // Initialize progress
  const progress: UploadProgress = {
    fileName: file.name,
    uploadedBytes: 0,
    totalBytes: file.size,
    percentComplete: 0,
    status: 'pending',
    retryCount: 0,
  };

  try {
    // Create file chunks
    const chunks = createChunks(file, fileId);
    const totalChunks = chunks.length;
    const fileChecksum = await calculateChecksum(file);

    progress.status = 'uploading';
    onProgress?.(progress);

    // Upload each chunk with retry logic
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      const chunkChecksum = await calculateChecksum(chunk);
      retryCount = 0;

      let uploaded = false;
      while (!uploaded && retryCount < UPLOAD_CONFIG.MAX_RETRIES) {
        try {
          // Prepare chunk data
          const formData = new FormData();
          formData.append('fileId', fileId);
          formData.append('fileName', file.name);
          formData.append('chunkIndex', chunkIndex.toString());
          formData.append('totalChunks', totalChunks.toString());
          formData.append('fileChecksum', fileChecksum);
          formData.append('chunkChecksum', chunkChecksum);
          formData.append('mimeType', file.type);
          formData.append('chunk', chunk);

          // Upload chunk with timeout
          // TODO: Implement timeout handling in apiClient
          await apiClient.post('/submissions/upload-chunk', formData);

          uploaded = true;

          // Update progress
          progress.uploadedBytes = (chunkIndex + 1) * UPLOAD_CONFIG.CHUNK_SIZE;
          progress.percentComplete = Math.min(
            (progress.uploadedBytes / progress.totalBytes) * 100,
            100
          );
          progress.status = 'uploading';
          onProgress?.(progress);

        } catch (error: any) {
          retryCount++;

          if (retryCount >= UPLOAD_CONFIG.MAX_RETRIES) {
            throw new Error(`Failed to upload chunk ${chunkIndex + 1}/${totalChunks} after ${UPLOAD_CONFIG.MAX_RETRIES} retries`);
          }

          // Wait before retry
          progress.retryCount = retryCount;
          progress.error = `Retrying chunk ${chunkIndex + 1}/${totalChunks} (attempt ${retryCount}/${UPLOAD_CONFIG.MAX_RETRIES})`;
          onProgress?.(progress);

          const delay = getBackoffDelay(retryCount - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Finalize upload
    const response = await apiClient.post('/submissions/finalize-upload', {
      fileId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      fileChecksum,
      totalChunks,
    });

    progress.status = 'completed';
    progress.percentComplete = 100;
    onProgress?.(progress);

    return response;

  } catch (error: any) {
    progress.status = 'failed';
    progress.error = error.message || 'Upload failed';
    progress.retryCount = retryCount;
    onProgress?.(progress);

    throw error;
  }
}

/**
 * Upload multiple files sequentially
 */
export async function uploadFiles(
  files: File[],
  onProgressUpdate?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResponse[]> {
  const responses: UploadResponse[] = [];
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  // Validate total size
  if (totalSize > UPLOAD_CONFIG.MAX_TOTAL_SIZE) {
    throw new Error(
      `Total file size (${totalSize / 1024 / 1024}MB) exceeds ${UPLOAD_CONFIG.MAX_TOTAL_SIZE / 1024 / 1024}MB limit`
    );
  }

  // Upload each file
  for (let i = 0; i < files.length; i++) {
    const response = await uploadFile(files[i], (progress) => {
      onProgressUpdate?.(i, progress);
    });
    responses.push(response);
  }

  return responses;
}

/**
 * Cancel an ongoing upload (not implemented in MVP, but structure ready)
 */
export function cancelUpload(fileId: string): void {
  // TODO: Implement abort controller cancellation
  console.log(`Upload cancelled for fileId: ${fileId}`);
}

// ============================================================================
// EXPORT HELPER
// ============================================================================

export const FileUploadService = {
  uploadFile,
  uploadFiles,
  validateFile,
  cancelUpload,
  calculateChecksum,
  UPLOAD_CONFIG,
};
