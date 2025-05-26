import authOptions from "@app/api/auth/[...nextauth]/options";
import { prisma } from "@lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET one
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        reviewer: true,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
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
