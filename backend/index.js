require("dotenv").config();
const express = require("express");
const cors = require("cors");
const products = require("./products");
const login = require("./routes/login");
const register = require("./routes/register");
const connectDb = require("./config/connectDB");
const stripe = require("./routes/stripe");
const productsRoute = require("./routes/products");
const imagesRoute = require("./routes/upload");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const orders = require("./routes/orders");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/register", register);

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

app.listen(port, console.log(`Server running on port ${port}`));
