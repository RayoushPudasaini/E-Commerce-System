require("dotenv").config();
const express = require("express");
const cors = require("cors");
const products = require("./products");
const login = require("./routes/login");
const register = require("./routes/register");
const connectDb = require("./config/connectDB");
const stripe = require("./routes/stripe");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/register", register);

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API....");
});

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/stripe", stripe);

app.get("/products", (req, res) => {
  res.json(products);
});

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI;
connectDb(uri);

app.listen(port, console.log(`Server running on port ${port}`));
