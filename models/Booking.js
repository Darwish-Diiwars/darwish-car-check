const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  carType: {
    type: String,
    enum: ["used", "new"],
    required: true
  },

  brand: String,
  model: String,
  year: Number,
  transmission: String,
  kilometer: Number,

  governorate: String,
  area: String,
  address: String,
  mapLink: String,

  fullName: String,
  phone: String,
  whatsapp: String,
  email: String,

  uvCheck: {
    type: Boolean,
    default: false
  },

  totalPrice: Number,

  slotDate: Date,
  slotTime: String,

  status: {
    type: String,
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);