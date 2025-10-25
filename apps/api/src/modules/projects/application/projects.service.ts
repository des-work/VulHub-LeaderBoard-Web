import { Injectable, Logger } from '@nestjs/common';
import { ProjectsRepository } from '../infrastructure/projects.repository';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private projectsRepository: ProjectsRepository) {}

  // TODO: Implement project business logic
  async findAll() {
    this.logger.log('Getting all projects');
    return [];
  }
}
