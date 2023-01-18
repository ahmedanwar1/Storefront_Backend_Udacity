import express from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";

const router = express.Router();

//user routes
router.use("/users", userRoutes);

//product routes
router.use("/products", productRoutes);

//order routes
router.use("/orders", orderRoutes);

export default router;
