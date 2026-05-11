const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  invoiceNo: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  status: { type: String, default: "Unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
