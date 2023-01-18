import express from "express";
import ExpressRequestWithUserInfo from "../interfaces/ExpressRequestWithUserInfo";
import { OrderStore } from "../models/Order";
import { OrderStatus } from "../types/enums/order";
import { OrderedProduct, OrderReturnedType } from "../types/order";
import AppError from "../utils/AppError";

const orderStore = new OrderStore();

//get all orders
const getAllOrders = async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let orders: OrderReturnedType[] = [];

    orders = await orderStore.index();

    if (orders.length == 0) {
      return res.status(404).json(orders);
    }

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

//get a specific order by id
const getOrderById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const orderId: string = req.params.orderId;

    const order: OrderReturnedType = await orderStore.show(orderId);

    if (!order) {
      return res.status(404).json(order);
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

//get all orders by user
const getAllOrderByUser = async (
  req: ExpressRequestWithUserInfo,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const userId: number | undefined = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized user.", 401);
    }

    const orders: OrderReturnedType[] = await orderStore.showAllOrdersByUser(
      userId
    );

    if (orders.length == 0) {
      return res.status(404).json(orders);
    }

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

//get current order by user
const getCurrentOrderByUser = async (
  req: ExpressRequestWithUserInfo,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const userId: number = parseInt(req.params.userId);

    if (!userId) {
      throw new AppError("Unauthorized user.", 401);
    }

    const order: OrderReturnedType = await orderStore.showCurrentOrderByUser(
      userId
    );

    if (!order) {
      return res.status(404).json(order);
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

//create order
const createOrder = async (
  req: ExpressRequestWithUserInfo,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const products: OrderedProduct[] = req.body.products;
    const userId: number | undefined = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized user.", 401);
    }

    const order = await orderStore.create({
      products,
      status: OrderStatus.active,
      user_id: userId,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export {
  getAllOrders,
  createOrder,
  getOrderById,
  getAllOrderByUser,
  getCurrentOrderByUser,
};
