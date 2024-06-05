const asyncHandler = require("express-async-handler");
const User = require("../models/alllUsersModel")
const Group = require("../models/groupModel")



const getAllUsers = asyncHandler(async (req, res) => {

    try {
        const users = await User.find();

        console.log("aaaya users");
        if (!users || (users.length === 0)) {
            return res.status(500).json({ message: 'Users not found' });

        }
        res.status(200).json({ message: 'User Fetched Successfully', users });

    } catch (error) {
        console.log("users errors")
        res.status(500).json({ message: 'Failed to Fetch Users' });
    }

});

const getSingleUser = asyncHandler(async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (!user.isemailverified) {
            return res.status(401).json({ message: 'User is not verified. Please Complete Sing Up' });
        }
        res.status(200).json({ message: 'User Data fetched', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch User Data, try Again Later' });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'Account deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Delete Account, try Again Later' });
    }
});

const updateUserStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (status === "Active") {
            user.status = true;
        } else if (status === "Suspended") {
            user.status = false;
        }
        await user.save();

        res.status(200).json({ message: 'User Status Update Successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Update User, try Again Later' });
    }
});

const updateUserPassword = asyncHandler(async (req, res) => {

    try {
        // const { id } = req.params
        const { oldpassword, newpassword } = req.body

        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials, User not found" });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (!user.isemailverified) {
            return res.status(401).json({ message: 'User is not verified. Please Complete Sing Up' });
        }
        if (user.password === oldpassword) {
            user.password = newpassword;
            await user.save()

            return res.status(200).json({ message: 'Password Changed Successfully', user });
        } else {
            return res.status(401).json({ message: "Invalid password" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update password" });
    }

});

const addShortcut = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { _id, } = req.body;
    console.log(req.body);
    try {
        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        const group = await Group.findById(_id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const existingShortcut = user.shortcuts.find((shortcut) => shortcut.groupID === _id);
        if (existingShortcut) {
            return res.status(400).json({ message: 'Group already exists in shortcuts' });
        }


        const newShortcut = {
            groupID: _id,
        };

        user.shortcuts.push(newShortcut);
        const updatedUser = await user.save();

        group.Pined = true
        const updatedGroup = await group.save()


        res.status(200).json({ message: "Shortcut added successfully", updatedUser, updatedGroup });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

const removeShortcut = asyncHandler(async (req, res) => {
    const { groupID, userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }

        const group = await Group.findOne({ _id: groupID });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const shortcutsToRemove = user.shortcuts.filter((shortcut) => shortcut.groupID === groupID);

        if (shortcutsToRemove.length === 0) {
            return res.status(404).json({ message: 'Shortcut not found' });
        }

        user.shortcuts = user.shortcuts.filter((shortcut) => shortcut.groupID !== groupID);


        const updatedUser = await user.save();
        group.Pined = false
        const updatedGroup = await group.save()

        res.status(200).json({ message: "Shortcut Removed", updatedUser, updatedGroup });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
const deleteUnverified = asyncHandler(async (req, res) => {


    try {
        const result = await User.deleteMany({ isverified: false });

        res.json({ message: 'Users not verified deleted', result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete unverified users', error: error.message });
    }

});
const activeUsers = asyncHandler(async (req, res) => {
    try {
        const allUsers = await User.find();

        if (!allUsers && allUsers.length === 0) {
            return res.status(404).json({ message: 'users not found' });
        }

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const activeUsers = allUsers.filter(user => {
            const lastLoginDate = new Date(user.lastLogin);
            return lastLoginDate >= oneWeekAgo;
        });
        res.json({ message: 'Active Users fetched Successfully', activeUsers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch active users', error: error.message });
    }

});


module.exports = {
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUserStatus,
    updateUserPassword,
    addShortcut,
    removeShortcut,
    deleteUnverified,
    activeUsers
};
