const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Bookings", required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  email: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("feedback", feedbackSchema);
