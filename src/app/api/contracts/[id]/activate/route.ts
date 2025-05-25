import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";
import { checkPermission } from "@lib/apiPermissions";

// POST /api/contracts/[id]/activate - Activate a contract
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Check if user has permission to activate contracts
    const { authorized, response } = await checkPermission(request, {
      action: "contract:activate",
    });

    if (!authorized) {
      return response;
    }

    // Get the contract
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: {
        reviews: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Check if contract is in REVIEWED status
    if (contract.status !== "REVIEWED") {
      return NextResponse.json(
        { error: "Contract must be in REVIEWED status to activate" },
        { status: 400 }
      );
    }

    // Check if all reviews are approved
    const allApproved = contract.reviews.every((review:any) => review.status === "APPROVED");
    if (!allApproved) {
      return NextResponse.json(
        { error: "All reviews must be approved to activate contract" },
        { status: 400 }
      );
    }

    // Update contract status to ACTIVE
    const updatedContract = await prisma.contract.update({
      where: { id: params.id },
      data: {
        status: "ACTIVE",
      },
    });

    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error("Error activating contract:", error);
    return NextResponse.json(
      { error: "Failed to activate contract" },
      { status: 500 }
    );
  }
} 