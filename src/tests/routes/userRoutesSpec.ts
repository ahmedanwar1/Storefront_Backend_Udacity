import request from "supertest";
import client from "../../config/database";
import app from "../../index";

let token: string;

describe("User routes", () => {
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        firstname: "ahmed",
        lastname: "anwar",
        username: "ahmedanwar123",
        password: "123456789",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    token = res.body.token;
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query(
      "DELETE FROM order_product;DELETE FROM orders;DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;"
    );
    conn.release();
  });

  describe("check authentication", () => {
    it("should return 401 Access denied", async () => {
      await request(app).get("/api/users").expect(401);
      await request(app).get("/api/users/1").expect(401);
    });
  });
  describe("User routes responses", () => {
    it("should return unauthurized with wrong password", async () => {
      await request(app)
        .post("/api/users/authenticate")
        .send({
          username: "ahmedanwar123",
          password: "987654321",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(401);
    });
    it("should return 200 when auth", async () => {
      await request(app)
        .post("/api/users/authenticate")
        .send({
          username: "ahmedanwar123",
          password: "123456789",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(200);
    });
    it("should return 201 when create user", async () => {
      await request(app)
        .post("/api/users")
        .send({
          username: "ahmedanwar12344",
          password: "123456789",
          firstname: "ahmed",
          lastname: "anwar",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201);
    });
    it("should return 200 when getalluser with token", async () => {
      await request(app)
        .get("/api/users")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("authorization", "Bearer " + token)
        .expect(200);
    });
    it("should return 200 when get user by id with token", async () => {
      await request(app)
        .get("/api/users/1")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("authorization", "Bearer " + token)
        .expect(200 || 404);
    });
  });
});
