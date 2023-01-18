import express from "express";
import jwt from "jsonwebtoken";
import { UserStore } from "../models/User";
import { UserReturnedType } from "../types/user";
import AppError from "../utils/AppError";

const userStore = new UserStore();

//get all users
const getAllUsers = async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const users: UserReturnedType[] = await userStore.index();

    if (users.length == 0) {
      return res.status(404).json(users);
    }

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

//get user by id
const getUserById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const id: string = req.params.id;
    const user: UserReturnedType = await userStore.show(id);

    if (!user) {
      return res.status(404).json(user);
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//create user
const createUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const username: string = req.body.username;
    const firstname: string = req.body.firstname;
    const lastname: string = req.body.lastname;
    const password: string = req.body.password;

    if (!username || !firstname || !lastname || !password) {
      throw new AppError(
        "Missing data! Please provide all required data.",
        400
      );
    }

    const user: UserReturnedType = await userStore.create({
      username,
      firstname,
      lastname,
      password,
    });

    const token = jwt.sign(user, process.env.TOKEN_SECRET as string);

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

const authenticateUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const username: string = req.body.username;
    const password: string = req.body.password;

    if (!username || !password) {
      throw new AppError(
        "Missing data! Please provide all required data.",
        400
      );
    }

    const user: UserReturnedType | null = await userStore.authenticate({
      username,
      password,
    });

    if (!user) {
      throw new AppError("Unauthorized user!", 401);
    }

    const token = jwt.sign(user, process.env.TOKEN_SECRET as string);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

export { getAllUsers, createUser, getUserById, authenticateUser };
