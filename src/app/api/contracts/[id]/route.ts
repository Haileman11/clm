import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";

// GET /api/contracts/[id] - Get a single contract
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: {
        vendor: true,
        stakeholders: true,
        attachments: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Error fetching contract:", error);
    return NextResponse.json(
      { error: "Failed to fetch contract" },
      { status: 500 }
    );
  }
}

// PATCH /api/contracts/:id - Update a contract
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Contract ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      effectiveDate,
      expirationDate,
      clientLegalEntity,
      termType,
      contractType,
      supplierService,
      country,
      currency,
      totalValue,
      status,
      vendorId,
      stakeholders,
      attachments,
    } = body;

    const connectStakeholders = Object.values(stakeholders)
      .flat()
      .map((id) => ({ id: id }));

    const connectAttachments = attachments.map((attachment: any) => ({
      id: attachment.id,
    }));
    const contract = await prisma.contract.update({
      where: { id },
      data: {
        name,
        effectiveDate: new Date(effectiveDate),
        expirationDate: new Date(expirationDate),
        clientLegalEntity,
        termType,
        contractType,
        supplierService,
        country,
        currency,
        totalValue,
        status,
        vendorId,
        stakeholders: {
          set: connectStakeholders as { id: string }[],
        },
        attachments: {
          set: connectAttachments as { id: string }[],
        },
      },
      include: {
        vendor: true,
        stakeholders: true,
        attachments: true,
      },
    });

    return NextResponse.json(contract);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/contracts/:id - Delete a contract
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Contract ID is required" },
        { status: 400 }
      );
    }

    await prisma.contract.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Contract deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
