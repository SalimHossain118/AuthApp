/** @format */

import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/useeController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/createUser", createUser);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
