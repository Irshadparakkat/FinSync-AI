/** Mirrors backend FamilyResponseDto / family DTOs. */

export type FamilyStatus = 'ACTIVE' | 'SUSPENDED';

export interface Family {
  id: string;
  familyName: string;
  familyCode: string;
  ownerId: string;
  currency: string;
  country: string;
  timezone: string;
  membersCount: number;
  status: FamilyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyPayload {
  familyName: string;
  currency: string;
  country: string;
  timezone: string;
}

export type UpdateFamilyPayload = Partial<CreateFamilyPayload>;
