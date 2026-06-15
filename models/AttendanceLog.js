const mongoose = require("mongoose");

const attendanceLogSchema = new mongoose.Schema({
    userId: String,
    name: String,
    date: String,
    checkInTime: String
});

module.exports = mongoose.model(
    "AttendanceLog",
    attendanceLogSchema
);