const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/alllUsersModel")

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username profileImageUrl email")
      .populate("chat");
    // console.log(messages)
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { senderId, content, chats } = req.body;
  console.log(chats)
  if (!content) {
    console.log("Invalid data passed into request");
    return res.status(400).json({ message: "invalid data" });
  }

  var newMessage = {
    sender: senderId,
    content: content,
    chat: chats._id,
  };

  try {
    // var message = await Message.create(newMessage);
    // console.log(typeof message); // Should print 'object' or 'function'

    const message = await Message.create(newMessage)
    const populatedMessage = await Message.findById(message._id)
    .populate("sender", "username profileImageUrl")
    .populate("chat")
    .exec();
// console.log(".....")
// console.log(message)
// console.log("jkdf")
// console.log(populatedMessage)


    await Chat.findByIdAndUpdate(req.body.chats._id, { latestMessage: message });

    res.json(populatedMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
