const express = require("express");
const Attendance = require("../models/Attendance.js");
const AttendanceLog = require("../models/AttendanceLog.js");

const router = express.Router();

// ✅ POST route to save attendance (check-in & check-out)
router.post("/", async (req, res) => {
  try {
    const { userId, name, date, duration, checkInTime, checkOutTime } = req.body;
    console.log("📥 Attendance data received:", req.body);

    if (!userId || !name || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check if same user already has a record for this date
    let record = await Attendance.findOne({ userId, date });

    if (record) {
      // ✅ append new duration in array (if exists)
      if (duration) {
        record.durations.push(duration);
      }

      // Set check-in only if not already set
      if (!record.checkInTime && checkInTime) {
        record.checkInTime = checkInTime;
    }
      // update times if needed
      //record.checkInTime = record.checkInTime || checkInTime;
      record.checkOutTime = checkOutTime || record.checkOutTime;

      await record.save();
      return res.json({ message: "Duration added to existing record", record });
    }

    // ✅ create new attendance record
    const newRecord = await Attendance.create({
      userId,
      name,
      date,
      checkInTime,
      checkOutTime,
      durations: duration ? [duration] : [],
    });

    res.json({ message: "Attendance saved successfully", record: newRecord });
  } catch (err) {
    //console.error("❌ Error saving attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all attendance records (for admin)
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👇 Check-in only log (does NOT affect checkout system)
router.post("/checkin-log", async (req, res) => {
  try {
    const { userId, name, date, checkInTime } = req.body;

    if (!userId || !date) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // prevent duplicate check-in for same day
    const already = await AttendanceLog.findOne({
      userId,
      date
    });

    if (already) {
      return res.status(200).json({
        message: "Already checked in today"
      });
    }

    const log = await AttendanceLog.create({
      userId,
      name,
      date,
      checkInTime
    });

    res.json({
      success: true,
      log
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});
// 👇 Get today's present employees + count
router.get("/checkin-log/today", async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-GB");

    // get all present employees today
    const records = await AttendanceLog.find({ date: today });

    res.json({
      success: true,
      count: records.length,
      data: records
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
