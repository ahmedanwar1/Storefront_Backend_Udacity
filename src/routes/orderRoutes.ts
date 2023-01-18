import express from "express";
import {
  createOrder,
  getAllOrderByUser,
  getAllOrders,
  getCurrentOrderByUser,
  getOrderById,
} from "../controllers/orderController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.route("/all").get(authenticate, getAllOrders);

router
  .route("/")
  .get(authenticate, getAllOrderByUser)
  .post(authenticate, createOrder);

router.route("/current/:userId").get(authenticate, getCurrentOrderByUser);

router.route("/:orderId").get(authenticate, getOrderById);

export default router;
