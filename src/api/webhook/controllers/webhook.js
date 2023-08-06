const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  index: async ctx => {
    const sig = ctx.request.headers["stripe-signature"];
    const unparsedBody = ctx.request.body[Symbol.for("unparsedBody")];

    try {
      const event = stripe.webhooks.constructEvent(unparsedBody, sig, process.env.STRIPE_SIGNING_SECRET);
      console.log("event", event);

      if (event.type === "charge.succeeded") {
        // Process the successful charge event here if needed
        // You can perform any necessary database updates, notifications, etc.

        // Respond with "success" status
        console.log("user paid");
        return ctx.send({ status: "success" });
      }

      // Respond to other events if needed
      console.log("user didnt pay yet");
      return ctx.send({ status: "ignored" });
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      return ctx.send({ status: "error", error: error.message });
    }
  },
};
