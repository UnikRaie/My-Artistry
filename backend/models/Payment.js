const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  paidtoId:{ type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  paidbyId:{ type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  For:{type: String , required: true},
  Paidto:{type: String, required: true},
  totalPrice: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ["khalti"], required: true },
  status: { type: String, enum: ["pending", "completed", "refunded"], default: "pending" },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;