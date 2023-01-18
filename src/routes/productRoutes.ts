import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productControlller";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.route("/").get(getAllProducts).post(authenticate, createProduct);
router.route("/:id").get(getProductById);

export default router;
