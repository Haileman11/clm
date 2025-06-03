import { getNodemailerTransport } from "./nodemailer";
import { prisma } from "./prisma";

export function generateContractNotificationHTML({
  type,
  contractName,
  contractId,
  expirationDate,
  daysUntilExpiration,
  renewedDate,
  description,
}: {
  type:
    | "new"
    | "activation"
    | "expiration"
    | "termination"
    | "expired"
    | "inactive"
    | "renewal";
  contractName: string;
  contractId: string;
  expirationDate?: Date;
  daysUntilExpiration?: number;
  renewedDate?: Date;
  description?: string;
}): { subject: string; html: string } {
  const baseUrl = process.env.API_URL || "";
  const contractUrl = `${baseUrl}/contracts/show/${contractId}`;

  let heading = "";
  let intro = "";
  let details = "";

  switch (type) {
    case "new":
      heading = "New Contract Created";
      intro = `The document titled <strong>${contractName}</strong> has been <strong>created</strong>.`;
      break;
    case "activation":
      heading = "Contract Activated";
      intro = `The document titled <strong>${contractName}</strong> has been <strong>activated</strong>.`;
      break;
    case "termination":
      heading = "Contract Terminated";
      intro = `The contract <strong>${contractName}</strong> has been <strong>terminated</strong>.`;
      break;
    case "expiration":
    default:
      heading = "Contract Expiration Notice";
      intro = `The following contract is nearing expiration:`;
      details = `
        <li><strong>Expiration Date:</strong> ${expirationDate?.toLocaleDateString()}</li>
        <li><strong>Days Until Expiration:</strong> ${daysUntilExpiration}</li>
      `;
      break;
    case "expired":
      heading = "Contract Expired";
      intro = `The contract <strong>${contractName}</strong> has <strong>expired</strong>.`;
      details = `
        <li><strong>Expired On:</strong> ${expirationDate?.toLocaleDateString()}</li>
      `;
      break;
    case "inactive":
      heading = "Contract Marked as Inactive";
      intro = `The contract <strong>${contractName}</strong> has been marked as <strong>inactive</strong>.`;
      break;
    case "renewal":
      heading = "Contract Renewed";
      intro = `The contract <strong>${contractName}</strong> has been <strong>successfully renewed</strong>.`;
      details = `
        <li><strong>Renewed On:</strong> ${renewedDate?.toLocaleDateString()}</li>
        ${
          expirationDate
            ? `<li><strong>New Expiration Date:</strong> ${expirationDate.toLocaleDateString()}</li>`
            : ""
        }
      `;
      break;
  }

  const subjectPrefix = {
    new: "New Contract",
    activation: "Contract Activated",
    expiration: "Contract Expiration Notice",
    termination: "Contract Terminated",
    expired: "Contract Expired",
    inactive: "Contract Inactive",
    renewal: "Contract Renewal",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px;">
        
        <h2 style="color: #333;">${heading}</h2>

        <p style="font-size: 16px; color: #555;">${intro}</p>

        <ul style="font-size: 16px; color: #333; line-height: 1.6;">
          <li><strong>Contract Name:</strong> ${contractName}</li>
          ${details}
        </ul>

        ${
          description
            ? `<p style="font-size: 16px; color: #555;"><em>${description}</em></p>`
            : ""
        }

        <a href="${contractUrl}"
          style="display:inline-block; padding:12px 20px; background-color:#007bff; color:#ffffff;
                text-decoration:none; border-radius:5px; margin-top:20px; font-weight:bold;">
          View Contract
        </a>
      </div>
    </div>
  `;

  return {
    subject: `${subjectPrefix[type]}: ${contractName}`,
    html,
  };
}
export async function sendContractNotificationEmail({
  emails,
  type,
  contractName,
  contractId,
  expirationDate,
  daysUntilExpiration,
  renewedDate,
  description,
}: {
  emails: string[];
  type:
    | "new"
    | "activation"
    | "expiration"
    | "termination"
    | "expired"
    | "inactive"
    | "renewal";
  contractName: string;
  contractId: string;
  expirationDate?: Date;
  daysUntilExpiration?: number;
  renewedDate?: Date;
  description?: string;
}) {
  try {
    const transporter = await getNodemailerTransport();

    const { subject, html } = generateContractNotificationHTML({
      type,
      contractName,
      contractId,
      expirationDate,
      daysUntilExpiration,
      description,
    });

    await Promise.all(
      emails.map((email) =>
        prisma.notification.create({
          data: {
            type,
            title: subject,
            body: description ?? "", // optional preview
            userEmail: email,
          },
        })
      )
    );

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        "Contract Lifecycle Management <noreply@safaricom.et>",
      to: emails,
      subject,
      html,
    });

    console.log(`Notification (${type}) sent to ${emails} for ${contractName}`);
  } catch (error) {
    console.error(`Error sending ${type} email to ${emails}:`, error);
    throw error;
  }
}
