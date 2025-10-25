import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';

@Injectable()
export class LeaderboardsRepository {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement leaderboard repository methods
}
