const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
    async afterCreate(data) {
        const { result: trainingResult } = data;

        const decimalTrainingPrice = trainingResult.price * 100;

        console.log("trainingResult", trainingResult);

        // create stripe product
        const stripeProduct = await stripe.products.create({
            name: trainingResult.title,
            type: "service",
            tax_code: "txcd_10000000",
        });

        // create stripe price
        const stripePrice = await stripe.prices.create({
            billing_scheme: "per_unit",
            unit_amount_decimal: decimalTrainingPrice.toString(),
            tax_behavior: "unspecified",
            product: stripeProduct.id,
            currency: "eur",
        });

        // bind stripePriceId to stripeProductId
        await stripe.products.update(stripeProduct.id, {
            default_price: stripePrice.id,
        });

        // update the training entry with the stripe priceId
        await strapi.entityService.update("api::training.training", trainingResult.id, {
            data: {
                priceId: stripePrice.id,
            },
        });
    },
};
