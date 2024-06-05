// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//     // Define your schema properties here
//     chatName: { type: String, trim: true },
//     users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
//     latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
// }, { timestamps: true });

// const Chat = mongoose.model('Chat', chatSchema);

// module.exports = Chat;
const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
