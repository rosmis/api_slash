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
  ],
};
