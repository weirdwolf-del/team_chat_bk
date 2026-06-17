const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: String,

  name: String,

  date: String,

  checkInTime: String,

  checkOutTime: String,

  durations: { type: [String], default: [] }, // array to store multiple durations in minutes

  totalMinutes: {
    required: false,
    type: Number,
    default: 0
  },

  overtimeMinutes: {
    required: false,
    type: Number,
    default: 0
  },
  
  autoCheckout: { type: Boolean, default: false }


});
module.exports = mongoose.model("Attendance", attendanceSchema);
