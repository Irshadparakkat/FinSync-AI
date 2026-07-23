import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FAMILY } from '../constants/family.constants';
import { FamilyStatus } from '../enums/family-status.enum';

export type FamilyDocument = HydratedDocument<Family>;

/**
 * The TENANT. Every financial record in the platform belongs to exactly
 * one Family; all tenant-scoped queries filter on this document's id.
 */
@Schema({ timestamps: true, collection: 'families' })
export class Family {
  @Prop({ required: true, trim: true, maxlength: FAMILY.NAME_MAX_LENGTH })
  familyName!: string;

  /** Human-friendly unique code (FAM-XXXXXX) - used for future invitations. */
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  familyCode!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId!: Types.ObjectId;

  /** ISO 4217 currency code - the workspace's reporting currency. */
  @Prop({ required: true, uppercase: true, trim: true, default: FAMILY.DEFAULT_CURRENCY })
  currency!: string;

  /** ISO 3166-1 alpha-2 country code. */
  @Prop({ required: true, uppercase: true, trim: true })
  country!: string;

  /** IANA timezone identifier (e.g. Asia/Dubai). */
  @Prop({ required: true, trim: true })
  timezone!: string;

  /** Denormalized count of member profiles; maintained by MembersService. */
  @Prop({ default: 0, min: 0 })
  membersCount!: number;

  @Prop({ type: String, enum: FamilyStatus, default: FamilyStatus.ACTIVE, index: true })
  status!: FamilyStatus;

  // added by { timestamps: true }
  createdAt!: Date;
  updatedAt!: Date;
}

export const FamilySchema = SchemaFactory.createForClass(Family);
