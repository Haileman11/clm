import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@lib/prisma";
import authOptions from "@app/api/auth/[...nextauth]/options";

// GET /api/vendors - Get all cron logs
export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const cronJobLogs = await prisma.cronJobLog.findMany();
    return NextResponse.json(cronJobLogs);
  } catch (error) {
    console.error("Error fetching cron logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch cron logs" },
      { status: 500 }
    );
  }
}

// Log execution
async function logJobExecution(
  status: "SUCCESS" | "ERROR",
  message: string,
  details?: any
) {
  try {
    const log = await prisma.cronJobLog.create({
      data: {
        jobName: "check-expiring-contracts",
        status,
        message,
        details: details ? JSON.stringify(details) : details,
      },
    });
    return log;
  } catch (error) {
    console.error("Error logging job execution:", error);
  }
}

// POST /api/cron - Create a new cron job log
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, message, details } = body;

    const log = await logJobExecution(status, message, details);

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { error: "Failed to create log" },
      { status: 500 }
    );
  }
}
