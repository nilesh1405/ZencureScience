import jwt from "jsonwebtoken";
import User from "../Models/User.Models.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId)
      .populate("employeeId")
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    if (!roles.includes(user.role)) {
      return res
        .status(401)
        .json({
          message: `Role (${req.user.role}) is not allowed to access this resource`,
        });
    }
    next();
  };
};
