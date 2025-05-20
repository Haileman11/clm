import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";

// GET /api/contracts - Get all contracts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contracts = await prisma.contract.findMany({
      include: {
        vendor: true,
        stakeholders: true,
      },
    });
    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}

// Function to generate contract number
async function generateContractNumber() {
  // Get the latest contract number
  const latestContract = await prisma.contract.findFirst({
    orderBy: {
      contractNumber: 'desc'
    }
  });

  let nextNumber = 1;
  if (latestContract?.contractNumber) {
    // Extract the number from the latest contract number (CN00001)
    const lastNumber = parseInt(latestContract.contractNumber.replace('CN', ''));
    nextNumber = lastNumber + 1;
  }

  // Format the number with leading zeros (5 digits)
  return `CN${nextNumber.toString().padStart(5, '0')}`;
}

// POST /api/contracts - Create a new contract
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Generate contract number
    const contractNumber = await generateContractNumber();

    const contract = await prisma.contract.create({
      data: {
        ...data,
        contractNumber,
      },
    });

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { error: "Error creating contract" },
      { status: 500 }
    );
  }
}

// PUT /api/contracts/:id - Update a contract
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Contract ID is required" }, { status: 400 });
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
    } = body;

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
          set: stakeholders.map((id: string) => ({ id })),
        },
      },
      include: {
        vendor: true,
        stakeholders: true,
      },
    });

    return NextResponse.json(contract);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
      return NextResponse.json({ error: "Contract ID is required" }, { status: 400 });
    }

    await prisma.contract.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Contract deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 