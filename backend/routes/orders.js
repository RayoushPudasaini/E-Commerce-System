const { Order } = require("../models/order");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const router = require("express").Router();
const transporter = require("../config/emailConfig");
const { Product } = require("../models/product");

//order in cash on delivery
router.post("/cash-on-delivery", auth, async (req, res) => {
  try {
    const orderData = {
      userId: req.user._id,
      customerId:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      paymentIntentId:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      products: req.body.products,
      subtotal: req.body.total,
      total: req.body.total,
      shipping: {
        address: {
          city: req.body.city,
          country: "nepal",
          state: req.body.state,
          postal_code: "44600",
          line1: "kathmandu",
          line2: "",
        },
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        tax_exempt: "none",
        tax_ids: [],
      },
      delivery_status: "dispatched",
      payment_status: "paid",
    };
    const order = new Order(orderData);

    const products = await Product.find({
      _id: { $in: req.body.products.map((item) => item.productId) },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: req.body.email,
      subject: "Order Details",
      html: `
                <h1>Order Details</h1>
                <h3>Order Id: ${order._id}</h3>
                <h3>Order Date: ${moment(order.createdAt).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}</h3>
                <h3> Total Amount: ${order.total}</h3>
                <h3>Order Status: ${order.delivery_status}</h3>
                <h3>Order Payment Status: ${order.payment_status}</h3>
                <h3>Order Products: </h3>
                ${products.map(
                  (p) =>
                    `<div style={{
                      marginBotton: "10px",
                    }}>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Brand: ${p.brand}</h3>
                        <img src=${p.image.url} alt=${p.name} width="100px" height="100px" />
                        </div>`
                )}
                <h2>Order Shipping Address: </h2>
                <h3>City: ${order.shipping.address.city}</h3>
                <h3>Postal Code: ${order.shipping.address.postal_code}</h3>
                <h3>Name: ${order.shipping.name}</h3>
                <h3>Phone: ${order.shipping.phone}</h3>
                <h3>Email: ${order.shipping.email}</h3>
                `,
    });
    await order.save();
    await order.populate("products.productId");
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//get orders by user
router.get("/user-orders", auth, async (req, res) => {
  try {
    // populate products and user
    const orders = await Order.find({ userId: req.user._id })
      .populate("products.productId userId", "-password")
      .exec();

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//update orders
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).send(updateOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET ORDERS

router.get("/", auth, async (req, res) => {
  // const query = req.query.new;

  try {
    // const orders = query
    //   ? await Order.find()
    //       .sort({
    //         // createdAt sort by date
    //         createdAt: -1,
    //       })
    //       .limit(4)
    //   : await Order.find().sort({ _id: -1 });
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "products.productId",
      model: "Product",
    });
    // console.log(order);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//get user stats
router.get("/stats", auth, isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const orders = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
//get order stats
router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const orders = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
//get income stats
router.get("/income/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: { month: { $month: "$createdAt" }, sales: "$total" },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.status(200).send(income);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Get one week sales
router.get("/week-sales", isAdmin, auth, async (req, res) => {
  const last7Days = moment()
    .day(moment().day() - 7)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(last7Days) } },
      },
      {
        $project: {
          day: { $dayOfWeek: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$day",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.status(200).send(income);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
