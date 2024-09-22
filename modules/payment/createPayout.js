import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// export const createWorkshopPayout = async (
//   amountInCents,
//   connectedAccountId
// ) => {
//   try {
//     const payout = await stripe.payouts.create(
//       {
//         amount: amountInCents,
//         currency: "usd",
//       },
//       {
//         stripeAccount: connectedAccountId,
//       }
//     );

//     console.log("Payout created:", payout);
//   } catch (error) {
//     console.error("Error creating payout:", error);
//   }
// };
export const createTransfer = async (amount, connectedAccountId) => {
  try {
    // Create a transfer
    const transfer = await stripe.transfers.create({
      amount: amount * 100, // Amount in cents
      currency: "usd", // Ensure this matches your balance currency
      destination: connectedAccountId, // Connected account ID
    });

    console.log("Transfer successful:", transfer);
    return transfer;
  } catch (error) {
    console.error("Error creating transfer:", error);
    throw error;
  }
};
