import { prisma } from "@lib/prisma";
import { ContractStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Get current date
    const now = new Date();

    // Calculate dates for different notification periods
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const oneDayFromNow = new Date(now);
    oneDayFromNow.setDate(now.getDate() + 1);

    // Find contracts that are expiring soon
    const expiringContracts = await prisma.contract.findMany({
      where: {
        status: ContractStatus.ACTIVE,
        expirationDate: {
          lte: thirtyDaysFromNow,
          gt: now,
        },
      },
      include: {
        stakeholders: {
          where: {
            role: {
              in: ["CONTRACT_MANAGER", "CONTRACT_OWNER"],
            },
          },
          select: {
            email: true,
            firstName: true,
            lastName: true,
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
