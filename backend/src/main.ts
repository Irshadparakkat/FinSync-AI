import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { APP_CONFIG_KEY, AppConfig } from './config';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const { port, apiPrefix, corsOrigins, swaggerEnabled, env } =
    configService.getOrThrow<AppConfig>(APP_CONFIG_KEY);

  // Security headers
  app.use(helmet());

  // Only configured origins may call the API
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : false,
    credentials: true,
  });

  // /api/v1/... - versioned from day one so breaking changes never force clients
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Reject unknown properties, transform payloads into typed DTO instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Graceful shutdown (closes Mongo connections, drains requests)
  app.enableShutdownHooks();

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('FinSync AI API')
      .setDescription('Multi-tenant family finance SaaS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }

  await app.listen(port);
  logger.log(`Environment: ${env}`);
  logger.log(`API running at http://localhost:${port}/${apiPrefix}/v1`);
  if (swaggerEnabled) {
    logger.log(`Swagger docs at http://localhost:${port}/${apiPrefix}/docs`);
  }
}

void bootstrap();
