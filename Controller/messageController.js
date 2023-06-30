const { trace } = require("joi");
const Conversation = require("../Models/ConversationModel");
const User = require("../Models/userModel");
const Message = require("../Models/MessageModel");

//"/api/conversation" // message side mah ko ko sanga conversation greko xa vnerw thaa  pauna lai
module.exports.message = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    console.log("senderid", senderId);

    const newConversation = await new Conversation({
      members: [senderId, receiverId],
    });
    await newConversation.save();
    const newMessage = await new Message({
      conversationId: newConversation._id,
      senderId,
      message: "",
    });
    await newMessage.save();
    console.log("newConversation", newConversation);
    console.log("newMessage", newMessage);
    // console.log("convo", newConversation);

    return res.status(200).json({
      status: 200,
      message: "Conversation Created Successfully",
      newMessage,
    });
  } catch (error) {
    console.log(error);
    retune.status(400).json({
      status: 400,
      message: { error },
    });
  }
};

// api :- "/api/conversation/:userId"
module.exports.singleMessage = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("id", userId);

    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });

    const conversationUserData = [];

    for (const conversation of conversations) {
      // console.log("members", conversation.members);

      const receiverId = conversation.members.find(
        (member) => member !== userId
      );

      try {
        const user = await User.findById(receiverId);
        console.log("u", user);

        if (user) {
          conversationUserData.push({
            user: {
              receiverId: user._id,
              email: user.email || "",
              fullName: user.fullName,
            },
            conversationId: conversation._id,
          });
        } else {
        }
      } catch (error) {
        console.log(`Error finding user: ${error}`);
      }
    }

    res.status(200).json(conversationUserData);
  } catch (error) {
    console.log(error);
  }
};

//api:- "/api/message"
module.exports.messages = async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    console.log(conversationId, senderId, message, receiverId);
    if (!senderId || !message)
      return res.status(400).json({
        status: 400,
        message: "Please Fill all the required Field",
      });
    if (conversationId === "new" && receiverId) {
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });

      await newConversation.save();
      console.log(newConversation);
      const newMessage = await new Message({
        conversationId: newConversation._id,
        senderId,
        message,
        receiverId,
      });
      await newMessage.save();
      console.log("newMessage", newMessage);
      return res.status(200).json({
        status: 200,
        message: "send Successfully",
      });
    } else if (!conversationId && !receiverId) {
      return res.status(400).json({
        status: 400,
        message: "Please Fill all the form",
      });
    }
    const newMessage = await new Message({
      conversationId,
      senderId,
      message,
      receiverId,
    });
    await newMessage.save();
    console.log("newMessage", newMessage);
    return res.status(200).json({
      status: 200,
      message: "Send Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 400,
      message: { error },
    });
  }
};

// api :- "/api/message/:conversationId"
module.exports.conversationId = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    console.log("conversation", conversationId);
    if (conversationId === "new")
      return res.status(201).json({
        status: 201,
        message: "Conversation Id is Required",
      });
    const messages = await Message.find({ conversationId });
    console.log("Message", messages);
    const messageUserData = Promise.all(
      messages.map(async (message) => {
        const user = await User.findById(message.senderId);
        console.log(user);
        return {
          user: {
            id: user._id,
            email: user ? user.email : "",
            fullName: user.fullName,
          },
          message: message.message,
        };
      })
    );
    return res.status(200).json(await messageUserData);
  } catch (error) {
    console.log(error);
  }
};

//api:- "/api/allUsers"
module.exports.allUsers = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json({
      status: 200,
      message: { user },
    });
  } catch (error) {}
};
