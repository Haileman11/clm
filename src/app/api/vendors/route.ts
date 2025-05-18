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

// POST /api/vendors - Create a new vendor
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      phone,
      number,
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
        email,
        phone,
        number,
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

// PUT /api/vendors/:id - Update a vendor
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      number,
      supplierService,
      vatRegistrationId,
      address,
      country,
      status,
      parentVendorId,
    } = body;

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        number,
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/vendors/:id - Delete a vendor
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
    }

    await prisma.vendor.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 