import client from "../../config/database";
import { OrderStore } from "../../models/Order";
import { ProductStore } from "../../models/Product";
import { UserStore } from "../../models/User";
import { OrderStatus } from "../../types/enums/order";
import { OrderedProduct } from "../../types/order";
import { UserReturnedType } from "../../types/user";

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

let user: UserReturnedType;
const products: OrderedProduct[] = [];

describe("Order Model", () => {
  describe("methods should be defined", () => {
    it("should have an index method", () => {
      expect(orderStore.index).toBeDefined();
    });
    it("should have a show method", () => {
      expect(orderStore.show).toBeDefined();
    });
    it("should have a showAllOrdersByUser method", () => {
      expect(orderStore.showAllOrdersByUser).toBeDefined();
    });
    it("should have a showCurrentOrderByUser method", () => {
      expect(orderStore.showCurrentOrderByUser).toBeDefined();
    });
    it("should have a create method", () => {
      expect(orderStore.create).toBeDefined();
    });
  });

  describe("Order model logic", () => {
    //create user
    beforeAll(async () => {
      user = await userStore.create({
        firstname: "ahmed",
        lastname: "anwar",
        username: "testorder123",
        password: "123456789",
      });

      const product1 = await productStore.create({
        name: "iphone 14",
        price: 18000,
        category: "phones",
      });
      const product2 = await productStore.create({
        name: "ipad air",
        price: 18000,
        category: "tablets",
      });

      products.push({ ...product1, quantity: 1 }, { ...product2, quantity: 2 });
    });

    afterAll(async () => {
      const conn = await client.connect();
      await conn.query(
        "DELETE FROM order_product;DELETE FROM orders;DELETE FROM users;DELETE FROM products;ALTER SEQUENCE users_id_seq RESTART WITH 1;ALTER SEQUENCE products_id_seq RESTART WITH 1;ALTER SEQUENCE orders_id_seq RESTART WITH 1;"
      );

      conn.release();
    });

    it("index should return an empty array", async () => {
      const orders = await orderStore.index();
      expect(orders).toEqual([]);
    });

    it("show should throw an error", async () => {
      await expectAsync(orderStore.show(0)).toBeRejected();
    });

    it("should create an order", async () => {
      const placedProducts = products.map((product) => {
        return {
          id: product.id,
          quantity: product.quantity,
        };
      });
      const order = await orderStore.create({
        products: placedProducts,
        status: OrderStatus.active,
        user_id: user.id,
      });

      expect(order).toEqual({
        id: 1,
        products: placedProducts,
        user_id: user.id,
        status: OrderStatus.active,
      });
    });
    it("should return current order by user", async () => {
      const placedProducts = products.map((product) => {
        return {
          id: product.id,
          quantity: product.quantity,
          name: product.name,
          price: product.price,
        };
      });

      const order = await orderStore.showCurrentOrderByUser(user.id);

      expect(order).toEqual({
        id: 1,
        products: placedProducts,
        user_id: user.id,
        status: OrderStatus.active,
      });
    });
  });
});
