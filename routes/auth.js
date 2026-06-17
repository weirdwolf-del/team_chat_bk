const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register
router.post("/register", async (req, res) => {
  const { name,
    username,
    email,
    mobile,
    password,
    department,
    designation,
    joiningDate,
    salary } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, username, email, mobile, password: hashedPassword, department, designation, joiningDate, salary });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
//all registered users
router.get("/employees", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
//Employee count
router.get("/employee-count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /auth/update/:userId
router.put("/update/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { salary, designation } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { salary, designation } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        salary: updatedUser.salary,
        designation: updatedUser.designation,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
