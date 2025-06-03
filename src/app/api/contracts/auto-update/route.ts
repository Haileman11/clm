import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";
import { checkPermission } from "@lib/apiPermissions";
import { sendContractNotificationEmail } from "@lib/templates";
import { addDays } from "date-fns";

// POST /api/contracts/auto-update - Activate expire and deactivate contracts
export async function GET(request: Request) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const contractsToActivate = await prisma.contract.findMany({
      where: {
        status: "NEW",
        effectiveDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        vendor: true,
        stakeholders: {
          include: {
            user: true,
          },
        },
      },
    });
    console.log(contractsToActivate);
    for (const contract of contractsToActivate) {
      await prisma.contract.update({
        where: { id: contract.id },
        data: { status: "ACTIVE" },
      });
      // Send activation email
      sendContractNotificationEmail({
        emails: contract.stakeholders.map(
          (stakeholder) => stakeholder.user.email
        ),
        type: "activation",
        contractName: contract.name,
        contractId: contract.id,
        description: `This ${contract.contractType} becomes effective on ${contract.effectiveDate} and runs until ${contract.expirationDate}.`,
      });
    }

    const contractsToExpire = await prisma.contract.findMany({
      where: {
        status: "ACTIVE",
        expirationDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        vendor: true,
        stakeholders: {
          include: {
            user: true,
          },
        },
      },
    });
    console.log(contractsToExpire);
    for (const contract of contractsToExpire) {
      await prisma.contract.update({
        where: { id: contract.id },
        data: { status: "EXPIRED" },
      });
      // Send expiration email
      sendContractNotificationEmail({
        emails: contract.stakeholders.map(
          (stakeholder) => stakeholder.user.email
        ),
        type: "termination",
        contractName: contract.name,
        contractId: contract.id,
        description: `This ${contract.contractType} was effective on ${contract.effectiveDate} and was due until ${contract.expirationDate}.`,
      });
    }

    const contractsToDeactivate = await prisma.contract.findMany({
      where: {
        status: "EXPIRED",
        expirationDate: addDays(startOfToday, 30),
      },
      include: {
        vendor: true,
        stakeholders: {
          include: {
            user: true,
          },
        },
      },
    });
    console.log(contractsToDeactivate);
    // Deactivate contracts which have expired for thirty days
    for (const contract of contractsToDeactivate) {
      await prisma.contract.update({
        where: { id: contract.id },
        data: { status: "INACTIVE" },
      });
      // Send expiration email
      sendContractNotificationEmail({
        emails: contract.stakeholders.map(
          (stakeholder) => stakeholder.user.email
        ),
        type: "inactive",
        contractName: contract.name,
        contractId: contract.id,
        description: `This ${contract.contractType} was effective on ${contract.effectiveDate} and expired on ${contract.expirationDate}.`,
      });
    }
    return NextResponse.json({
      contractsToActivate,
      contractsToExpire,
      contractsToDeactivate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to auto update contracts" },
      { status: 500 }
    );
  }
}
