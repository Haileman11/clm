import { prisma } from "@lib/prisma";
import { ContractStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const daysParam = url.searchParams.get("days");

    const days = parseInt(daysParam ?? "", 10);
    if (isNaN(days) || days <= 0) {
      return NextResponse.json("Invalid or missing 'days' query parameter", {
        status: 400,
      });
    }
    // Get current date
    const now = new Date();

    // Calculate dates for different notification periods
    const daysFromNow = new Date(now);
    daysFromNow.setDate(now.getDate() + days);

    // Find contracts that are expiring soon
    const expiringContracts = await prisma.contract.findMany({
      where: {
        status: ContractStatus.ACTIVE,
        expirationDate: {
          lte: daysFromNow,
          gt: now,
        },
        stakeholders: {
          some: {
            user: {
              role: {
                in: ["CONTRACT_MANAGER", "CONTRACT_OWNER"],
              },
            },
          },
        },
      },
      include: {
        stakeholders: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    console.log(`Found ${expiringContracts.length} expiring contracts`);
    return NextResponse.json(expiringContracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}
