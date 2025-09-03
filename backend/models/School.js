// backend/models/School.js
const mongoose = require("mongoose");

// we keep contact as String to preserve leading zeros + simple validation
const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    contact: {
      type: String,
      // simple 10-digit check; feel free to relax it
      match: [/^\d{10}$/, "Contact must be a 10 digit number"],
    },
    image: { type: String }, // we store only the filename, not the binary
    description:{type:String,trim:true},
    email_id: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("School", schoolSchema);
