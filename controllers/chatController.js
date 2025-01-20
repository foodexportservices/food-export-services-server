const Chat = require("../models/chat");

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate("user", "name");
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const chat = new Chat({
      user: req.user._id,
      message: req.body.message,
    });
    const savedChat = await chat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
