import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  // TODO: Implement file storage service
  async uploadFile(file: any): Promise<string> {
    this.logger.log('Uploading file');
    return 'file-url';
  }
}
