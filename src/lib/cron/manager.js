import { config } from "dotenv";
config();

async function getServiceToken() {
  try {
    const res = await fetch(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      }
    );

    const data = await res.json();
    return data.access_token;
  } catch (error) {
    console.log(error);
  }
}

async function logJobExecution(status, message, details) {
  const response = await fetch(`${process.env.API_URL}/api/cron`, {
    method: "POST",
    body: JSON.stringify({
      status,
      message,
      details,
    }),
  });
  const data = response.json();
  return data;
}
// async function checkExpiringContracts(token, days) {
//   try {
//     const now = new Date();

//     const response = await fetch(
//       `${process.env.API_URL}/api/contracts/expiring?days=${days}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json", // Important for JSON payload
//         },
//         method: "GET",
//       }
//     );
//     const expiringContracts = await response.json();
//     console.log(expiringContracts);
//     const notificationResults = [];

//     // Send notifications for each expiring contract
//     for (const contract of expiringContracts) {
//       const daysUntilExpiration = Math.ceil(
//         (new Date(Date.parse(contract.expirationDate)).getTime() -
//           now.getTime()) /
//           (1000 * 60 * 60 * 24)
//       );

//       // Send notifications to all stakeholders
//       const emailSet = new Set();

//       contract.stakeholders.forEach((stakeholder) => {
//         if (stakeholder?.email) {
//           emailSet.add(stakeholder.email);
//         }
//       });

//       const uniqueEmails = Array.from(emailSet); // all emails to include in one thread
//       try {
//         const response = await fetch(
//           `${process.env.API_URL}/api/email/expiry`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json", // Important for JSON payload
//             },
//             body: JSON.stringify({
//               email: uniqueEmails,
//               contractName: contract.name,
//               expirationDate: contract.expirationDate,
//               daysUntilExpiration,
//             }),
//           }
//         );
//         // await sendExpirationNotification(
//         //   stakeholder.email,
//         //   contract.name,
//         //   contract.expirationDate,
//         //   daysUntilExpiration
//         // );
//         notificationResults.push({
//           contractName: contract.name,
//           stakeholderEmail: stakeholder.email,
//           status: "SUCCESS",
//         });
//       } catch (error) {
//         notificationResults.push({
//           contractName: contract.name,
//           stakeholderEmail: stakeholder.email,
//           status: "ERROR",
//           error: error.message,
//         });
//       }
//     }

//     await logJobExecution(
//       "SUCCESS",
//       `Processed ${expiringContracts.length} contracts`,
//       {
//         contractsProcessed: expiringContracts.length,
//         notificationsSent: notificationResults.filter(
//           (r) => r.status === "SUCCESS"
//         ).length,
//         notificationsFailed: notificationResults.filter(
//           (r) => r.status === "ERROR"
//         ).length,
//         details: notificationResults,
//       }
//     );

//     console.log("Expiration check completed successfully");
//   } catch (error) {
//     console.error("Error checking expiring contracts:", error);
//     await logJobExecution("ERROR", "Failed to check expiring contracts", {
//       error: error.message,
//       stack: error.stack,
//     });
//   }
// }

async function updateContractStatuses(token) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/contracts/auto-update`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Important for JSON payload
        },
        method: "GET",
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error checking expiring contracts:", error);
  }
}
async function sendReminderEmails(token) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/email/expiry-reminder`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Important for JSON payload
        },
        method: "GET",
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error checking expiring contracts:", error);
  }
}

// Initialize cron jobs
async function initializeCronJobs() {
  // Run every day at 9 AM
  try {
    const token = await getServiceToken();
    await updateContractStatuses(token);
    await sendReminderEmails(token);
    // await checkExpiringContracts(token, 60);
    // console.log(response);
  } catch (error) {
    console.log(error);
  }

  console.log("Cron jobs initialized");
}

initializeCronJobs();
// Export for manual execution

// async function cleanUnusedAttachments() {
//   const unused = await prisma.attachment.findMany({
//     where: {
//       contracts: { none: {} },
//     },
//   });

//   for (const file of unused) {
//     // Optional: delete from cloud storage
//     await prisma.attachment.delete({ where: { id: file.id } });
//   }
// }
