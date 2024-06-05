const asyncHandler = require("express-async-handler");
const User = require("../models/alllUsersModel")


const NoftifyContoller = asyncHandler(async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { userId } = req.body;

        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ message: "User not found", error: error.message })

        }

        user.Notification = user.Notification.filter((noti) => noti._id.toString() !== notificationId)
        await user.save();
        res.status(200).json({ message: "notification removed", user })

    } catch (error) {
        res.status(500).json({ message: "failed to remove notfication", error: error.message })
    }
});






module.exports = {
    NoftifyContoller
};
