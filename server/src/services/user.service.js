import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import bcrypt from "bcrypt";

export async function getMe(userData) {
  const id = userData;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
}

export async function updateMe(userID, updatedData) {
  console.log(updatedData);
  
  if(Object.keys(updatedData).length === 0){  // this mean the req is empty or no update data
    throw new AppError("No data provided",400);
  }
  const id = userID;
  const currentUser = await prisma.user.findUnique({ where: { id } });

  let { email } = updatedData;

  if (!currentUser) {
    throw new AppError("User not found", 404);
  }

  if (email) {
    email = email.toLowerCase();
    updatedData.email = email;
    const existedData = await prisma.user.findUnique({ where: { email } });

    if (existedData && existedData.id !== currentUser.id) {
      throw new AppError("email already exists", 409);
    }
  }

  const update = await prisma.user.update({
    where: { id },
    data: updatedData,
  });

  return sanitizeUser(update);
}

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return users.map((user) => sanitizeUser(user));
}

export async function updateUserRole(userId, role, actorId) {
  const validRoles = ['USER', 'ADMIN'];
  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role provided', 400);
  }

  if (actorId === userId) {
    throw new AppError('You cannot change your own role', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return sanitizeUser(updated);
}

export async function passwordMe(userID, Password) {
  const {currentPassword, newPassword }= Password;
  if(newPassword === currentPassword){
    throw new AppError("New password must be different", 400);
  }

  const currentUser = await prisma.user.findUnique({where:{id : userID}});

  if (!currentUser){
    throw new AppError("User not found", 404);
  }
  
  const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
  if(!isMatch){
    throw new AppError("Invalid credentials",401);
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const update = await prisma.user.update({
    where: {id : userID},
    data:{
      password: hashedPassword
    }
  });

  // return sanitizeUser(update);
}
