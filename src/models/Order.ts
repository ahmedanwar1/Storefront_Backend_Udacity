import client from "../config/database";
import IStore from "../interfaces/IStore";
import { OrderStatus } from "../types/enums/order";
import { Order, OrderReturnedType, OrderedProduct } from "../types/order";
import AppError from "../utils/AppError";

export class OrderStore implements IStore<OrderReturnedType, Order> {
  //get all orders from all users
  async index(): Promise<OrderReturnedType[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const res = await conn.query(sql);
      conn.release();

      return res.rows;
      // return res.rows;
    } catch (err) {
      throw new AppError("Cannot get orders.", 500);
    }
  }

  //get a specific order by id
  async show(id: string | number): Promise<OrderReturnedType> {
    try {
      const conn = await client.connect();
      // const sql = "SELECT * FROM orders WHERE id=($1)";
      const sql =
        "SELECT user_id, product_id, order_id, products.name, products.price, order_product.quantity, orders.status FROM order_product INNER JOIN products ON products.id=order_product.product_id INNER JOIN orders ON orders.status='active' AND order_id=($1) AND orders.id=($1)";
      const res = await conn.query(sql, [id]);
      conn.release();

      const products: OrderedProduct[] = res.rows.map((product) => {
        return {
          id: product.product_id,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        };
      });

      return {
        id,
        user_id: res.rows[0]["user_id"],
        status: res.rows[0].status,
        products,
      };
    } catch (err) {
      throw new AppError("Cannot get order.", 500);
    }
  }

  //get all orders by a specific user
  async showAllOrdersByUser(
    userId: string | number
  ): Promise<OrderReturnedType[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1)";
      const res = await conn.query(sql, [userId]);
      conn.release();

      return res.rows;
    } catch (err) {
      throw new AppError("Cannot get orders.", 500);
    }
  }

  //get current order by a specific user
  async showCurrentOrderByUser(
    userId: string | number
  ): Promise<OrderReturnedType> {
    try {
      const conn = await client.connect();
      //get latest current order
      const orderSQL =
        "SELECT * FROM orders WHERE user_id=($1) AND status='active' ORDER BY id DESC LIMIT 1";
      const orderResult = await conn.query(orderSQL, [userId]);

      //get products details
      const productsSQL =
        "SELECT user_id, product_id, order_id, products.name, products.price, order_product.quantity, orders.status FROM order_product INNER JOIN products ON products.id=order_product.product_id INNER JOIN orders ON orders.status='active' AND order_id=($1) AND orders.id=($1)";
      const productsResult = await conn.query(productsSQL, [
        orderResult.rows[0].id,
      ]);
      conn.release();

      const products: OrderedProduct[] = productsResult.rows.map((product) => {
        return {
          id: product.product_id,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        };
      });

      return {
        id: orderResult.rows[0].id,
        user_id: orderResult.rows[0]["user_id"],
        status: orderResult.rows[0].status,
        products,
      };
    } catch (err) {
      throw new AppError("Cannot get order.", 500);
    }
  }

  //create an order
  async create(order: Order): Promise<OrderReturnedType> {
    try {
      const conn = await client.connect();

      //create an order
      const createOrderSQL =
        "INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *";
      const orderResult = await conn.query(createOrderSQL, [
        order.user_id,
        OrderStatus.active,
      ]);

      //get id of created order
      const orderId = orderResult.rows[0].id;

      //place products to corresponding order
      const assignProductToOrderSQL =
        "INSERT INTO order_product (product_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING *";

      const placedProducts: OrderedProduct[] = [];

      //insert each product into database
      for (const product of order.products) {
        const res = await conn.query(assignProductToOrderSQL, [
          product.id,
          orderId,
          product.quantity,
        ]);
        placedProducts.push({
          id: res.rows[0].product_id,
          quantity: res.rows[0].quantity,
        });
      }
      conn.release();

      return {
        id: orderResult.rows[0].id,
        products: placedProducts,
        user_id: orderResult.rows[0].user_id,
        status: orderResult.rows[0].status,
      };
    } catch (err) {
      throw new AppError("Cannot create order." + order.user_id + err, 500);
    }
  }
}
