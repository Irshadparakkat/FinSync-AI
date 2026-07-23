import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { FamilyController } from './controllers/family.controller';
import { FamilyRepository } from './repository/family.repository';
import { Family, FamilySchema } from './schemas/family.schema';
import { FamilyService } from './services/family.service';

/**
 * The tenant module. Exports FamilyService so tenant-adjacent modules
 * (members, future financial modules) can maintain the denormalized
 * membersCount - the repository and schema stay module-private.
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Family.name, schema: FamilySchema }]), UsersModule],
  controllers: [FamilyController],
  providers: [FamilyRepository, FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
