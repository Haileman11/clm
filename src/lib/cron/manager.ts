import cron from 'node-cron';
import { PrismaClient, ContractStatus } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Helper function to log job execution
async function logJobExecution(status: 'SUCCESS' | 'ERROR', message: string, details?: any) {
  try {
    await prisma.cronJobLog.create({
      data: {
        jobName: 'check-expiring-contracts',
        status,
        message,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error('Error logging job execution:', error);
  }
}

// Helper function to send email
async function sendExpirationNotification(
  email: string,
  contractName: string,
  expirationDate: Date,
  daysUntilExpiration: number
) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Contract Lifecycle Management <noreply@yourdomain.com>',
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

async function checkExpiringContracts() {
  try {
    // Get current date
    const now = new Date();
    
    // Calculate dates for different notification periods
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);
    
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setDate(now.getDate() + 1);

    // Find contracts that are expiring soon
    const expiringContracts = await prisma.contract.findMany({
      where: {
        status: ContractStatus.ACTIVE,
        expirationDate: {
          lte: thirtyDaysFromNow,
          gt: now,
        },
      },
      include: {
        stakeholders: {
          where: {
            role: {
              in: ['CONTRACT_MANAGER', 'CONTRACT_OWNER'],
            },
          },
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log(`Found ${expiringContracts.length} expiring contracts`);

    const notificationResults = [];

    // Send notifications for each expiring contract
    for (const contract of expiringContracts) {
      const daysUntilExpiration = Math.ceil(
        (contract.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send notifications to all stakeholders
      for (const stakeholder of contract.stakeholders) {
        try {
          await sendExpirationNotification(
            stakeholder.email,
            contract.name,
            contract.expirationDate,
            daysUntilExpiration
          );
          notificationResults.push({
            contractName: contract.name,
            stakeholderEmail: stakeholder.email,
            status: 'SUCCESS',
          });
        } catch (error: any) {
          notificationResults.push({
            contractName: contract.name,
            stakeholderEmail: stakeholder.email,
            status: 'ERROR',
            error: error.message,
          });
        }
      }
    }

    await logJobExecution('SUCCESS', `Processed ${expiringContracts.length} contracts`, {
      contractsProcessed: expiringContracts.length,
      notificationsSent: notificationResults.filter(r => r.status === 'SUCCESS').length,
      notificationsFailed: notificationResults.filter(r => r.status === 'ERROR').length,
      details: notificationResults,
    });

    console.log('Expiration check completed successfully');
  } catch (error: any) {
    console.error('Error checking expiring contracts:', error);
    await logJobExecution('ERROR', 'Failed to check expiring contracts', {
      error: error.message,
      stack: error.stack,
    });
  }
}

// Initialize cron jobs
export function initializeCronJobs() {
  // Run every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running contract expiration check...');
    await checkExpiringContracts();
  });

  console.log('Cron jobs initialized');
}

// Export for manual execution
export { checkExpiringContracts }; 