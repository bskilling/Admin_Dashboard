// lib/constants.ts
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const PERMISSIONS = {
  DELETE: 'DELETE',
  CREATE_ADMIN: 'CREATE_ADMIN',
  MODIFY_SETTINGS: 'MODIFY_SETTINGS',
  VIEW_SENSITIVE: 'VIEW_SENSITIVE',
  // Add more as needed
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [PERMISSIONS.VIEW_SENSITIVE], // Example
  [ROLES.USER]: [], // No permissions
};
