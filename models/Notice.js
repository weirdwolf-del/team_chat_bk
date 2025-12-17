const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: String }, // admin name / id
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);


