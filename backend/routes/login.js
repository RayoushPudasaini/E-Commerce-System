const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);
  try {
    if (error)
      return res.status(400).json({ message: "Email Field is Required" });
    let user = await User.findOne({ email: req.body.email }).exec();
    if (!user) return res.status(400).json({ message: "Invalid email.." });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password..." });

    const token = generateAuthToken(user);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    res.send({ message: "success", user: userData, token });
  } catch (error) {
    console.log(error);
    throw new Error("Something Went Wrong");
  }
});

module.exports = router;
