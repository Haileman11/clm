import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a contract manager user
  const contractManager = await prisma.user.upsert({
    where: { email: "haile.mak11@gmail.com" },
    update: {},
    create: {
      keycloakId: "78bee334-ee19-4bb1-ae26-5a1540b07475", // This should match the Keycloak user ID
      email: "haile.mak11@gmail.com",
      firstName: "Contract",
      lastName: "Manager",
      department: "Legal",
      role: "CONTRACT_MANAGER",
    },
  });

  console.log("Created contract manager:", contractManager);

  // Create a regular user for testing
  const regularUser = await prisma.user.upsert({
    where: { email: "testuser@safaricom.et" },
    update: {},
    create: {
      keycloakId: "8ef2508c-e8de-4da5-9959-92fc6ae90c2a", // This should match the Keycloak user ID
      email: "testuser@safaricom.et",
      firstName: "Test",
      lastName: "User",
      department: "IT",
      role: "CONTRACT_OWNER",
    },
  });

  console.log("Created regular user:", regularUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
