import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

export async function getCartUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    throw new AppError("User's cart not found", 404);
  }
  const cartItem = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });

  return cartItem;
}

export async function addCartItemById(userId, productId, data) {
  // 1. Verify User
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const product = await prisma.product.findUnique({where : {id : productId}});
  if(!product){
    throw new AppError("Product not found", 404);
  }

  // 2. Find or Create Cart
  let cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  // If cart doesn't exist, create it and update our 'cart' variable
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: userId,
      },
    });
  }

  // 3. Check if this product is already in the cart using the compound unique key
  const cartItemExist = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: productId,
      },
    },
  });

  let cartItem;

  if (cartItemExist) {
    // 4. If it exists, update it using its unique ID and Prisma's increment tool
    cartItem = await prisma.cartItem.update({
      where: { id: cartItemExist.id },
      data: {
        quantity: {
          increment: data.quantity, // Safely increments the existing database value
        },
      },
    });
  } else {
    // 5. If it doesn't exist, create a new row
    cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: data.quantity, // Extracted the quantity integer properly
      },
    });
  }

  return cartItem;
}

export async function updateCartItemById(userId, productId, data) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    throw new AppError("Cart's user not found", 404);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: productId } },
  });

  if (!cartItem) {
    throw new AppError(`Cart doesn't has productId ${productId}`, 404);
  }

  const update = await prisma.cartItem.update({
    where: { cartId_productId: { cartId: cart.id, productId: productId } },
    data: {
      quantity: data.quantity,
    },
  });
  return update;
}

export async function deleteCartItemById(userId, productId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    throw new AppError("Cart's user not found", 404);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: productId } },
  });

  if (!cartItem) {
    throw new AppError(`Cart doesn't has productId ${productId}`, 404);
  }
  
  await prisma.cartItem.delete({where : {cartId_productId : { cartId : cart.id, productId }}});
}

export async function clearCartById(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    throw new AppError("Cart's user not found", 404);
  }

  await prisma.cartItem.deleteMany({where : {cartId : cart.id}});
}
