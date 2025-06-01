import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// import { checkExpiringContracts } from "@lib/cron/manager";
import authOptions from "@app/api/auth/[...nextauth]/options";
import { checkPermission } from "@lib/apiPermissions";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to trigger cron jobs
    // const { authorized, response } = await checkPermission(request, {
    //   action: "cron:trigger",
    // });

    // if (!authorized) {
    //   return response;
    // }

    // Run the job
    // await checkExpiringContracts();

    return NextResponse.json({ message: "Cron job triggered successfully" });
  } catch (error: any) {
    console.error("Error triggering cron job:", error);
    return NextResponse.json(
      { error: "Failed to trigger cron job" },
      { status: 500 }
    );
  }
}
