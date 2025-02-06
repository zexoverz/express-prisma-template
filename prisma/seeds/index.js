const { PrismaClient } = require('@prisma/client');
const logger = require('../../src/config/logger');

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      name: 'customer',
      email: 'admin@gmail.com',
      password: '$2b$10$4uk.wCJvhIkrVUWga1HPk.voHd5L53sjGnohFDKr1ZVIlwPTeW9Xm', // password
      role: 'admin',
    },
  });

  await prisma.token.create({
    data: {
      token: 'sample-token-123',
      type: 'auth',
      userId: user1.id,
      expires: new Date(new Date().getTime() + 60 * 60 * 1000),
      blacklisted: false,
    },
  });

  logger.info('Seed data created!');
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });