import { useSession } from "next-auth/react";
import { Action, hasPermission, hasAnyPermission, hasAllPermissions } from "@lib/permissions";

export function usePermissions() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return {
    can: (action: Action) => hasPermission(role, action),
    canAny: (actions: Action[]) => hasAnyPermission(role, actions),
    canAll: (actions: Action[]) => hasAllPermissions(role, actions),
    role,
  };
} 