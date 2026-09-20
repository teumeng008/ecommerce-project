import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export async function register(userData) {
  const { firstName, lastName, email, password } = userData;
  const existedUser = await prisma.user.findUnique({ where: { email } });
  if (existedUser) {
    throw new AppError("Email already existed", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  await prisma.cart.create({
    data: {
      userId: user.id,
    },
  });

  return sanitizeUser(user);
}

export async function login(userData) {
  const { email, password } = userData;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );

  return { token, user: sanitizeUser(user) };
}
