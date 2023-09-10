module.exports = {
  routes: [
    {
      method: "POST",
      path: "/webhook",
      handler: "webhook.index",
      config: {
        auth: false,
      },
    },

    {
      method: "POST",
      path: "/webhook/express",
      handler: "webhook.createExpressAcount",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/webhook/status/:id",
      handler: "webhook.checkUserStripeAccountStatus",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/webhook/users",
      handler: "webhook.getAllSupabaseUsers",
      config: {
        auth: false,
      },
    },
  ],
};
