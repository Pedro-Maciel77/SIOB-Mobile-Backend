export const OCCURRENCE_TYPES = [
  'acidente',
  'resgate',
  'incendio',
  'atropelamento',
  'outros'
] as const;

export const OCCURRENCE_STATUS = [
  'aberto',
  'em_andamento',
  'finalizado',
  'alerta'
] as const;

export const USER_ROLES = [
  'admin',
  'supervisor',
  'user',
  'operator'
] as const;

export const AUDIT_ACTIONS = [
  'login',
  'logout',
  'create',
  'update',
  'delete',
  'download'
] as const;

export const AUDIT_ENTITIES = [
  'user',
  'occurrence',
  'report',
  'vehicle'
] as const;

export type OccurrenceType = typeof OCCURRENCE_TYPES[number];
export type OccurrenceStatus = typeof OCCURRENCE_STATUS[number];
export type UserRole = typeof USER_ROLES[number];
export type AuditAction = typeof AUDIT_ACTIONS[number];
export type AuditEntity = typeof AUDIT_ENTITIES[number];