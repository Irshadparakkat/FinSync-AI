/** Service-layer input for workspace creation (post-DTO, pre-persistence). */
export interface CreateFamilyData {
  familyName: string;
  currency: string;
  country: string;
  timezone: string;
}
