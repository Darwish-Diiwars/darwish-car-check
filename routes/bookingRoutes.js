const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const sendEmail = require("../utils/sendEmail");
module.exports = router;
// SHOW BOOKING PAGE
router.get("/book", async (req, res) => {
  try {
    const availableSlots = await Slot.find({ isBooked: false });
    res.render("booking", { slots: availableSlots });
  } catch (error) {
    console.log(error);
    res.send("Error loading booking page");
  }
});

// SAVE BOOKING
router.post("/book", async (req, res) => {
  try {

    const {
      carType,
      brand,
      model,
      year,
      transmission,
      kilometer,
      governorate,
      area,
      address,
      mapLink,
      fullName,
      phone,
      whatsapp,
      email,
      uvCheck,
      slotId
    } = req.body;

    // PRICE CALCULATION
    let totalPrice = 0;

    if (carType === "used") totalPrice = 1000;
    if (carType === "new") totalPrice = 1200;
    if (uvCheck === "on") totalPrice += 600;

    // CHECK SLOT
    const selectedSlot = await Slot.findById(slotId);

    if (!selectedSlot || selectedSlot.isBooked) {
      return res.send("Slot not available ❌");
    }

    // MARK SLOT AS BOOKED
    selectedSlot.isBooked = true;
    await selectedSlot.save();

    // CREATE BOOKING
    const newBooking = new Booking({
      carType,
      brand,
      model,
      year,
      transmission,
      kilometer,
      governorate,
      area,
      address,
      mapLink,
      fullName,
      phone,
      whatsapp,
      email,
      uvCheck: uvCheck === "on",
      totalPrice,
      slotDate: selectedSlot.date,
      slotTime: selectedSlot.time
    });

    await newBooking.save();
    // SEND EMAIL TO CUSTOMER
    await sendEmail(
    email,
    "Booking Confirmation - Darwish Car Check",
    `
    <h2>Booking Confirmed ✅</h2>
    <p>Dear ${fullName},</p>
    <p>Your inspection is scheduled for:</p>
    <p><strong>${selectedSlot.date} at ${selectedSlot.time}</strong></p>
    <p>Total Price: ${totalPrice} EGP</p>
    <br>
    <p>We will contact you shortly.</p>
    `
    );

    // SEND EMAIL TO ADMIN
    await sendEmail(
    process.env.EMAIL_USER,
    "New Booking Received 🚗",
    `
    <h2>New Booking</h2>
    <p>Name: ${fullName}</p>
    <p>Phone: ${phone}</p>
    <p>Date: ${selectedSlot.date}</p>
    <p>Time: ${selectedSlot.time}</p>
    <p>Total: ${totalPrice} EGP</p>
    `
    );

        res.send("Booking submitted successfully ✅");

    } catch (error) {
        console.log(error);
        res.send("Error saving booking ❌");
    }
    });

module.exports = router;