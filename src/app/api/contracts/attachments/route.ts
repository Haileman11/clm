import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const contractId = formData.get("contractId") as string;

    if (!file) {
      return new NextResponse("Missing file", { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, which is fine
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // If we have a contractId, create the attachment record
    if (contractId) {
      // Verify contract exists
      const contract = await prisma.contract.findUnique({
        where: { id: contractId },
      });

      if (!contract) {
        return new NextResponse("Contract not found", { status: 404 });
      }

      const attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          url: `/uploads/${fileName}`,
          type: file.type,
          size: file.size,
          contractId,
          uploadedBy: session.user?.email || "Unknown",
        },
      });

      return NextResponse.json(attachment);
    }

    // For create mode, just return the file info
    return NextResponse.json({
      name: file.name,
      url: `/uploads/${fileName}`,
      type: file.type,
      size: file.size,
      uploadedBy: session.user?.email || "Unknown",
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error uploading attachment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get("id");

    if (!attachmentId) {
      return new NextResponse("Missing attachment ID", { status: 400 });
    }

    // Get attachment details
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // Delete file
    const filePath = join(process.cwd(), "public", attachment.url);
    await writeFile(filePath, "");

    // Delete attachment record
    await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 