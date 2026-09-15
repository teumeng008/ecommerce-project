import { prisma } from "../src/lib/prisma.js";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email.");
    console.error('Example: npm run seed:admin -- "Example123@gmail.com"');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: "ADMIN",
      },
    });

    console.log(`${user.email} is now an ADMIN.`);
  } catch (error) {
    console.error(`User with email "${email}" doesn't exist.`);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error("Failed to promote user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
