module.exports = {
  routes: [
    {
      method: "POST",
      path: "/session",
      handler: "user-training.session",
      config: {
        auth: false,
      },
    },
  ],
};
