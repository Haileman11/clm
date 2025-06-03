import authOptions from "@app/api/auth/[...nextauth]/options";
import { getNodemailerTransport } from "@lib/nodemailer";
import { sendContractNotificationEmail } from "@lib/templates";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Helper function to send email
// async function sendExpirationNotification(
//   email: string[],
//   contractName: string,
//   expirationDate: Date,
//   daysUntilExpiration: number,
//   contractId: string
// ) {
//   try {
//     const transporter = await getNodemailerTransport();

//     const contractUrl = `${
//       process.env.APP_URL || "https://yourdomain.com"
//     }/contracts/show/${contractId}`;

//     await transporter.sendMail({
//       from:
//         process.env.SMTP_FROM ||
//         "Contract Lifecycle Management <noreply@yourdomain.com>",
//       to: email,
//       subject: `Contract Expiration Notice: ${contractName}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
//           <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px;">

//             <h2 style="color: #cc0000;">Contract Expiration Notice</h2>

//             <p style="font-size: 16px; color: #555;">
//               The following contract is nearing expiration:
//             </p>

//             <ul style="font-size: 16px; color: #333; line-height: 1.6;">
//               <li><strong>Contract Name:</strong> ${contractName}</li>
//               <li><strong>Expiration Date:</strong> ${expirationDate.toLocaleDateString()}</li>
//               <li><strong>Days Until Expiration:</strong> ${daysUntilExpiration}</li>
//             </ul>

//             <p style="font-size: 16px; color: #555;">
//               Please take the necessary action to renew or close this contract.
//             </p>

//             <a href="${contractUrl}"
//               style="display:inline-block; padding:12px 20px; background-color:#007bff; color:#ffffff;
//                      text-decoration:none; border-radius:5px; margin-top:20px; font-weight:bold;">
//               View Contract
//             </a>
//           </div>
//         </div>
//       `,
//     });

//     console.log(`Notification sent to ${email} for contract ${contractName}`);
//   } catch (error) {
//     console.error(`Error sending email to ${email}:`, error);
//     throw error;
//   }
// }

// POST /api/email/expiry - Send expiry email
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      emails,
      contractName,
      expirationDate,
      daysUntilExpiration,
      contractId,
    } = body;

    const log = await sendContractNotificationEmail({
      emails,
      type: "expiration",
      contractName,
      contractId,
      expirationDate,
      daysUntilExpiration,
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email log" },
      { status: 500 }
    );
  }
}
