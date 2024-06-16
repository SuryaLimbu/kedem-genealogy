import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

async function main() {
  await prisma.person.deleteMany();
  await prisma.relationship.deleteMany();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    console.log("error");
    await prisma.$disconnect();
    process.exit(1);
  });
