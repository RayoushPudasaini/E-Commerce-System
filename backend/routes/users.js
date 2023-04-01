const { User } = require("../models/user");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const router = require("express").Router();
const moment = require("moment");

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

module.exports = router;
