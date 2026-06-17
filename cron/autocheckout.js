const cron = require("node-cron");
const Attendance = require("../models/Attendance");

const autoCheckout = () => {
    // Har din 8:00 PM par run hoga
    cron.schedule("0 20 * * *", async () => {
        try {
            console.log("⏰ Auto checkout cron running...");

            const today = new Date().toISOString().slice(0, 10); // "2026-06-17"

            // Jin records mein aaj checkin hua but checkout nahi hua
            const missedRecords = await Attendance.find({
                date: today,
                $or: [
                    { checkOutTime: null },
                    { checkOutTime: "" },
                    { checkOutTime: { $exists: false } },
                ]
            });

            console.log(`Found ${missedRecords.length} missed checkouts`);

            for (const record of missedRecords) {
                const totalMinutes = 9 * 60; // standard 9 hours

                await Attendance.findByIdAndUpdate(record._id, {
                    checkOutTime: "7:00:00 PM",
                    totalMinutes,
                    durations: ["9h 0m"],
                    autoCheckout: true, // flag — admin ko pata chale
                });

                console.log(`✅ Auto checkout: ${record.name} — ${today}`);
            }

        } catch (err) {
            console.error("❌ Auto checkout cron error:", err);
        }
    }, {
        timezone: "Asia/Kolkata" // IST
    });
};

module.exports = autoCheckout;