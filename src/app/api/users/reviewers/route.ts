import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";
import { UserRole } from "@prisma/client";

// GET /api/users/reviewers - Get all potential reviewers
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Define role filters based on review type
    const roleFilters = {
      LEGAL: ["LEGAL_TEAM"],
      CATEGORY_SOURCING: ["CATEGORY_SOURCING_MANAGER"],
    };

    const users = await prisma.user.findMany({
      where: {
        role: {
          in: type
            ? (roleFilters[type as keyof typeof roleFilters] as UserRole[])
            : undefined,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching reviewers:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviewers" },
      { status: 500 }
    );
  }
}
