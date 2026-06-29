import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { json } from "express";
import * as service from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => { //next is ok to not put in here cuz asyncHandler already got next by express sending to it to wrap around func for error handle
  const user = await service.register(req.body);
  res.json({ message: "User created", user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await service.login(req.body); // the order of var in receiver side is doesn't matter as long the name of it match to the sender side it eventually got data
  res.json({ message: "Login successfully", token, user });
});
