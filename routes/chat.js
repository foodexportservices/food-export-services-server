const express = require("express");
const { getChats, createChat } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getChats).post(protect, createChat);

module.exports = router;
