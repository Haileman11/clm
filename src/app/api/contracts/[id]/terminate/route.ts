import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";
import { sendContractNotificationEmail } from "@lib/templates";

// POST /api/contracts/[id]/terminate - Terminate a contract
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the contract
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: {
        stakeholders: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Check if contract is in ACTIVE status
    if (contract.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Contract must be in ACTIVE status to terminate" },
        { status: 400 }
      );
    }

    // Update contract status to TERMINATED
    const updatedContract = await prisma.contract.update({
      where: { id: params.id },
      data: {
        status: "TERMINATED",
      },
    });
    sendContractNotificationEmail({
      emails: contract.stakeholders.map(
        (stakeholder) => stakeholder.user.email
      ),
      type: "termination",
      contractName: contract.name,
      contractId: contract.id,
      description: `This ${contract.contractType} was effective on ${contract.effectiveDate} and was due until ${contract.expirationDate}.`,
    });
    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error("Error terminating contract:", error);
    return NextResponse.json(
      { error: "Failed to terminate contract" },
      { status: 500 }
    );
  }
}
