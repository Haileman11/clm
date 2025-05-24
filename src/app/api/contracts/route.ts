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
      contractNumber: "desc",
    },
  });

  let nextNumber = 1;
  if (latestContract?.contractNumber) {
    // Extract the number from the latest contract number (CN00001)
    const lastNumber = parseInt(
      latestContract.contractNumber.replace("CN", "")
    );
    nextNumber = lastNumber + 1;
  }

  // Format the number with leading zeros (5 digits)
  return `CN${nextNumber.toString().padStart(5, "0")}`;
}

// POST /api/contracts - Create a new contract
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { attachments, ...contractData } = data;

    // Generate contract number
    const contractNumber = await generateContractNumber();

    const connectStakeholders = Object.values(contractData.stakeholders)
      .flat()
      .map((id) => ({ id: id }));

    // Create the contract
    const contract = await prisma.contract.create({
      data: {
        ...contractData,
        stakeholders: {
          connect: connectStakeholders,
        },
        contractNumber,
      },
    });

    // If there are temporary attachments, create them in the database
    if (attachments && attachments.length > 0) {
      await Promise.all(
        attachments.map((attachment: any) =>
          prisma.attachment.create({
            data: {
              name: attachment.name,
              url: attachment.url,
              type: attachment.type,
              size: attachment.size,
              contractId: contract.id,
              uploadedBy: session.user?.email || "Unknown",
            },
          })
        )
      );
    }

    // Return the contract with its attachments
    const contractWithAttachments = await prisma.contract.findUnique({
      where: { id: contract.id },
      include: {
        vendor: true,
        stakeholders: true,
        attachments: true,
      },
    });

    return NextResponse.json(contractWithAttachments);
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { error: "Error creating contract" },
      { status: 500 }
    );
  }
}
