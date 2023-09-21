module.exports = {
  async afterCreate(event) {
    // Connected to "Save" button in admin panel
    const { result } = event;

    try {
      console.log("result", result);

      //TODO fix this shit dunno why i used axios in backend

      // const training = await axios.get(
      //     `http://localhost:1337/api/trainings/${+result.trainingId}`,
      //     {
      //         headers: {
      //             Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      //             "Content-Type": "application/json",
      //             },
      //     }
      // )

      console.log("training", training.data.data.attributes.title);

      await strapi.plugins["email"].services.email.send({
        to: "maxence.lehee@skilder.fr",
        from: "rosmis123@gmail.com", // e.g. single sender verification in SendGrid
        template_id: "d-26ece53af37d4eb2bc8caff454d28d9b",
        dynamicTemplateData: {
          trainingTitle: training.data.data.attributes.title,
          trainingDuration: training.data.data.attributes.duration,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};
