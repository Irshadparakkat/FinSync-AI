import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Gender } from '../../../common/enums/gender.enum';
import { UserRole } from '../../../common/enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

/**
 * Identity record. Sensitive fields (passwordHash, refreshTokenHash) are
 * `select: false` so they can never leak through a default query - code
 * must opt in explicitly (+field) to read them.
 */
@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  /** Platform role. Members created via invitation get FAMILY_MEMBER. */
  @Prop({ type: String, enum: UserRole, default: UserRole.FAMILY_OWNER, index: true })
  role!: UserRole;

  /**
   * Tenant reference. Null until the user creates or joins a Family
   * Workspace (Family module). Indexed - every tenant-scoped lookup
   * filters on it.
   */
  @Prop({ type: Types.ObjectId, ref: 'Family', default: null, index: true })
  familyId!: Types.ObjectId | null;

  @Prop({ default: true })
  isActive!: boolean;

  // ---- Profile (all optional; editable via PATCH /users/me) ----------------

  @Prop({ type: String, default: null, trim: true })
  phone!: string | null;

  @Prop({ type: String, enum: Gender, default: null })
  gender!: Gender | null;

  /** Age is NEVER stored - derived from dateOfBirth at read time. */
  @Prop({ type: Date, default: null })
  dateOfBirth!: Date | null;

  /** https URL or base64 data URI (see VALIDATION.PROFILE_IMAGE_REGEX). */
  @Prop({ type: String, default: null })
  profileImage!: string | null;

  /** ISO 3166-1 alpha-2 country code. */
  @Prop({ type: String, default: null, uppercase: true, trim: true })
  country!: string | null;

  /** IANA timezone identifier (e.g. Asia/Dubai). */
  @Prop({ type: String, default: null, trim: true })
  timezone!: string | null;

  /** bcrypt hash of the current refresh token; null when logged out. */
  @Prop({ type: String, default: null, select: false })
  refreshTokenHash!: string | null;

  // added by { timestamps: true }
  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
