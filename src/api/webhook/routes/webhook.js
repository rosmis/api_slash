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
  ],
};
