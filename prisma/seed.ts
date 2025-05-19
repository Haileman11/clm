import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a contract manager user
  const contractManager = await prisma.user.upsert({
    where: { email: 'contract.manager@example.com' },
    update: {},
    create: {
      keycloakId: 'contract-manager-1', // This should match the Keycloak user ID
      email: 'contract.manager@example.com',
      firstName: 'Contract',
      lastName: 'Manager',
      department: 'Legal',
      role: 'CONTRACT_MANAGER',
    },
  });

  console.log('Created contract manager:', contractManager);

  // Create a regular user for testing
  const regularUser = await prisma.user.upsert({
    where: { email: 'regular.user@example.com' },
    update: {},
    create: {
      keycloakId: 'regular-user-1', // This should match the Keycloak user ID
      email: 'regular.user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      department: 'IT',
      role: 'CONTRACT_OWNER',
    },
  });

  console.log('Created regular user:', regularUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 