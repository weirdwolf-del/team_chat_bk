const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const Leave = require("../models/Leave");
const Notice = require("../models/Notice");

// GET — fetch notifications for a user
// GET /notifications?userId=xxx&role=admin
router.get("/", async (req, res) => {
    try {
        const { userId, role } = req.query;

        // Yesterday, today, tomorrow
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

        const fmt = (d) => d.toISOString().slice(0, 10); // "2026-06-17"

        const dateRange = [fmt(yesterday), fmt(today), fmt(tomorrow)];

        // ── Leaves (yesterday/today/tomorrow) ─────────────────────────────
        const leaves = await Leave.find({
            startDate: {
                $gte: new Date(yesterday.setHours(0, 0, 0, 0)),
                $lte: new Date(tomorrow.setHours(23, 59, 59, 999)),
            },
            status: "approved",
        });

        // ── Notices (last 3 days) ─────────────────────────────────────────
        const notices = await Notice.find({
            createdAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
            },
        }).sort({ createdAt: -1 }).limit(10);

        // ── Build notification list ───────────────────────────────────────
        const notifications = [];

        leaves.forEach(l => {
            const start = fmt(new Date(l.startDate));
            const end = fmt(new Date(l.endDate));
            let when = "";
            if (start === fmt(new Date())) when = "today";
            else if (start === fmt(tomorrow)) when = "tomorrow";
            else if (start === fmt(yesterday)) when = "yesterday";

            // Admin sees all, user sees own
            if (role !== "admin" && l.employeeId !== userId) return;

            notifications.push({
                _id: l._id,
                type: "leave",
                title: when === "tomorrow"
                    ? `${l.employeeName} is on leave tomorrow`
                    : when === "today"
                        ? `${l.employeeName} is on leave today`
                        : `${l.employeeName} was on leave yesterday`,
                message: `${start === end ? start : `${start} → ${end}`} · ${l.reason}`,
                when,
                date: start,
                isRead: false,
                createdAt: l.updatedAt,
            });
        });

        notices.forEach(n => {
            notifications.push({
                _id: n._id,
                type: "notice",
                title: `📢 ${n.title}`,
                message: `${n.message} · By ${n.createdBy || "Admin"}`,
                when: "notice",
                date: fmt(new Date(n.createdAt)),
                isRead: false,
                createdAt: n.createdAt,
            });
        });

        // Sort by date desc
        notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH — mark all as read
// PATCH /notifications/read?userId=xxx
router.patch("/read", async (req, res) => {
    try {
        res.json({ success: true }); // frontend localStorage se handle karega
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;