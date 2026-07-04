import User from "../Models/User.Models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    const existinguser = await User.findOne({ username });
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
    });
    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id, savedUser.role, res);
      res.status(201).json({
        id: savedUser._id,
        username: savedUser.username,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in addUser controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "invalid Credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user._id, user.role, res);
    return res.status(200).json({
      id: user._id,
      username: username,
      role: user.role,
      employeeId: user.employeeId,
      message: "Login Successful",
    });
  } catch (error) {
    console.log("Error in login controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out successfully" });
};
