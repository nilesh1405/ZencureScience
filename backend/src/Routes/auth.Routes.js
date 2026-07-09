import express from "express";
import {
  login,
  logout,
  addUser,
  updatepassword,
} from "../Controllers/auth.Controller.js";

import { arcjetMiddleware } from "../middlewares/arcjet.middleware.js";
import {
  protectedRoute,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.use(arcjetMiddleware);
authRouter.post("/login", login);

authRouter.post("/logout", protectedRoute, logout);

authRouter.put("/updatepassword", protectedRoute, updatepassword);

authRouter.post("/addUser", protectedRoute, addUser);

export default authRouter;
