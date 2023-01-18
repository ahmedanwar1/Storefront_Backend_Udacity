import client from "../config/database";
import IStore from "../interfaces/IStore";
import { ProductReturnedType, Product } from "../types/product";
import AppError from "../utils/AppError";

export class ProductStore implements IStore<ProductReturnedType, Product> {
  async index(): Promise<ProductReturnedType[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products";
      const res = await conn.query(sql);
      conn.release();

      return res.rows;
    } catch (err) {
      throw new AppError("Cannot get products.", 500);
    }
  }
  async show(id: string | number): Promise<ProductReturnedType> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE id=($1)";
      const res = await conn.query(sql, [id]);
      conn.release();

      return res.rows[0];
    } catch (err) {
      throw new AppError("Cannot get product.", 500);
    }
  }
  async create(product: Product): Promise<ProductReturnedType> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO products (name, price, category) VALUES ($1, $2, $3)  RETURNING *";

      const res = await conn.query(sql, [
        product.name,
        product.price,
        product.category,
      ]);
      conn.release();

      return res.rows[0];
    } catch (err) {
      throw new AppError("Cannot create product.", 500);
    }
  }

  //get products by category
  async indexByCategory(category: string): Promise<ProductReturnedType[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE category=($1)";
      const res = await conn.query(sql, [category]);
      conn.release();

      return res.rows;
    } catch (err) {
      throw new AppError("Cannot get products.", 500);
    }
  }
}
