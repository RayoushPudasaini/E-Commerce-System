const { User } = require("../models/user");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const router = require("express").Router();
const moment = require("moment");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");
const bcrypt = require("bcrypt");

//get user stats
router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const users = await User.aggregate([
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

    const totalUsers = await User.countDocuments();

    res.status(200).json({ users, totalUsers });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//get all users
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.json(err.message);
  }
});

//delete user
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user, message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
});

//forgot password

router.post("/send-reset-password-link", async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await User.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          },
          secret,
          { expiresIn: "15m" }
        );
        const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
        console.log(link);

        console.log("<------------------------------------------>");

        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Password Reset Link",
          html: `
                    <h1>Password Reset Link</h1> <br/>
                    <h2>
                        <a href="${link}">Click Here</a> to Reset Your Password</h2>`,
        });

        res.status(200).json({
          status: "success",
          msg: "Password Reset Link Sent Successfully, Check Your Mail",
          info,
        });
      } else {
        res.status(400).json({ status: "failed", msg: "Email doesn't exist" });
      }
    } else {
      res
        .status(400)
        .json({ status: "failed", msg: "Email field is required" });
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", msg: error.message });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  try {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;

    const user = await User.findById(id);
    const newSecret = user._id + process.env.JWT_SECRET_KEY;
    jwt.verify(token, newSecret);
    if (password && password_confirmation) {
      if (password.length < 6)
        return res.status(400).json({
          status: "failed",
          msg: "Password must be at least 6 characters.",
        });
      if (password === password_confirmation) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(user._id, {
          $set: { password: hashedPassword },
        });

        res
          .status(200)
          .json({ status: "success", msg: "Password Reset Successfully" });
      } else {
        res.status(400).json({
          status: "failed",
          msg: "Password and Confirmation Password Doesn't Match",
        });
      }
    } else {
      res
        .status(400)
        .json({ status: "failed", msg: "All fields are required" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "failed", message: error.message ?? "Some went wrong " });
  }
});

module.exports = router;
