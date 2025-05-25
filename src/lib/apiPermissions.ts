import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { Action, hasPermission, hasAnyPermission, hasAllPermissions } from "./permissions";
import authOptions from "@app/api/auth/[...nextauth]/options";

interface CheckPermissionOptions {
  action: Action | Action[];
  requireAll?: boolean;
  redirectTo?: string;
}

export async function checkPermission(
  request: Request,
  options: CheckPermissionOptions
): Promise<{ authorized: boolean; response?: NextResponse }> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = session.user?.role;
  const { action, requireAll = false } = options;

  const hasAccess = Array.isArray(action)
    ? requireAll
      ? hasAllPermissions(role, action)
      : hasAnyPermission(role, action)
    : hasPermission(role, action);

  if (!hasAccess) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { authorized: true };
} 