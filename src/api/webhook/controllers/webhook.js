const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

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

  createExpressAcount: async ctx => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const unparsedBody = ctx.request.body[Symbol.for("unparsedBody")];

    const { userId } = JSON.parse(unparsedBody);

    try {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (authError) console.error(authError);

      // 1.check if user's uuid provided exists AND has did_user_fill_credit_infos set to false

      const { data: userInfos } = await supabase.from("profiles").select("*").eq("id", userId);

      if (authUser && userInfos[0].did_user_fill_credit_infos === false) {
        const userEmail = authUser.user.email;
        // 2.create an Express account and prefill information

        const account = await stripe.accounts.create({
          country: "FR",
          type: "express",
          email: userEmail,
          capabilities: {
            card_payments: {
              requested: true,
            },
            transfers: {
              requested: true,
            },
          },
          business_type: "individual",
        });

        // 3.Create an account link and return that account link url to frontend

        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.VITE_FRONT_BASE_URL}/account`,
          return_url: `${process.env.VITE_FRONT_BASE_URL}/account`,
          type: "account_onboarding",
        });

        const redirectionUrl = accountLink.url;

        // 4.Update the trainer type with the stripeAccountId to retrieve it later in frontend to check if user has correctly filled his credit infos

        await strapi.db.query("api::trainer.trainer").update({
          where: { userId },
          data: {
            stripeAccountId: account.id,
          },
        });

        return ctx.send({ status: "success", redirectionUrl });
      }

      return ctx.send({ status: "error", error: error.message });
    } catch (error) {
      console.error(error);
    }
  },
};
