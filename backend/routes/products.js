require("dotenv").config();
const { Product } = require("../models/Product");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");

//CREATE

router.post("/", async (req, res) => {
  try {
    const { name, brand, desc, price, image } = req.body;

    if (!image) return res.status(400).send("Image is required");

    if (!name || !brand || !desc || !price)
      return res.status(400).send("All fields are required");

    const uploadedResponse = await cloudinary.uploader.upload(image, {
      upload_present: "online-shop",
      folder: "online-shop",
    });

    const product = new Product({
      name,
      brand,
      desc,
      price,
      image: {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      },
    });
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
// //DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id).exec();
    res.status(200).json({ message: "Product has been deleted...", product });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
  const qbrand = req.query.brand;
  try {
    let products;

    if (qbrand) {
      products = await Product.find({
        brand: qbrand,
      });
    } else {
      products = await Product.find();
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET PRODUCT

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // const product = await products.find(
    //   (product) => product.id === parseInt(req.params.id)
    // );
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

//

module.exports = router;
