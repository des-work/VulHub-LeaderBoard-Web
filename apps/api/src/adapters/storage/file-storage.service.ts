import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface FileUploadResult {
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt: Date;
}

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly uploadDir = path.join(process.cwd(), '../web/public/uploads');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
  ];

  constructor() {
    this.ensureUploadDirectories();
  }

  /**
   * Ensure all upload directories exist
   */
  private ensureUploadDirectories(): void {
    const dirs = [
      this.uploadDir,
      path.join(this.uploadDir, 'submissions'),
      path.join(this.uploadDir, 'submissions/evidence'),
      path.join(this.uploadDir, 'avatars'),
      path.join(this.uploadDir, 'projects'),
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created directory: ${dir}`);
      }
    }
  }

  /**
   * Upload submission evidence files
   */
  async uploadSubmissionEvidence(
    userId: string,
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    this.validateFile(file);

    const filename = this.generateFilename(userId, projectId, file.originalname);
    const filepath = path.join(this.uploadDir, 'submissions/evidence', filename);

    try {
      fs.writeFileSync(filepath, file.buffer);
      this.logger.log(`Uploaded evidence file: ${filename}`);

      return {
        filename,
        path: `/uploads/submissions/evidence/${filename}`,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw new BadRequestException('Failed to upload file');
    }
  }

  /**
   * Upload multiple evidence files
   */
  async uploadMultipleEvidence(
    userId: string,
    projectId: string,
    files: Express.Multer.File[],
  ): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];

    for (const file of files) {
      const result = await this.uploadSubmissionEvidence(userId, projectId, file);
      results.push(result);
    }

    return results;
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<FileUploadResult> {
    this.validateFile(file);

    const filename = `${userId}${path.extname(file.originalname)}`;
    const filepath = path.join(this.uploadDir, 'avatars', filename);

    try {
      // Delete old avatar if exists
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      fs.writeFileSync(filepath, file.buffer);
      this.logger.log(`Uploaded avatar for user: ${userId}`);

      return {
        filename,
        path: `/uploads/avatars/${filename}`,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to upload avatar: ${error.message}`);
      throw new BadRequestException('Failed to upload avatar');
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(relativePath: string): Promise<void> {
    try {
      // Prevent directory traversal attacks
      if (relativePath.includes('..')) {
        throw new BadRequestException('Invalid file path');
      }

      const filepath = path.join(this.uploadDir, relativePath);
      
      // Ensure the file is within the upload directory
      if (!filepath.startsWith(this.uploadDir)) {
        throw new BadRequestException('Invalid file path');
      }

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        this.logger.log(`Deleted file: ${relativePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(relativePath: string): Promise<FileUploadResult | null> {
    try {
      if (relativePath.includes('..')) {
        throw new BadRequestException('Invalid file path');
      }

      const filepath = path.join(this.uploadDir, relativePath);

      if (!filepath.startsWith(this.uploadDir)) {
        throw new BadRequestException('Invalid file path');
      }

      if (!fs.existsSync(filepath)) {
        return null;
      }

      const stats = fs.statSync(filepath);
      return {
        filename: path.basename(filepath),
        path: `/uploads/${relativePath}`,
        size: stats.size,
        mimetype: this.getMimeType(filepath),
        uploadedAt: stats.birthtime,
      };
    } catch (error) {
      this.logger.error(`Failed to get file info: ${error.message}`);
      return null;
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`);
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} not allowed`);
    }

    if (!file.originalname) {
      throw new BadRequestException('Invalid filename');
    }
  }

  /**
   * Generate unique filename
   */
  private generateFilename(userId: string, projectId: string, originalname: string): string {
    const timestamp = Date.now();
    const hash = crypto.randomBytes(4).toString('hex');
    const ext = path.extname(originalname);
    return `${userId}_${projectId}_${timestamp}_${hash}${ext}`;
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(filepath: string): string {
    const ext = path.extname(filepath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Clean up old files (called periodically)
   */
  async cleanupOldFiles(maxAgeInDays: number = 30): Promise<number> {
    let deletedCount = 0;
    const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    try {
      const subdirs = ['submissions/evidence', 'avatars', 'projects'];

      for (const subdir of subdirs) {
        const dirPath = path.join(this.uploadDir, subdir);
        if (!fs.existsSync(dirPath)) continue;

        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          const filepath = path.join(dirPath, file);
          const stats = fs.statSync(filepath);
          const fileAge = now - stats.mtimeMs;

          if (fileAge > maxAge) {
            fs.unlinkSync(filepath);
            deletedCount++;
            this.logger.log(`Cleaned up old file: ${file}`);
          }
        }
      }

      this.logger.log(`Cleaned up ${deletedCount} old files`);
      return deletedCount;
    } catch (error) {
      this.logger.error(`Failed to cleanup old files: ${error.message}`);
      return 0;
    }
  }
}
