const express = require("express");
const users = require("../data/users");
const { generateFakeToken } = require("../utils/fakeToken");
const { auth, role } = require("../middleware/auth.middleware");
const router = express.Router();
const db = require("../../db");

// SIGN UP (fake, simpan ke array)
router.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);

    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    db.prepare(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, 'user')`,
    ).run(name, email, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db
    .prepare(
      `
    SELECT id, name, email, role
    FROM users
    WHERE email = ? AND password = ?
  `,
    )
    .get(email, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    data: {
      user,
      token: `fake-jwt-${user.id}`,
    },
  });
});

const generateResetToken = require("../utils/resetToken");
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  console.log({user});

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = generateResetToken();
  const resetTokenExp = Date.now() + 15 * 60 * 1000;

  db.prepare(
    `
    UPDATE users
    SET resetToken = ?, resetTokenExp = ?
    WHERE id = ?
  `,
  ).run(resetToken, resetTokenExp, user.id);

  res.json({
    message: "Reset password token generated (fake)",
    data: {
      resetToken,
      expiresIn: "15 minutes",
      resetUrl: `http://localhost:3000/reset-password?token=${resetToken}`,
    },
  });
});

router.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body;

  const user = db
    .prepare(
      `
    SELECT * FROM users
    WHERE resetToken = ?
      AND resetTokenExp > ?
  `,
    )
    .get(token, Date.now());

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }

  db.prepare(
    `
    UPDATE users
    SET password = ?, resetToken = NULL, resetTokenExp = NULL
    WHERE id = ?
  `,
  ).run(newPassword, user.id);

  res.json({
    message: "Password reset successful",
  });
});

router.get("/me", auth, (req, res) => {
  res.json({
    message: "Authenticated user",
    user: req.user,
  });
});

// ADMIN ONLY
router.get("/admin", auth, role(["admin"]), (req, res) => {
  res.json({
    message: "Welcome admin",
  });
});

module.exports = router;
