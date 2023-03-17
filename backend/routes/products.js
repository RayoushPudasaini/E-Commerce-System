require("dotenv").config();
const { Product } = require("../models/Product");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");
const products = require("../products");
const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
  const { name, brand, desc, price, image } = req.body;

  if (!name || !brand || !desc || !price || !image)
    return res.status(400).send("All fields are required");

  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_present: "online-shop",
        folder: "online-shop",
      });

      if (uploadedResponse) {
        const product = new Product({
          name,
          brand,
          desc,
          price,
          image: uploadedResponse,
        });

        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error);
  }
});

// //DELETE

// router.delete("/:id", isAdmin, async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.status(200).send("Product has been deleted...");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

//GET ALL PRODUCTS

// router.get("/", async (req, res) => {
//   const qbrand = req.query.brand;
//   try {
//     let products;

//     if (qbrand) {
//       products = await Product.find({
//         brand: qbrand,
//       });
//     } else {
//       products = await Product.find();
//     }

//     res.status(200).send(products);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

//GET PRODUCT

router.get("/find/:id", async (req, res) => {
  try {
    // const product = await Product.findById(req.params.id);

    const product = await products.find(
      (product) => product.id === parseInt(req.params.id)
    );
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

//

module.exports = router;
