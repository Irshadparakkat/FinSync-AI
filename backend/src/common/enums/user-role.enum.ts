/**
 * Platform-wide RBAC roles. Cross-cutting (guards, schemas, DTOs across
 * modules consume it), hence lives in common rather than a feature module.
 */
export enum UserRole {
  /** Operates the SaaS platform itself. */
  SUPER_ADMIN = 'SUPER_ADMIN',
  /** Owns a family workspace (tenant); full control within it. */
  FAMILY_OWNER = 'FAMILY_OWNER',
  /** Belongs to a family workspace with contributor access. */
  FAMILY_MEMBER = 'FAMILY_MEMBER',
}
