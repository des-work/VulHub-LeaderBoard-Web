import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement project repository methods
}
