const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    MessageHeading: { type: String, trim: true },
    MessageContent: { type: String, trim: true },
    messageTime: { type: String, trim: true },
});

const AllNotifications = mongoose.model("AllNotifications", notificationSchema);

module.exports = AllNotifications;