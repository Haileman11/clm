import authOptions from "@app/api/auth/[...nextauth]/options";
import { getNodemailerTransport } from "@lib/nodemailer";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Helper function to send email
async function sendExpirationNotification(
  email: string,
  contractName: string,
  expirationDate: Date,
  daysUntilExpiration: number
) {
  try {
    console.log("transporting");
    const transporter = await getNodemailerTransport();
    await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        "Contract Lifecycle Management <noreply@yourdomain.com>",
      to: email,
      subject: `Contract Expiration Notice: ${contractName}`,
      html: `
        <h2>Contract Expiration Notice</h2>
        <p>The following contract is expiring soon:</p>
        <ul>
          <li><strong>Contract Name:</strong> ${contractName}</li>
          <li><strong>Expiration Date:</strong> ${expirationDate.toLocaleDateString()}</li>
          <li><strong>Days Until Expiration:</strong> ${daysUntilExpiration}</li>
        </ul>
        <p>Please take necessary action to renew or terminate the contract.</p>
      `,
    });
    console.log(`Notification sent to ${email} for contract ${contractName}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw error;
  }
}
// POST /api/email/expiry - Send expiry email
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, contractName, expirationDate, daysUntilExpiration } = body;

    const log = await sendExpirationNotification(
      email,
      contractName,
      new Date(Date.parse(expirationDate)),
      daysUntilExpiration
    );

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email log" },
      { status: 500 }
    );
  }
}
