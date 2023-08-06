const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

("use strict");

/**
 * user-training controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::user-training.user-training", ({ strapi }) => ({
  async session(ctx) {
    const { trainingId, priceId } = ctx.request.body;
    const baseUrl = process.env.VITE_FRONT_BASE_URL;
    const redirectionUrl = `${baseUrl}/training/${trainingId}`;

    try {
      // create stripe session
      const session = await stripe.checkout.sessions.create({
        cancel_url: redirectionUrl,
        success_url: redirectionUrl,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
      });

      return ctx.send({ session });
    } catch (error) {
      console.error(error);
      return ctx.send({ status: "error", error: error.message });
    }
  },
}));
