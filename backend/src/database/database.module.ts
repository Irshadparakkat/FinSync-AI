import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONFIG_KEY, DatabaseConfig } from '../config';

/**
 * Central Mongoose connection, configured asynchronously from validated
 * config. Feature modules register their own schemas via
 * MongooseModule.forFeature() - they never touch connection details.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.getOrThrow<DatabaseConfig>(DATABASE_CONFIG_KEY);
        return { uri: dbConfig.uri };
      },
    }),
  ],
})
export class DatabaseModule {}
