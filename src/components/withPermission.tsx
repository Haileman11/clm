import { usePermissions } from "@hooks/usePermissions";
import { Action } from "@lib/permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface WithPermissionProps {
  action: Action | Action[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function WithPermission({
  action,
  requireAll = false,
  children,
  fallback = null,
}: WithPermissionProps) {
  const { can, canAny, canAll } = usePermissions();
  const router = useRouter();

  const hasAccess = Array.isArray(action)
    ? requireAll
      ? canAll(action)
      : canAny(action)
    : can(action);

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
} 