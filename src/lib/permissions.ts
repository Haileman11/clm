import { USER_ROLES } from "./types";

// Define all possible actions in the system
export type Action =
  | "contract:create"
  | "contract:edit"
  | "contract:delete"
  | "contract:view"
  | "contract:activate"
  | "contract:renew"
  | "contract:terminate"
  | "contract:request_review"
  | "contract:review"
  | "vendor:create"
  | "vendor:edit"
  | "vendor:delete"
  | "vendor:view"
  | "user:create"
  | "user:edit"
  | "user:delete"
  | "user:view";

// Define the permissions map for each role
export const ROLE_PERMISSIONS: Record<string, Action[]> = {
  CONTRACT_MANAGER: [
    "contract:create",
    "contract:edit",
    "contract:delete",
    "contract:view",
    "contract:activate",
    "contract:renew",
    "contract:terminate",
    "contract:request_review",
    "vendor:create",
    "vendor:edit",
    "vendor:delete",
    "vendor:view",
    "user:create",
    "user:edit",
    "user:delete",
    "user:view",
  ],
  CONTRACT_OWNER: [
    "contract:create",
    "contract:edit",
    "contract:view",
    "contract:request_review",
  ],
  LEGAL_TEAM: ["contract:view", "contract:review"],
  CATEGORY_SOURCING_MANAGER: ["contract:view", "contract:review"],
};

// Helper function to check if a role has a specific permission
export function hasPermission(
  role: string | undefined,
  action: Action
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(action) || false;
}

// Helper function to check if a role has any of the given permissions
export function hasAnyPermission(
  role: string | undefined,
  actions: Action[]
): boolean {
  if (!role) return false;
  return actions.some((action) => hasPermission(role, action));
}

// Helper function to check if a role has all of the given permissions
export function hasAllPermissions(
  role: string | undefined,
  actions: Action[]
): boolean {
  if (!role) return false;
  return actions.every((action) => hasPermission(role, action));
}

// Get all permissions for a role
export function getRolePermissions(role: string | undefined): Action[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] || [];
}
