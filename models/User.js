const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  mobile: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  employeeId: {
    type: String,
    unique: true
  },

  department: {
    type: String,
    default: ""
  },

  designation: {
    type: String,
    default: ""
  },

  joiningDate: {
    type: Date
  },

  salary: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
