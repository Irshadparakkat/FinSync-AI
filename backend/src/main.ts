import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HTTP_BODY } from './common/constants/validation.constants';
import { APP_CONFIG_KEY, AppConfig } from './config';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  // Default body parser off so it can be re-registered with a raised limit
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const logger = new Logger('Bootstrap');

  // Base64 avatar payloads exceed the 100kb body-parser default
  app.useBodyParser('json', { limit: HTTP_BODY.JSON_LIMIT });
  app.useBodyParser('urlencoded', { extended: true, limit: HTTP_BODY.JSON_LIMIT });

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
