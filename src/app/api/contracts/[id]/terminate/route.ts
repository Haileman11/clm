import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";

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

    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error("Error terminating contract:", error);
    return NextResponse.json(
      { error: "Failed to terminate contract" },
      { status: 500 }
    );
  }
} 