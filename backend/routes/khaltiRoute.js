const axios = require("axios");
const express = require('express');
const router = express.Router();
const { createNotification } = require('../notificationService');
require('dotenv').config();

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// Verify Khalti Payment
async function verifyKhaltiPayment(pidx) {
  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `https://a.khalti.com/api/v2/epayment/lookup/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  const response = await axios.request(reqOptions);
  return response.data;
}

// Initialize Khalti Payment
async function initializeKhaltiPayment(details) {
  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify(details);

  const reqOptions = {
    url: `https://a.khalti.com/api/v2/epayment/initiate/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  const response = await axios.request(reqOptions);
  return response.data;
}

// Init Payment Route
router.post("/payment", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const bookingData = await Booking.findById(bookingId);
    if (!bookingData) {
      return res.status(400).json({ success: false, message: "Booking not found" });
    }

    const paymentData = await Payment.create({
      booking: bookingId,
      paidtoId: bookingData.artistId,
      paidbyId: bookingData.hirerbyId,
      paymentMethod: "khalti",
      totalPrice: bookingData.price,
      Paidto: bookingData.artistName,
      For: bookingData.eventName,
    });

    const paymentInitiate = await initializeKhaltiPayment({
      amount: bookingData.price * 100, // Khalti requires paisa
      purchase_order_id: paymentData._id,
      purchase_order_name: bookingData.eventName,
      return_url: `http://localhost:3001/khalti/complete-khalti-payment`,
      website_url: "http://localhost:3000",
    });

    res.json({
      success: true,
      paymentData,
      payment: paymentInitiate,
    });
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete Khalti Payment Route
router.get("/complete-khalti-payment", async (req, res) => {
  const {
    pidx,
    txnId,
    amount,
    mobile,
    purchase_order_id,
    transaction_id,
  } = req.query;

  try {
    const paymentInfo = await verifyKhaltiPayment(pidx);

    // Validate
    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment verification",
        paymentInfo,
      });
    }

    // Update Payment
    const paymentDoc = await Payment.findByIdAndUpdate(
      purchase_order_id,
      { status: "completed" },
      { new: true }
    );

    if (!paymentDoc) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    // Update Booking
    const bookingDoc = await Booking.findByIdAndUpdate(
      paymentDoc.booking,
      { status: "paid" },
      { new: true }
    );

    if (!bookingDoc) {
      return res.status(404).json({ success: false, message: "Booking record not found" });
    }

    // Notifications
    await createNotification(
      bookingDoc.hirerbyId,
      `Your payment for "${bookingDoc.eventName}" has been completed`
    );

    await createNotification(
      bookingDoc.artistId,
      `A payment for "${bookingDoc.eventName}" has been completed`
    );

    // Success Redirect
    res.send(`
      <html>
        <head>
          <script type="text/javascript">
            window.location.href = "http://localhost:3000/payment";
          </script>
        </head>
        <body>
          <p>Payment Successful. Redirecting...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error completing payment:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while completing the payment",
      error: error.message,
    });
  }
});

module.exports = router;
