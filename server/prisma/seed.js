import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await clearDatabase();

  const categoryNames = [
    "Electronics",
    "Clothing",
    "Home",
    "Sports",
    "Beauty",
  ];

  const categories = [];
  for (const name of categoryNames) {
    categories.push(
      await prisma.category.create({
        data: {
          name,
          slug: slugify(name),
          image: `https://picsum.photos/seed/${slugify(name)}/600/400`,
        },
      })
    );
  }

  const products = [];
  for (let i = 0; i < 50; i++) {
    const category = faker.helpers.arrayElement(categories);
    const name = `${faker.commerce.productName()} ${faker.word.adjective()}`;
    const slug = slugify(`${name} ${i}`);
    const price = Number(faker.commerce.price({ min: 5, max: 500, dec: 2 }));
    const product = await prisma.product.create({
      data: {
        categoryId: category.id,
        name,
        slug,
        description: faker.lorem.paragraph(),
        price,
        stock: faker.number.int({ min: 0, max: 200 }),
        thumbnail: `https://picsum.photos/seed/${slug}/640/480`,
        isActive: faker.datatype.boolean(),
      },
    });

    products.push(product);

    const imageCount = faker.number.int({ min: 1, max: 4 });
    for (let j = 0; j < imageCount; j++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: `https://picsum.photos/seed/${slug}-${j}/640/480`,
          sortOrder: j,
        },
      });
    }
  }

  const defaultPassword = await bcrypt.hash("Password123!", 10);
  const users = [];
  for (let i = 0; i < 30; i++) {
    users.push(
      await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: defaultPassword,
          phone: faker.phone.number("##########"),
          avatar: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
          role: faker.datatype.boolean() ? "USER" : "ADMIN",
        },
      })
    );
  }

  for (const user of users) {
    const cart = await prisma.cart.create({ data: { userId: user.id } });
    const cartProducts = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 5 }));

    for (const product of cartProducts) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 5 }),
        },
      });
    }
  }

  for (const user of users) {
    const ordersCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < ordersCount; i++) {
      const orderProducts = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 5 }));
      const items = orderProducts.map((product) => {
        const quantity = faker.number.int({ min: 1, max: 4 });
        return {
          productId: product.id,
          quantity,
          price: product.price,
        };
      });
      const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      await prisma.order.create({
        data: {
          userId: user.id,
          totalPrice: Number(totalPrice.toFixed(2)),
          status: faker.helpers.arrayElement(["PENDING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED"]),
          shippingAddress: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
          phone: faker.phone.number("##########"),
          items: {
            create: items,
          },
        },
      });
    }
  }

  console.log("Database seeding complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
