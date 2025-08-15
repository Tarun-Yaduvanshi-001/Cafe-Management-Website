import User from "../models/user.js";
import admin from "firebase-admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Define cookie options based on the environment
const cookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  secure: process.env.NODE_ENV === "development" ? false : true,
  sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      name,
      phone,
      password: hashPassword,
    });

    return res
      .status(201)
      .json({ message: "User successfully registered.", data: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during signup.", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    user.lastlogin = new Date();
    await user.save();

    const tokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(tokenPayload, config.auth.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful.",
      authenticated: true,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during login.", error: error.message });
  }
};

export const authenticateGoogleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = await User.create({ name: decoded.name, email: decoded.email });
    }

    user.lastlogin = new Date();
    await user.save();

    const tokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(tokenPayload, config.auth.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      authenticated: true,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Server error during Google authentication.",
        error: error.message,
      });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during logout.", error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ authenticated: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      authenticated: true,
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Server error during verification.",
        error: error.message,
      });
  }
};
