import request from "supertest";
import client from "../../config/database";
import app from "../../index";
import { OrderStatus } from "../../types/enums/order";

let token: string;

describe("Order routes", () => {
  beforeAll(async () => {
    const userRes = await request(app).post("/api/users").send({
      firstname: "ahmed",
      lastname: "anwar",
      username: "ahmedanwar123",
      password: "123456789",
    });

    token = userRes.body.token;

    await request(app)
      .post("/api/products")
      .send({
        name: "iphone 14",
        price: 14000,
        category: "phones",
      })
      .set("authorization", "Bearer " + token);
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query(
      "DELETE FROM order_product;DELETE FROM orders;DELETE FROM products;DELETE FROM users;ALTER SEQUENCE products_id_seq RESTART WITH 1;ALTER SEQUENCE users_id_seq RESTART WITH 1;ALTER SEQUENCE orders_id_seq RESTART WITH 1;"
    );
    conn.release();
  });

  describe("check authentication", () => {
    it("should return 401 Access denied", async () => {
      await request(app).get("/api/orders/all").expect(401);
      await request(app).get("/api/orders").expect(401);
      await request(app).get("/api/orders/1").expect(401);
      await request(app).get("/api/orders/current/1").expect(401);
      await request(app)
        .post("/api/orders")
        .send({
          products: [{ id: 1, quantity: 1 }],
          user_id: 1,
          status: OrderStatus.active,
        })
        .expect(401);
    });
  });
  describe("Order routes responses", () => {
    it("should return 201 when create order", async () => {
      await request(app)
        .post("/api/orders")
        .send({
          products: [{ id: 1, quantity: 1 }],
          user_id: 1,
          status: OrderStatus.active,
        })
        .set("authorization", "Bearer " + token)
        .expect(201);
    });
    it("should return 200 when get all orders", async () => {
      await request(app)
        .get("/api/orders/all")
        .set("authorization", "Bearer " + token)
        .expect(200);
    });
    it("should return 200 when get all orders by a user with token", async () => {
      await request(app)
        .get("/api/orders")
        .set("authorization", "Bearer " + token)
        .expect(200);
    });
    it("should return 200 when get current order by user with token", async () => {
      await request(app)
        .get("/api/orders/current/1")
        .set("authorization", "Bearer " + token)
        .expect(200);
    });
    it("should return 200 when get an order by id with token", async () => {
      await request(app)
        .get("/api/orders/1")
        .set("authorization", "Bearer " + token)
        .expect(200);
    });
  });
});
