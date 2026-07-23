import { apiClient, unwrap } from '@/lib/api-client';
import type { CreateFamilyPayload, Family, UpdateFamilyPayload } from '../types/family.types';

/** All HTTP calls of the family feature - one place, fully typed. */
export const familyApi = {
  getMyFamily: (): Promise<Family> => unwrap(apiClient.get('/families/me')),

  createFamily: (payload: CreateFamilyPayload): Promise<Family> =>
    unwrap(apiClient.post('/families', payload)),

  updateFamily: (payload: UpdateFamilyPayload): Promise<Family> =>
    unwrap(apiClient.put('/families/me', payload)),
};
