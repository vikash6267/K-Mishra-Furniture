const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/process", async (req, res) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: {
        company: "KMISHRA Enterprises",
      },
    });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  } catch (error) {
    console.error("Stripe Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message,
    });
  }
});


module.exports = router;
