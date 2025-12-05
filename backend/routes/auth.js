import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 🧩 Helper to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🧑‍🎓 Student Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 Login (Student or Admin)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 👩‍🏫 Create default admin if not exists
// 👩‍🏫 Create default admin if not exists (idempotent)
router.get("/create-admin", async (req, res) => {
  try {
    const email = "admin@exam.com";

    // check by email (more reliable than role)
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ message: "Admin already exists" });
    }

    const admin = new User({
      name: "Admin",
      email,
      password: "admin123",
      role: "Admin",
    });

    await admin.save(); // triggers bcrypt hash in pre-save hook
    return res.json({
      message: "Admin created",
      admin: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error("Create-admin error:", err);               // <— log cause
    return res.status(500).json({ message: "Error creating admin", error: err.message });
  }
});


export default router;
