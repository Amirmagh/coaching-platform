/**
 * Admin role/permission helpers used by the AdminRoute guard and admin pages.
 * Roles mirror the backend `User.Role` choices.
 */

export const ADMIN_ROLES = ['admin', 'moderator'];

// Returns true when the given user object has an admin or moderator role.
export const isAdmin = (user) =>
  Boolean(user) && (user.is_superuser || ADMIN_ROLES.includes(user.role));

// Returns true when the user has one of the required roles (defaults to any admin role).
export const hasPermission = (user, requiredRoles = ADMIN_ROLES) =>
  Boolean(user) && (user.is_superuser || requiredRoles.includes(user.role));

// Decides where a user should be redirected when they lack admin access.
export const getAdminRedirectPath = (user) => (user ? '/' : '/login');

export default { isAdmin, hasPermission, getAdminRedirectPath, ADMIN_ROLES };
