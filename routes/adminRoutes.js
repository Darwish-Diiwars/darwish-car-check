const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const protectAdmin = require("../middleware/authMiddleware");

// LOGIN PAGE
router.get("/admin/login", (req, res) => {
  res.render("admin-login");
});

// LOGIN LOGIC
router.post("/admin/login", async (req, res) => {

  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) return res.send("Invalid credentials");

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) return res.send("Invalid credentials");

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

  res.cookie("adminToken", token);
  res.redirect("/admin/dashboard");
});

// DASHBOARD
router.get("/admin/dashboard", protectAdmin, async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });

  let totalRevenue = 0;
  bookings.forEach(b => totalRevenue += b.totalPrice);

  res.render("admin-dashboard", { bookings, totalRevenue });
});

// CONFIRM BOOKING
router.get("/admin/confirm/:id", protectAdmin, async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: "confirmed" });

  res.redirect("/admin/dashboard");
});

// CANCEL BOOKING
router.get("/admin/cancel/:id", protectAdmin, async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  await Slot.updateOne(
    { date: booking.slotDate, time: booking.slotTime },
    { isBooked: false }
  );

  booking.status = "cancelled";
  await booking.save();

  res.redirect("/admin/dashboard");
});

module.exports = router;
router.get("/admin/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.redirect("/admin/login");
});