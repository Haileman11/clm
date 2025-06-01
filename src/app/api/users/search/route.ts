import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import { getKeyCloakAdminClient } from "@lib/keycloak";

// Initialize Keycloak admin client

// GET /api/users/search - Search Keycloak users
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Initialize Keycloak admin client

    const keycloakAdmin = await getKeyCloakAdminClient();
    // Search users in Keycloak
    const users = await keycloakAdmin.users.find({
      realm: process.env.KEYCLOAK_REALM || "",
      email,
      exact: false, // Allow partial matches
    });

    if (users.length === 0) {
      return NextResponse.json({ users: [] });
    }

    // Get user details including roles
    const userDetails = await Promise.all(
      users.map(async (user) => {
        try {
          const roles = await keycloakAdmin.users.listClientRoleMappings({
            id: user.id!,
            clientUniqueId: process.env.KEYCLOAK_CLIENT_ID || "",
          });

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            enabled: user.enabled,
            role: roles[0]?.name || null,
          };
        } catch (error) {
          console.error(`Error getting roles for user ${user.id}:`, error);
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            enabled: user.enabled,
            role: null,
          };
        }
      })
    );

    return NextResponse.json({ users: userDetails });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
