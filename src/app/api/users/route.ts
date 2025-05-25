import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import { prisma } from "../../../lib/prisma";
import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

// Validate required environment variables
const requiredEnvVars = [
  "KEYCLOAK_BASE_URL",
  "KEYCLOAK_REALM",
  "KEYCLOAK_CLIENT_ID",
  "KEYCLOAK_CLIENT_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const keycloakAdmin = new KeycloakAdminClient({
  baseUrl: process.env.KEYCLOAK_BASE_URL,
  realmName: process.env.KEYCLOAK_REALM,
});

async function initKeycloak() {
  await keycloakAdmin.auth({
    grantType: "client_credentials",
    clientId: process.env.KEYCLOAK_CLIENT_ID!,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  });
}

// GET /api/users - Get all users
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const users = await prisma.user.findMany({
      where: role
        ? {
            role: role as any,
          }
        : undefined,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        department: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { keycloakId, email, firstName, lastName, department, role } = body;

    // Initialize Keycloak admin client
    await initKeycloak();

    // Create user in Keycloak
    // const keycloakUser = await keycloakAdmin.users.create({
    //   realm: process.env.KEYCLOAK_REALM!,
    //   username: email,
    //   email,
    //   firstName,
    //   lastName,
    //   enabled: true,
    // });

    // Assign role in Keycloak
    // await keycloakAdmin.users.addClientRoleMappings({
    //   id: keycloakId,
    //   clientUniqueId: process.env.KEYCLOAK_CLIENT_ID!,
    //   roles: [{ id: role, name: role }],
    // });

    // Store user in local database
    const user = await prisma.user.create({
      data: {
        keycloakId: keycloakId,
        email,
        firstName,
        lastName,
        department,
        role,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/:id - Update a user
// export async function PUT(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");
//     if (!id) {
//       return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//     }

//     const body = await request.json();
//     const { email, firstName, lastName, department, roleId } = body;

//     const user = await prisma.user.update({
//       where: { id },
//       data: {
//         email,
//         firstName,
//         lastName,
//         department,
//         roleId,
//       },
//       include: {
//         role: true,
//       },
//     });

//     return NextResponse.json(user);
//   } catch (error) {
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// DELETE /api/users/:id - Delete a user
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
