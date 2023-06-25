const { trace } = require("joi");
const Conversation = require("../Models/ConversationModel");

module.exports.messages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    await newConversation.save();
    return res.status(200).json({
      status: 200,
      message: "Conversation Created Successfully",
    });
  } catch (error) {
    console.log(error);
    retune.status(400).json({
      status: 400,
      message: { error },
    });
  }
};

module.exports.message = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });
    return res.status(200).json({
      status: 200,
      conversations,
    });
  } catch (error) {
    console.log(error);
  }
};
