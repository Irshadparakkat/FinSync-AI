import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Gender } from '../../../common/enums/gender.enum';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Relationship } from '../enums/relationship.enum';

export type MemberDocument = HydratedDocument<Member>;

/**
 * A person in a Family Workspace. Tenant-scoped: familyId is required
 * and every query goes through the tenant-enforcing MembersRepository.
 * Age is deliberately NOT a field - only dateOfBirth is stored and age
 * is derived at read time (MemberResponseDto).
 */
@Schema({ timestamps: true, collection: 'members' })
export class Member {
  @Prop({ type: Types.ObjectId, ref: 'Family', required: true, index: true })
  familyId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: String, default: null, lowercase: true, trim: true })
  email!: string | null;

  @Prop({ type: String, default: null, trim: true })
  phone!: string | null;

  @Prop({ type: String, enum: Gender, required: true })
  gender!: Gender;

  @Prop({ type: String, enum: Relationship, required: true })
  relationship!: Relationship;

  @Prop({ type: Date, required: true })
  dateOfBirth!: Date;

  @Prop({ type: String, default: null, trim: true })
  occupation!: string | null;

  @Prop({ type: Number, default: 0, min: 0 })
  monthlyIncome!: number;

  /** https URL or base64 data URI (see VALIDATION.PROFILE_IMAGE_REGEX). */
  @Prop({ type: String, default: null })
  profileImage!: string | null;

  /** Family-scoped role; SUPER_ADMIN is a platform role, never a member role. */
  @Prop({
    type: String,
    enum: [UserRole.FAMILY_OWNER, UserRole.FAMILY_MEMBER],
    default: UserRole.FAMILY_MEMBER,
  })
  role!: UserRole;

  @Prop({ default: true })
  isActive!: boolean;

  // added by { timestamps: true }
  createdAt!: Date;
  updatedAt!: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

// List queries are always "this family's members, newest first".
MemberSchema.index({ familyId: 1, createdAt: -1 });
