import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BadgesService } from '../application/badges.service';

@ApiTags('badges')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  // TODO: Implement badge endpoints
}
