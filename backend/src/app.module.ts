import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { appConfig, databaseConfig, jwtConfig, validateEnv } from './config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { FamilyModule } from './modules/family/family.module';
import { HealthModule } from './modules/health/health.module';
import { MembersModule } from './modules/members/members.module';
import { UsersModule } from './modules/users/users.module';

/**
 * Composition root. Cross-cutting providers (error filter, envelope +
 * logging interceptors) are registered globally here via DI tokens -
 * feature modules stay pure domain logic.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validate: validateEnv,
    }),
    DatabaseModule,
    HealthModule,
    UsersModule,
    AuthModule,
    FamilyModule,
    MembersModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    // Secure by default: every route requires auth unless marked @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Runs after JwtAuthGuard; enforces @Roles() metadata (403 on mismatch)
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
