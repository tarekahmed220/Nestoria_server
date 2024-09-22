import Stripe from "stripe";
import catchAsync from "../../handleErrors/catchAsync.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
console.log("stripe", stripe);
const handlePayment = catchAsync(async (req, res) => {
  console.log("req.body", req.body);
  const { amount } = req.body;
  console.log("Amount received:", amount);

  try {
    // Create a payment intent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to smallest currency unit (e.g., cents for USD)
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { handlePayment };
