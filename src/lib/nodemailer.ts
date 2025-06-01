import * as nodemailer from "nodemailer";
export async function getNodemailerTransport() {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "25"),
    // auth: false,
    auth:
      process.env.SMTP_HOST || process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
  });
  return transporter;
}
