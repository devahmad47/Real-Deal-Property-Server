const asyncHandler = require("express-async-handler");
const AdminPanel = require("../models/adminModel")

const adminSignUp = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingAdmin = await AdminPanel.findOne({ adminemail: email });

        if (existingAdmin) {
            return res.status(401).json({ message: 'Admin already exists', userstatus: 0 });
        }

        const newAdmin = new AdminPanel({
            adminemail: email,
            password: password,
            isverified: true,
        });

        await newAdmin.save();

        newAdmin.sessionExpiration = new Date().getTime() + (60 * 60 * 24 * 1000); // 24 hour
        await newAdmin.save();

        res.status(200).json({ message: 'Admin successfully signed up', admin: newAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to sign up admin, try again later' });
    }
});

const adminLogin = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    try {
        const admin = await AdminPanel.findOne({ adminemail: email });

        if (!admin) {
            return res.status(401).json({ message: 'admin not found', userstatus: 0 });
        }

        if (!admin.isverified) {
            return res.status(401).json({ message: 'admin is not verified' });
        }

        if (admin.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }



        admin.sessionExpiration = new Date().getTime() + (60 * 60 * 24 * 1000);
        await admin.save();

        res.status(200).json({ message: 'Successfully Sign In', admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Sign-In , try Again Later' });
    }
});



module.exports = {
    adminSignUp,
    adminLogin
};
