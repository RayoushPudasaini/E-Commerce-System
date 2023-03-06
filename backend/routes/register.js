const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);
  try {
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .json({ message: `User already exists... for email ${user.email}` });

    // console.log("here");

    const { name, email, password } = req.body;

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

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
  }
});

module.exports = router;
