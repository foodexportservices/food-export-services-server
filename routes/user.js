const express = require("express");
const {
  getUsers,
  createUser,
  addAddress,
  loginUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getUsers).post(createUser);
router.route("/address").post(protect, addAddress);
router.route("/login").post(loginUser);

module.exports = router;
