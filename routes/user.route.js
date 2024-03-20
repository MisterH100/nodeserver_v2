import express from "express";
import {
  LoginUser,
  LogoutUser,
  RegisterUser,
  updateUser,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);
router.post("/update", protectRoute, updateUser);

export default router;
