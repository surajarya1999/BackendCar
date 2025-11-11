
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  
  dob: { type: Date },

  role: {
    type: String,
    enum: ["customer"],
    default: "customer",
  },
}, { timestamps: true });

module.exports = mongoose.model("user", customerSchema);
