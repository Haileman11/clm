import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";
import { formatContractWithStakeholders } from "@lib/types";
import { sendContractNotificationEmail } from "@lib/templates";

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
        stakeholders: {
          include: {
            user: true,
          },
        },
        attachments: true,
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
    console.log(data);
    // Generate contract number
    const contractNumber = await generateContractNumber();

    const connectAttachments = attachments?.map((attachment: any) => ({
      id: attachment.id,
    }));

    // Create the contract
    const contract = await prisma.contract.create({
      data: {
        ...contractData,
        stakeholders: undefined,
        attachments: {
          connect: connectAttachments,
        },
        contractNumber,
      },
      include: {
        vendor: true,
        stakeholders: { include: { user: true } },
        attachments: true,
      },
    });

    const connectStakeholders = Object.values(contractData.stakeholders)
      .flat()
      .map((userId) => ({ userId: userId, contractId: contract.id }));

    // Add contract stakeholders
    const contractStakeholders = await prisma.contractStakeholder.createMany({
      data: connectStakeholders as [],
    });
    const stakeholders = await prisma.contractStakeholder.findMany({
      where: {
        contractId: contract.id,
      },
      include: {
        user: true,
      },
    });
    sendContractNotificationEmail({
      emails: stakeholders.map((stakeholder) => stakeholder.user.email),
      type: "new",
      contractName: contract.name,
      contractId: contract.id,
      description: `
        <p>This <strong>${
          contract.contractType
        }</strong> becomes effective on <strong>${contract.effectiveDate.toLocaleDateString()}</strong> and runs until <strong>${contract.expirationDate.toLocaleDateString()}</strong>.</p>
        <p><strong>Stakeholders:</strong> ${contract.stakeholders
          .map((s) => `${s.user.firstName} ${s.user.lastName}`)
          .join(", ")}</p>
      `,
    });
    return NextResponse.json(formatContractWithStakeholders(contract));
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { error: "Error creating contract" },
      { status: 500 }
    );
  }
}
