import { tr } from "zod/v4/locales";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

export async function checkoutService(userId, data) {
  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // Get cart items with product information
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true,
    },
  });

  if (cartItems.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  // Validate stock and calculate total
  let totalPrice = 0;

  for (const item of cartItems) {
    if (!item.product) {
      throw new AppError("Product not found", 404);
    }

    if (item.product.stock < item.quantity) {
      throw new AppError(
        `${item.product.name} does not have enough stock`,
        400,
      );
    }

    totalPrice += item.product.price * item.quantity;
  }

  // Everything below must succeed together
  const order = await prisma.$transaction(async (tx) => {
    // Create order with the correct relation connection syntax
    const newOrder = await tx.order.create({
      data: {
        totalPrice,
        status: "PAID", // or PENDING if you later add payment
        shippingAddress: data.shippingAddress ?? null,
        phone: data.phone,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // Create order items
    for (const item of cartItems) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });
    }

    // Reduce stock
    for (const item of cartItems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return newOrder;
  });

  return order;
}

export async function getOrdersService(userId) {
  const orders = await prisma.order.findMany({ where: { userId } });
  return orders;
}

export async function getOrdersByIdService(userId, id) {
  const thisUserOrder = await prisma.order.findMany({ where: { userId } });

  for (let item of thisUserOrder) {
    if (item.id === id) {
      const orderDetail = await prisma.orderItem.findMany({
        where: { orderId: id },
      });
      return orderDetail;
    }
  }
  throw new AppError(`Order ${id} doesn't exist under user ${userId}`, 404);
}
