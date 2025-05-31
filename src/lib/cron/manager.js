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
async function checkExpiringContracts() {
  try {
    const now = new Date();

    const response = await fetch(
      `${process.env.API_URL}/api/contracts/expiring`,
      {
        method: "POST",
      }
    );
    const expiringContracts = await response.json();
    const notificationResults = [];

    // Send notifications for each expiring contract
    for (const contract of expiringContracts) {
      const daysUntilExpiration = Math.ceil(
        (contract.expirationDate.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Send notifications to all stakeholders
      for (const stakeholder of contract.stakeholders) {
        try {
          const response = await fetch(
            `${process.env.API_URL}/api/email/expiry`,
            {
              method: "POST",
              body: JSON.stringify({
                email: stakeholder.email,
                contractName: stakeholder.contractName,
                expirationDate: stakeholder.expirationDate,
                daysUntilExpiration,
              }),
            }
          );
          // await sendExpirationNotification(
          //   stakeholder.email,
          //   contract.name,
          //   contract.expirationDate,
          //   daysUntilExpiration
          // );
          notificationResults.push({
            contractName: contract.name,
            stakeholderEmail: stakeholder.email,
            status: "SUCCESS",
          });
        } catch (error) {
          notificationResults.push({
            contractName: contract.name,
            stakeholderEmail: stakeholder.email,
            status: "ERROR",
            error: error.message,
          });
        }
      }
    }

    await logJobExecution(
      "SUCCESS",
      `Processed ${expiringContracts.length} contracts`,
      {
        contractsProcessed: expiringContracts.length,
        notificationsSent: notificationResults.filter(
          (r) => r.status === "SUCCESS"
        ).length,
        notificationsFailed: notificationResults.filter(
          (r) => r.status === "ERROR"
        ).length,
        details: notificationResults,
      }
    );

    console.log("Expiration check completed successfully");
  } catch (error) {
    console.error("Error checking expiring contracts:", error);
    await logJobExecution("ERROR", "Failed to check expiring contracts", {
      error: error.message,
      stack: error.stack,
    });
  }
}

// Initialize cron jobs
async function initializeCronJobs() {
  // Run every day at 9 AM
  try {
    const token = await getServiceToken();
    console.log(token);
    const response = await fetch(`${process.env.API_URL}/api/email/expiry`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Important for JSON payload
      },
      body: JSON.stringify({
        email: "hailegabriel.mekonen@safaricom.et",
        contractName: "Test Contract",
        expirationDate: new Date(),
        daysUntilExpiration: 1,
      }),
    });
    await checkExpiringContracts();
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  console.log("Cron jobs initialized");
}

initializeCronJobs();
// Export for manual execution
// export { checkExpiringContracts };
