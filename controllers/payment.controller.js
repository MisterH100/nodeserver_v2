import Stripe from "stripe";

//TODO
export const makePayment = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const items = req.body.products;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => {
        return {
          price_data: {
            currency: "zar",
            product_data: {
              name: item.name,
              images: item.images,
              description: item.description,
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        };
      }),
      success_url: "http://localhost:8000",
      cancel_url: "http://localhost:8000",
    });

    res.status(200).json({
      client_secret: session.url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
