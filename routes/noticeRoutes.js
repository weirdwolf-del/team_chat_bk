const express = require("express");
const Notice = require("../models/Notice");

const router = express.Router();

/* 🔹 Create Notice (Admin only) */
router.post("/", async (req, res) => {
  try {
    const { title, message, createdBy } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const notice = await Notice.create({ title, message, createdBy });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* 🔹 Get All Notices */
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
