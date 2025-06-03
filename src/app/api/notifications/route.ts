import { prisma } from "@lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "../auth/[...nextauth]/options";

// GET /api/notifications - Get notifications
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { keycloakId: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userEmail = user.email; // or extract from auth/session

    const notifications = await prisma.notification.findMany({
      where: { userEmail },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
