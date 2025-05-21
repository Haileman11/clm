import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";

// GET /api/vendors - Get all vendors
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendors = await prisma.vendor.findMany({
      include: {
        parentVendor: true,
      },
    });
    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

// Function to generate vendor number
async function generateVendorNumber() {
  // Get the latest vendor number
  const latestVendor = await prisma.vendor.findFirst({
    orderBy: {
      vendorNumber: "desc",
    },
  });

  let nextNumber = 1;
  if (latestVendor?.vendorNumber) {
    // Extract the number from the latest vendor number (VN0001)
    const lastNumber = parseInt(latestVendor.vendorNumber.replace("VN", ""));
    nextNumber = lastNumber + 1;
  }

  // Format the number with leading zeros (4 digits)
  return `VN${nextNumber.toString().padStart(4, "0")}`;
}

// POST /api/vendors - Create a new vendor
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendorNumber = await generateVendorNumber();
    const body = await req.json();
    const {
      name,
      supplierService,
      vatRegistrationId,
      address,
      country,
      status,
      parentVendorId,
    } = body;

    const vendor = await prisma.vendor.create({
      data: {
        name,
        vendorNumber,
        supplierService,
        vatRegistrationId,
        address,
        country,
        status,
        parentVendorId,
      },
      include: {
        parentVendor: true,
      },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: "Failed to create vendor" },
      { status: 500 }
    );
  }
}
