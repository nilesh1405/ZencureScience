import express from "express";
import {
  addDoctor,
  deleteDoctor,
  getAllDoctors,
  findDoctors,
  updateDoctor,
  getUpcomingEvents,
} from "../Controllers/doctor.controller.js";
import {
  authorizeRoles,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
const doctorRouter = express.Router();

doctorRouter.use(protectedRoute);

doctorRouter.post(
  "/addDoctor",
  authorizeRoles("EMPLOYEE", "ABM", "RBM"),
  addDoctor,
);
doctorRouter.get("/getAllDoctors", getAllDoctors);
doctorRouter.get("/search", findDoctors);
doctorRouter.get("/getUpcomingEvents", getUpcomingEvents);
doctorRouter.put("/:id", authorizeRoles("EMPLOYEE"), updateDoctor);
doctorRouter.delete("/:id", authorizeRoles("OWNER"), deleteDoctor);
export default doctorRouter;
