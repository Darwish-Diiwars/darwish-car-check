require("dotenv").config();
const mongoose = require("mongoose");
const Slot = require("./models/Slot");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

  const slots = [
    { date: "2026-03-01", time: "10:00 AM" },
    { date: "2026-03-01", time: "12:00 PM" },
    { date: "2026-03-01", time: "02:00 PM" },
    { date: "2026-03-02", time: "10:00 AM" },
    { date: "2026-03-02", time: "01:00 PM" }
  ];

  await Slot.insertMany(slots);
  console.log("Slots Created ✅");
  process.exit();

});