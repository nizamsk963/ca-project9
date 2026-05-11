const mongoose = require("mongoose");

const gstRecordSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  gstin: String,
  period: { type: String, required: true },
  returnType: { type: String, default: "GSTR-3B" },
  dueDate: String,
  status: { type: String, default: "Pending" },
  taxAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("GstRecord", gstRecordSchema);
