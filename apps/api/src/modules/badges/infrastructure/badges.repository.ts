import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';

@Injectable()
export class BadgesRepository {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement badge repository methods
}
