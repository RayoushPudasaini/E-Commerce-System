require("dotenv").config();
const { auth, isUser, isAdmin } = require("../middleware/auth");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    // match
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

//CREATE

router.post("/", async (req, res) => {
  try {
    const { name, brand, desc, price, image, sizes } = req.body;

    if (!image) return res.status(400).send("Image is required");

    if (!name || !brand || !desc || !price || !sizes)
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
      sizes,
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

//edit product
router.put("/:id", isAdmin, async (req, res) => {
  console.log(req.body);
  // console.log(req.body.productImg);
  try {
    if (req.body.productImg) {
      const destroyResponse = await cloudinary.uploader.destroy(
        req.body.product.currentProd.image.public_id
      );
      // console.log(destroyResponse, "destroyResponse");

      if (destroyResponse) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.productImg,
          {
            upload_present: "online-shop",
            folder: "online-shop",
          }
        );

        if (uploadedResponse) {
          const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                ...req.body.product,
                image: uploadedResponse,
              },
            },
            { new: true }
          );
          res.status(200).send(updatedProduct);
        }
      }
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...req.body.product,
          },
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
  try {
    const query = req.query;
    const features = new APIfeatures(Product.find(), query)
      .filtering()
      .sorting()
      .paginating();

    const products = await features.query;

    res.json(products);
  } catch (error) {
    return res.status(500).json(error.message);
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

router.post("/review/:id", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ msg: "Invalid Comment." });
    }
    if (comment.length < 3) {
      return res.status(400).json({ msg: "Comment Must be 3 Lengths Long." });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ msg: "Product Not Found." });
    }
    const user = req.user._id;
    const author = await User.findById(user);

    product.comments.push({
      rating,
      comment,
      author,
    });

    await product.save();
    res.json({ msg: "Successfully Commented.", product });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// delete review from product
router.delete("/review/:id/:reviewId", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ msg: "Product Not Found." });
    }
    const review = product.comments.find(
      (comment) => comment.id === req.params.reviewId
    );
    if (!review) {
      return res.status(400).json({ msg: "Review Not Found." });
    }
    const user = req.user._id;
    if (review.author._id.toString() !== user) {
      return res.status(400).json({ msg: "User Not Authorized." });
    }
    const removeIndex = product.comments
      .map((comment) => comment._id)
      .indexOf(req.params.reviewId);
    product.comments.splice(removeIndex, 1);
    await product.save();
    res.json({ msg: "Successfully Deleted.", product });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// update review from product
router.patch("/review/:id/:reviewId", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ msg: "Invalid Comment." });
    }
    if (comment.length < 3) {
      return res.status(400).json({ msg: "Comment Must be 3 Lengths Long." });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ msg: "Product Not Found." });
    }
    const review = product.comments.find((comment) => {
      return comment._id.toString() === req.params.reviewId;
    });

    if (!review) {
      return res.status(400).json({ msg: "Review Not Found." });
    }
    const user = req.user._id;
    if (review.author._id.toString() !== user) {
      return res.status(400).json({ msg: "User Not Authorized." });
    }
    review.rating = rating;
    review.comment = comment;
    await product.save();

    // await product.save();
    res.json({ msg: "Successfully Updated.", product });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

//

module.exports = router;
