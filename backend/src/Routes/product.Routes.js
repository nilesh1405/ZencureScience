import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  search,
} from "../Controllers/products.Controller.js";
import {
  authorizeRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
const productRouter = express.Router();

productRouter.use(protectedRoute);
productRouter.post("/addProduct", authorizeRoles("OWNER", "RBM"), addProduct);
productRouter.get("/getAllProducts", getProducts);
productRouter.get("/search", search);
productRouter.put("/:id", authorizeRoles("OWNER", "RBM"), updateProduct);
productRouter.delete("/:id", authorizeRoles("OWNER", "RBM"), deleteProduct);

export default productRouter;
