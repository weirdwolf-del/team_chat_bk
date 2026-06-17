const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");

// ---------------------------
// Apply leave (employee)
// POST /api/leave/apply
// ---------------------------
router.post("/apply", async (req, res) => {
  try {
    const { employeeId, employeeName, startDate, endDate, reason } = req.body;

    if (!employeeId || !employeeName || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = new Leave({ employeeId, employeeName, startDate, endDate, reason });
    await leave.save();

    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// Get leaves
// GET /api/leave?userId=123&role=employee
// ---------------------------
router.get("/", async (req, res) => {
  try {
    const { userId, role } = req.query;

    let leaves;
    if (role === "admin") {
      leaves = await Leave.find().sort({ createdAt: -1 });
    } else {
      leaves = await Leave.find({ employeeId: userId }).sort({ createdAt: -1 });
    }

    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// Update leave status (admin)
// PUT /api/leave/:id
// ---------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "denied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
