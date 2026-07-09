import express from "express";
import authRouter from "./Routes/auth.Routes.js";
import employeeRouter from "./Routes/employee.Routes.js";
import doctorRouter from "./Routes/doctor.Routes.js";
import locationRoutes from "./Routes/location.Routes.js";
import productRouter from "./Routes/product.Routes.js";
import salesRouter from "./Routes/sales.Routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
console.log("CLIENT_URL =", process.env.CLIENT_URL);
app.use(
  cors({
    origin: "https://zencure-science.vercel.app",
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/company", employeeRouter);
app.use("/doctors", doctorRouter);
app.use("/products", productRouter);
app.use("/location", locationRoutes);
app.use("/sales", salesRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
