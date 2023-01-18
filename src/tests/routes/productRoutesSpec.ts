import request from "supertest";
import client from "../../config/database";
import app from "../../index";

let token: string;

describe("Product routes", () => {
  beforeAll(async () => {
    const res = await request(app).post("/api/users").send({
      firstname: "ahmed",
      lastname: "anwar",
      username: "ahmedanwar123",
      password: "123456789",
    });

    token = res.body.token;
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query(
      "DELETE FROM order_product;DELETE FROM orders;DELETE FROM products;DELETE FROM users;ALTER SEQUENCE products_id_seq RESTART WITH 1;ALTER SEQUENCE users_id_seq RESTART WITH 1;"
    );
    conn.release();
  });

  describe("check authentication", () => {
    it("should return 401 Access denied", async () => {
      await request(app)
        .post("/api/products")
        .send({
          name: "iphone 14",
          price: 14000,
          category: "phones",
        })
        .expect(401);
    });
  });
  describe("Product routes responses", () => {
    it("should return 201 when create product", async () => {
      await request(app)
        .post("/api/products")
        .send({
          name: "iphone 14",
          price: 14000,
          category: "phones",
        })
        .set("authorization", "Bearer " + token)
        .expect(201);
    });
    it("should return 200 when getallproducts with token", async () => {
      await request(app)
        .get("/api/products")
        .set("authorization", "Bearer " + token)
        .expect(200);
    });
    it("should return 200 when get product by id with token", async () => {
      await request(app)
        .get("/api/products/1")
        .set("authorization", "Bearer " + token)
        .expect(200 || 404);
    });
  });
});
