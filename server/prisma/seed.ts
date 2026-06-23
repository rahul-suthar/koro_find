import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/prisma";

const categories = ["Electronics", "Books", "Gaming", "Fashion", "Sports"];

function generateProducts() {
  const createdAt = faker.date.past({
    years: 1,
  });

  return {
    name: faker.commerce.productName(),
    category: categories[Math.floor(Math.random() * categories.length)],
    price: faker.number.float({
      min: 100,
      max: 5000,
      fractionDigits: 2,
    }),

    createdAt,
    updatedAt: createdAt,
  };
}

async function main() {
  console.log("Clearing data...");

  await prisma.product.deleteMany();

  console.log("Seeding...");

  const TOTAL = 200_000;
  const BATCH_SIZE = 5_000;

  const totalBatches = TOTAL / BATCH_SIZE;

  for (let batch = 0; batch < totalBatches; batch++) {
    const products = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      products.push(generateProducts());
    }

    await prisma.product.createMany({
      data: products,
    });

    console.log(
      `Batch ${batch + 1} / ${totalBatches} inserted (${(batch + 1) * BATCH_SIZE} products)`,
    );
  }
}

main()
  .then(async () => {
    console.log("Completed");
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
