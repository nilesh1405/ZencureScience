import express from "express";
import {
  addEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  findEmployees,
  getAssignedCities,
} from "../Controllers/employee.Controller.js";

import {
  authorizeRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";

const employeeRouter = express.Router();

employeeRouter.use(protectedRoute);
employeeRouter.post(
  "/addEmployee",
  authorizeRoles("OWNER", "RBM", "ABM"),
  addEmployee,
);

employeeRouter.get(
  "/getAllEmployees",
  authorizeRoles("OWNER", "RBM", "ABM", "EMPLOYEE"),
  getAllEmployees,
);

employeeRouter.get(
  "/search",
  authorizeRoles("OWNER", "RBM", "ABM"),
  findEmployees,
);

employeeRouter.get(
  "/getAssignedCities",
  authorizeRoles("OWNER", "RBM", "ABM", "EMPLOYEE"),
  getAssignedCities,
);

employeeRouter.get(
  "/:id",
  authorizeRoles("OWNER", "RBM", "ABM"),
  getEmployeeById,
);

employeeRouter.put(
  "/:id",
  authorizeRoles("OWNER", "RBM", "ABM"),
  updateEmployee,
);

employeeRouter.delete(
  "/:id",
  authorizeRoles("OWNER", "RBM", "ABM"),
  deleteEmployee,
);

export default employeeRouter;
