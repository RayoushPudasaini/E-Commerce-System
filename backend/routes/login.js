const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();

//Handling login request
router.post("/", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body); //handling error if any error occured
  try {
    // if (error)
    //   return res.status(400).json({ message: "Email Field is Required" });
    // check error of email
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email }).exec();
    if (!user) return res.status(400).json({ message: "Invalid email.." }); //respoonse after email is not found in database

    const validPassword = await bcrypt.compare(
      //comparing password
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password..." });

    const token = generateAuthToken(user); //generating token

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
