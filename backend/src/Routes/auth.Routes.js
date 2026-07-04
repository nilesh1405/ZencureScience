import express from "express";
import { login, logout, addUser } from "../Controllers/auth.Controller.js";
import { arcjetMiddleware } from "../middlewares/arcjet.middleware.js";
import {
  authorizeRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
const authRouter = express.Router();

// authRouter.use(arcjetMiddleware);
// authRouter.use(protectedRoute);
authRouter.post("/addUser", addUser);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
export default authRouter;
