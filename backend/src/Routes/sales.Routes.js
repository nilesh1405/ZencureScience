import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
} from "../Controllers/sales.Controller.js";

import {
  authorizeRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";

const salesRouter = express.Router();

salesRouter.use(protectedRoute);
salesRouter.post(
  "/addSale",
  authorizeRoles("OWNER", "RBM", "ABM", "EMPLOYEE"),
  createSale,
);
salesRouter.get(
  "/getSales",
  authorizeRoles("OWNER", "RBM", "ABM", "EMPLOYEE"),
  getSales,
);

salesRouter.get(
  "/getSales/:id",
  authorizeRoles("OWNER", "RBM", "ABM", "EMPLOYEE"),
  getSaleById,
);

export default salesRouter;
