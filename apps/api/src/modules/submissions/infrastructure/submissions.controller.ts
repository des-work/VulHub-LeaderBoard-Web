import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmissionsService } from '../application/submissions.service';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // TODO: Implement submission endpoints
}
