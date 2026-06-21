import { Router } from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import {
  registerController,
  verifyEmailController,
  loginController,
  getMeController, 
} from "../controllers/auth.controller.js";
import { identifyUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerController);

authRouter.post("/login", loginValidator, loginController);

authRouter.get("/verify-email", verifyEmailController);

authRouter.get("/get-me", identifyUser, getMeController);

export default authRouter;
