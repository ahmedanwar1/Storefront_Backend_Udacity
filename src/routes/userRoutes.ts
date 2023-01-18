import express from "express";
import {
  authenticateUser,
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.route("/").get(authenticate, getAllUsers).post(createUser);
router.route("/:id").get(authenticate, getUserById);

router.route("/authenticate").post(authenticateUser);

export default router;
