const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  gst: String,
  pan: String,
  businessName: String,
  address: String,
  status: { type: String, default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);
