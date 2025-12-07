const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  // Buat beberapa user
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    });
    users.push(user);
  }

  // Buat minimal 20 pets
  const petTypes = ["Dog", "Cat", "Rabbit", "Bird", "Hamster"];
  for (let i = 0; i < 20; i++) {
    await prisma.pet.create({
      data: {
        name: faker.animal.cat(), // random name (faker has animal helpers)
        type: petTypes[Math.floor(Math.random() * petTypes.length)],
        reason: faker.lorem.sentence(),
        ageYears: faker.number.int({ min: 0, max: 10 }),
        ageMonths: faker.number.int({ min: 0, max: 11 }),
        // imagePath kosong pada seed; bisa diisi jika Anda meletakkan file
        ownerId: users[Math.floor(Math.random() * users.length)].id,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
