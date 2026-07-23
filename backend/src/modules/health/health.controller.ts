import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Liveness/readiness endpoint for load balancers, uptime monitors and
 * container orchestrators. Reports overall status plus DB connectivity.
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Application and database health' })
  check(): Promise<HealthCheckResult> {
    return this.health.check([() => this.mongoose.pingCheck('mongodb')]);
  }
}
