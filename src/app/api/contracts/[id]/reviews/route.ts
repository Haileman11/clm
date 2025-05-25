import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";

// GET /api/contracts/[id]/reviews - Get all reviews for a contract
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      where: { contractId: params.id },
      include: {
        reviewer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/contracts/[id]/reviews - Request a review
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, reviewerId } = body;

    // Verify contract exists
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Create review request
    const review = await prisma.review.create({
      data: {
        contractId: params.id,
        reviewerId,
        type,
        status: "PENDING",
      },
      include: {
        reviewer: true,
      },
    });

    // Update contract status
    await prisma.contract.update({
      where: { id: params.id },
      data: {
        status: "PENDING_REVIEW",
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// PATCH /api/contracts/[id]/reviews/[reviewId] - Update review status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, comments } = body;

    // Update review
    const review = await prisma.review.update({
      where: { id: params.reviewId },
      data: {
        status,
        comments,
      },
      include: {
        reviewer: true,
      },
    });

    // If all reviews are approved, update contract status to REVIEWED
    const allReviews = await prisma.review.findMany({
      where: { contractId: params.id },
    });

    const allApproved = allReviews.every((r) => r.status === "APPROVED");
    if (allApproved) {
      await prisma.contract.update({
        where: { id: params.id },
        data: {
          status: "REVIEWED",
        },
      });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
} 