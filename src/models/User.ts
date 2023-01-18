import bcrypt from "bcrypt";
import client from "../config/database";
import IStore from "../interfaces/IStore";
import { UserReturnedType, User, UserAuth } from "../types/user";
import AppError from "../utils/AppError";

export class UserStore implements IStore<UserReturnedType, User> {
  //get all users
  async index(): Promise<UserReturnedType[]> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT id, username, first_name as firstname, last_name as lastname FROM users";
      const res = await conn.query(sql);
      conn.release();

      return res.rows;
    } catch (err) {
      throw new AppError("Cannot get users.", 500);
    }
  }

  //get specific user by id
  async show(id: number | string): Promise<UserReturnedType> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT id, username, first_name as firstname, last_name as lastname FROM users WHERE id=($1)";
      const res = await conn.query(sql, [id]);
      conn.release();

      return res.rows[0];
    } catch (err) {
      throw new AppError("Cannot get user.", 500);
    }
  }

  //create user
  async create(user: User): Promise<UserReturnedType> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *";
      const hashedPassword = await bcrypt.hash(
        `${user.password}${process.env.PASSWORD_APPENDED_STRING}`,
        parseInt(process.env.SALT_ROUNDS as string)
      );
      const res = await conn.query(sql, [
        user.username,
        user.firstname,
        user.lastname,
        hashedPassword,
      ]);
      conn.release();

      return {
        id: res.rows[0]["id"],
        username: res.rows[0]["username"],
        firstname: res.rows[0]["first_name"],
        lastname: res.rows[0]["last_name"],
      };
    } catch (err) {
      throw new AppError("Cannot create user.", 500);
    }
  }

  //auth user
  async authenticate(user: UserAuth): Promise<UserReturnedType | null> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT id, username, first_name as firstname, last_name as lastname, password FROM users WHERE username=($1)";
      const res = await conn.query(sql, [user.username]);

      if (res.rows.length < 1) {
        return null;
      }

      const checkPassword = bcrypt.compareSync(
        `${user.password}${process.env.PASSWORD_APPENDED_STRING}`,
        res.rows[0].password
      );

      if (!checkPassword) {
        return null;
      }

      conn.release();
      return {
        id: res.rows[0].id,
        username: res.rows[0].username,
        firstname: res.rows[0].firstname,
        lastname: res.rows[0].lastname,
      };
    } catch (err) {
      throw new AppError("Unable to authenticate user!", 500);
    }
  }
}
