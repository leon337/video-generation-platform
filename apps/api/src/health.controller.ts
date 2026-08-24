import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      service: 'video-generation-api',
      phase: 'I0_FOUNDATION',
      realProvidersEnabled: false,
    } as const;
  }
}
