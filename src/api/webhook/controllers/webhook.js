const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  index: async ctx => {
    const sig = ctx.request.headers["stripe-signature"];
    const unparsedBody = ctx.request.body[Symbol.for("unparsedBody")];

    try {
      const event = stripe.webhooks.constructEvent(unparsedBody, sig, process.env.STRIPE_SIGNING_SECRET);

      if (event.type === "checkout.session.completed") {
        const sessionId = event.data.object.id;

        // patch the associated userTraining
        await strapi.db.query("api::user-training.user-training").update({
          where: { sessionId },
          data: {
            didUserPay: true,
          },
        });

        return ctx.send({ status: "success" });
      }

      return ctx.send({ status: "ignored" });
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      return ctx.send({ status: "error", error: error.message });
    }
  },
};
