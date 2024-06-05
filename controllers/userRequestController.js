const asyncHandler = require("express-async-handler");
const User = require("../models/alllUsersModel")


const requestUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body
        const { RequestedId } = req.params

        const Updateduser = await User.findOne({ _id: RequestedId });
        const requestedUser = await User.findOne({ _id: userId });
        if (!Updateduser) {
            return res.status(404).json({ message: "User not found" })
        }
        if (!Updateduser.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (!requestedUser) {
            return res.status(404).json({ message: "Invalid Requested User Id" })
        }
        // console.log(Updateduser)
        const requestExist = requestedUser.YourConnections.find((req) => req.userId === RequestedId);

        if (requestExist) {
            return res.status(400).json({ message: "Request in Progress" })
        }

        const isALreadyRequested = Updateduser.YourConnections.find((req) => req.userId === userId);

        if (isALreadyRequested) {
            return res.status(400).json({ message: "Request Already Sent" })
        }

        const newNotification = {
            MessageHeading: 'Friend Request!',
            MessageContent: 'A New Friend Request recieved',
            messageTime: `${new Date()}`,
        }
        Updateduser.Notification.unshift(newNotification)
        Updateduser.YourConnections.push({ userId })

        await Updateduser.save()
        console.log(Updateduser)
        res.status(200).json({ message: 'Request Sent Successfully', Updateduser });

    } catch (err) {
        res.status(500).json({ message: 'Failed to Sent Request', Updateduser });
    }
});

const deleteRequest = asyncHandler(async (req, res) => {
    try {
        const { requestID, thisuser } = req.params;
        const user = await User.findOne({ _id: thisuser });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }

        // user.YourConnections = user.YourConnections.filter((req) => req.userId !== requestID)
        user.YourConnections = user.YourConnections.filter((req) => {
            console.log(req)
            if (req.userId !== requestID) {
                return req
            }
        })


        await user.save()

        res.status(200).json({ message: 'Request Deleted Successfully', user });

    } catch (err) {
        res.status(500).json({ message: 'Failed to Deleted Request' });
    }
});

const acceptRequest = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body
        const { requestID } = req.params;

        const user = await User.findOne({ _id: userId });
        const Otheruser = await User.findOne({ _id: requestID });

        if (!user) {
            return res.status(500).json({ message: "User not found" })
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (!Otheruser) {
            return res.status(500).json({ message: "Reuested User not found" })
        }

        const CurrentRequest = user.YourConnections.find((req) => req.userId === requestID)
        Otheruser.YourConnections.push({
            userId,
            isFriend: true
        })
        if (!CurrentRequest) {
            return res.status(404).json({ message: "Request not found" })
        }


        CurrentRequest.isFriend = true
        const newNotification = {
            MessageHeading: 'Friend Request!',
            MessageContent: 'A New Member added to your Connections',
            messageTime: `${new Date()}`,
        }
        user.Notification.unshift(newNotification)
        Otheruser.Notification.unshift(newNotification)
        await user.save()
        await Otheruser.save()

        res.status(200).json({ message: 'Request Accepted Successfully', user, Otheruser });

    } catch (err) {
        res.status(500).json({ message: 'Failed to Accept Request' });
    }
});




module.exports = {
    requestUser,
    deleteRequest,
    acceptRequest
};
