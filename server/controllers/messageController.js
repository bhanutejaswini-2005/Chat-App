const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      $or: [
        { sender: from, reciever: to },
        { sender: to, reciever: from }
      ]
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectedMessages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;

    const data = await Messages.create({
      message: { text: message },
      sender: from,
      reciever: to,
    });

    if (data) {
      return res.json({ msg: "Message added successfully." });
    } else {
      return res.status(400).json({ msg: "Failed to add message to the database" });
    }
  } catch (error) {
    console.error("Error in addMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
