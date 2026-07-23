import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilyModule } from '../family/family.module';
import { MembersController } from './controllers/members.controller';
import { MembersRepository } from './repository/members.repository';
import { Member, MemberSchema } from './schemas/member.schema';
import { MembersService } from './services/members.service';

/**
 * Member management inside a Family Workspace. Depends on FamilyModule
 * for the denormalized membersCount; exports nothing yet - future
 * modules read members through their own tenant-scoped queries.
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]), FamilyModule],
  controllers: [MembersController],
  providers: [MembersRepository, MembersService],
})
export class MembersModule {}
