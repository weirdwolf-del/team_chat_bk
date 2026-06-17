const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // recipient
    role: { type: String, default: "all" }, // "admin", "user", "all"
    type: { type: String, enum: ["leave", "notice", "attendance"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    refId: { type: String }, // leave/_id or notice/_id
    date: { type: String }, // "2026-06-17" — kis date se related hai
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);