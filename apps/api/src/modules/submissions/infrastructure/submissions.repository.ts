import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';

@Injectable()
export class SubmissionsRepository {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement submission repository methods
}
