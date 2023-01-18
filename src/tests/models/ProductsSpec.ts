import { ProductStore } from "../../models/Product";
import client from "../../config/database";
import { ProductReturnedType } from "../../types/product";

const productStore = new ProductStore();

let product: ProductReturnedType;

describe("Product Model", () => {
  describe("methods should be defined", () => {
    it("should have an index method", () => {
      expect(productStore.index).toBeDefined();
    });
    it("should have a show method", () => {
      expect(productStore.show).toBeDefined();
    });
    it("should have a create method", () => {
      expect(productStore.create).toBeDefined();
    });
  });

  describe("Product model logic", () => {
    afterAll(async () => {
      const conn = await client.connect();
      await conn.query(
        "DELETE FROM order_product;DELETE FROM orders;DELETE FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;"
      );
      conn.release();
    });

    it("index should return an empty array", async () => {
      const myProducts = await productStore.index();
      expect(myProducts).toEqual([]);
    });

    it("show should throw an error", async () => {
      const myProduct = await productStore.show(0);
      expect(myProduct).toBeFalsy();
    });

    it("should create a product", async () => {
      product = await productStore.create({
        name: "iphone 14",
        price: 14000,
        category: "phones",
      });

      expect(product).toEqual({
        id: 1,
        name: "iphone 14",
        price: "14000",
        category: "phones",
      });
    });

    it("should return array contains the product with id 1", async () => {
      const myProducts = await productStore.index();

      expect(myProducts).toEqual([
        {
          id: 1,
          name: "iphone 14",
          price: "14000",
          category: "phones",
        },
      ]);
    });

    it("should return the product with id 1", async () => {
      const myProduct = await productStore.show(product.id);

      expect(myProduct).toEqual({
        id: 1,
        name: "iphone 14",
        price: "14000",
        category: "phones",
      });
    });
  });
});
