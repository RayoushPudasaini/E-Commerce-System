require("dotenv").config();

const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/order");

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, response) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
    },
  });
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image.url],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: { allowed_countries: ["US", "CA", "NP"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],

    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,

    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  response.send({ url: session.url });
});

//create order

// const createOrder = async (customer, data, lineItems) => {
//   const newOrder = new Order({
//     userId: customer.metadata.userId,
//     customerId: data.customer,
//     paymentIntentId: data.payment_intent,
//     products: lineItems.data,
//     subtotal: data.amount_subtotal,
//     total: data.amount_total,
//     shipping: data.customer_details,
//     payment_status: data.payment_status,
//   });

//   try {
//     const savedOrder = await newOrder.save();

//     // res.status(200).json(savedOrder);
//     console.log("Processed order:", savedOrder);
//   } catch (err) {
//     console.log(err.message);
//   }
// };

const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const products = Items.map((item) => {
    return {
      productId: item.id,
      quantity: item.cartQuantity,
    };
  });

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.

let endpointSecret;
endpointSecret =
  "whsec_c4a3ac07bd76cd45af62fcb7912bd44d31e4cffc71d0cf1b649c44c36477d250";

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  (req, response) => {
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("webhook verified.");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);

        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;

      // console.log("event", event);
      // console.log("if wala data", data);
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
      ////
      // console.log("else wala data", data);
    }

    //handle the event
    // if (eventType === "checkout.session.completed") {
    //   // console.log("checkout.session.completed", data);
    //   // console.log("--------------------");
    //   stripe.customers
    //     .retrieve(data.customer)
    //     .then((customer) => {
    //       console.log(stripe.checkout.sessions, "stripe checkout sessions");
    //       stripe.checkout.sessions.listLineItems(
    //         data.id,
    //         {},
    //         function (err, lineItems) {
    //           console.log("line_items", lineItems);

    //           createOrder(customer, data, lineItems);
    //         }
    //       );

    //       createOrder(customer, data);
    //     })
    //     .catch((err) => {
    //       console.log(err.message);
    //     });
    // }
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            createOrder(customer, data);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    // Return a 200 response to acknowledge receipt of the event
    response.status(200).json("OK");
  }
);

module.exports = router;
