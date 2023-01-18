import { UserStore } from "../../models/User";
import client from "../../config/database";
import { UserReturnedType } from "../../types/user";

const userStore = new UserStore();

let user: UserReturnedType;

describe("User Model", () => {
  describe("methods should be defined", () => {
    it("should have an index method", () => {
      expect(userStore.index).toBeDefined();
    });
    it("should have a show method", () => {
      expect(userStore.show).toBeDefined();
    });
    it("should have a create method", () => {
      expect(userStore.create).toBeDefined();
    });
    it("should have an authenticate method", () => {
      expect(userStore.authenticate).toBeDefined();
    });
  });

  describe("User model logic", () => {
    afterAll(async () => {
      const conn = await client.connect();
      await conn.query(
        "DELETE FROM order_product;DELETE FROM orders;DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;"
      );
      conn.release();
    });

    it("index should return an empty array", async () => {
      const myUsers = await userStore.index();
      expect(myUsers).toEqual([]);
    });

    it("show should throw an error", async () => {
      const myUser = await userStore.show(0);
      expect(myUser).toBeFalsy();
    });

    it("should create a user", async () => {
      user = await userStore.create({
        firstname: "ahmed",
        lastname: "anwar",
        username: "usertestahmed1",
        password: "123456789",
      });

      expect(user).toEqual({
        id: 1,
        username: "usertestahmed1",
        firstname: "ahmed",
        lastname: "anwar",
      });
    });

    it("should return array contains the user with id 1", async () => {
      const myUsers = await userStore.index();

      expect(myUsers).toEqual([
        {
          id: 1,
          username: "usertestahmed1",
          firstname: "ahmed",
          lastname: "anwar",
        },
      ]);
    });

    it("should return the user with id 1", async () => {
      const myUser = await userStore.show(user.id);

      expect(myUser).toEqual({
        id: 1,
        username: "usertestahmed1",
        firstname: "ahmed",
        lastname: "anwar",
      });
    });

    it("should return null with incorrect user credintials", async () => {
      const myUser = await userStore.authenticate({
        username: "usertestahmed1",
        password: "9876543210",
      });

      expect(myUser).toBeFalsy();
    });

    it("should return user info when auth is successful", async () => {
      const myUser = await userStore.authenticate({
        username: "usertestahmed1",
        password: "123456789",
      });

      expect(myUser).toEqual({
        id: 1,
        username: "usertestahmed1",
        firstname: "ahmed",
        lastname: "anwar",
      });
    });
  });
});
