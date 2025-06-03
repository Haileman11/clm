import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";
import { checkPermission } from "@lib/apiPermissions";
import { sendContractNotificationEmail } from "@lib/templates";
import { subDays, isToday, differenceInCalendarDays } from "date-fns";

// POST /api/contracts/auto-update - Activate and expire contracts
export async function GET(request: Request) {
  try {
    const reminderOffsets = [90, 60, 30, 15, 7];
    const today = new Date();

    for (const offset of reminderOffsets) {
      const targetDate = subDays(today, -offset);

      const contracts = await prisma.contract.findMany({
        where: {
          expirationDate: {
            gte: new Date(targetDate.setHours(0, 0, 0, 0)),
            lt: new Date(targetDate.setHours(23, 59, 59, 999)),
          },
        },
        include: {
          stakeholders: {
            include: { user: true },
          },
        },
      });

      for (const contract of contracts) {
        await sendContractNotificationEmail({
          type: "expiration",
          contractId: contract.id,
          contractName: contract.name,
          emails: contract.stakeholders.map(
            (stakeholder) => stakeholder.user.email
          ),
          expirationDate: contract.expirationDate,
          daysUntilExpiration: differenceInCalendarDays(
            contract.expirationDate,
            today
          ),
        });
      }
    }
    return NextResponse.json({ message: "Expiry eminder sent" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send expiry reminder" },
      { status: 500 }
    );
  }
}
