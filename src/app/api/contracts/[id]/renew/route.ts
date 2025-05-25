import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";
import { checkPermission } from "@lib/apiPermissions";

// POST /api/contracts/[id]/renew - Renew a contract
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to renew contracts
    const { authorized, response } = await checkPermission(request, {
      action: "contract:renew",
    });

    if (!authorized) {
      return response;
    }

    // Get the contract
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
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
        { error: "Contract must be in ACTIVE status to renew" },
        { status: 400 }
      );
    }

    // Get extension period from request body
    const body = await request.json();
    const extensionPeriod = body.extensionPeriod || 12; // Default to 12 months if not specified

    // Validate extension period
    if (extensionPeriod < 1 || extensionPeriod > 60) {
      return NextResponse.json(
        { error: "Extension period must be between 1 and 60 months" },
        { status: 400 }
      );
    }

    // Calculate new expiration date
    const currentExpiration = new Date(contract.expirationDate);
    const newExpiration = new Date(currentExpiration);
    newExpiration.setMonth(newExpiration.getMonth() + extensionPeriod);

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { keycloakId: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update contract with new expiration date and renewal info
    const updatedContract = await prisma.contract.update({
      where: { id: params.id },
      data: {
        expirationDate: newExpiration,
        status: "RENEWED",
        renewedDate: new Date(),
        renewedBy: {
          connect: { id: user.id }
        }
      },
    });

    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error("Error renewing contract:", error);
    return NextResponse.json(
      { error: "Failed to renew contract" },
      { status: 500 }
    );
  }
} 