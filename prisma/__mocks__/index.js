const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')
const { join } = require('path')

const generateDatabaseURL = () => {
  if (!process.env.TEST_DB_URL) {
    throw new Error('please provide a database url');
  }
  let url = process.env.TEST_DB_URL

  return url
};


const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma');

let url = generateDatabaseURL()

process.env.DB_URL = url;

const prisma = new PrismaClient({
  datasources: { db: { url } },
});

beforeAll(async () => {
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: url
    },
  });
});

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.token.deleteMany()
});

afterAll(async () => {
    await prisma.$disconnect();
});

module.exports = prisma;