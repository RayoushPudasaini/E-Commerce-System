require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDb = require("./config/connectDB");
const productsRoute = require("./routes/products");
const imagesRoute = require("./routes/upload");
const users = require("./routes/users");
const orders = require("./routes/orders");
const login = require("./routes/login");
const register = require("./routes/register");
const stripe = require("./routes/stripe");
const products = require("./products");


const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());

// app.use((req, res, next) => {
//   if (req.originalUrl === "/api/stripe/webhook") {
//     next(); // Do nothing with the body because I need it in a raw state.
//   } else {
//     express.json()(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
//   }
// });

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API....");
});

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/stripe", stripe);
app.use("/api/products", productsRoute);
app.use("/api/images", imagesRoute);
app.use("/api/users", users);
app.use("/api/orders", orders);

app.get("/products", (req, res) => {
  res.json(products);
});

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI;
connectDb(uri);

app.listen(port, () => console.log(`Server running on port ${port}`));
