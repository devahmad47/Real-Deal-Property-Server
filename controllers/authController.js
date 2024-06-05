const asyncHandler = require("express-async-handler");
const User = require("../models/alllUsersModel")
// const VerificationModel = require("../models/verificationModel")
const transporter = require("../utils/transporter")
const crypto = require("crypto");



const GenerateEmail = async (userId, token, email) => {

    const verificationLink = `${process.env.Server_URL}/api/auth/email_Auth_verify/${email}/${userId}/${token}`;
    const mailOptions = {
        from: '"Ibrar Athar" <ibrarathar0007@gmail.com>',
        to: email,
        subject: 'Email Verification',
        html: ` 
        
        <p>RealEstate Verification Email</p>
        <p> Please click the following link to verify your email: </p>
        <a href=${verificationLink} target="_blank">Verify Me</a>
    <p>${verificationLink}</p>`
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Message Sent status: " + info.messageId);
}

// api/auth/register_User singup routes
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email, primaryMarket, DOB, username, password  , mobileNumber} = req.body;
        console.log(req.body);
        const file = req.file;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this Email already exists, Login to proceed' });
            // if (!existingUser.isverified) {
            //     await User.deleteOne({ email });
            // } else {
            // }
        }

        if (!file) {
            return res.status(500).json({ message: 'Failed to upload profile image' });
        }
        console.log(file);
        const imageUrl = await file.location;
        if (!imageUrl) {
            return res.status(500).json({ message: 'Failed to  profile image' });
        }
        const newUser = new User({ password, primaryMarket, DOB, username, email , mobileNumber });
        newUser.profileImageUrl = imageUrl;
        newUser.createdAt = new Date();

        const verificationToken = crypto.randomBytes(20).toString('hex');
        const expirationTokenTime = new Date(Date.now() + 20 * 60 * 1000); // Current time + 5 minutes

        await GenerateEmail(newUser._id, verificationToken, email)
        newUser.verificationToken = verificationToken;
        newUser.expirationTokenTime = expirationTokenTime;

        await newUser.save();
        return res.status(200).json({ message: 'Generate Email Tokens and Verification code sent successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Sign Up or Send Verification code' });
    }
});


//User login 
const singin = asyncHandler(async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        // if (!user.) {
        //     return res.status(401).json({ message: 'User is not verified. Please Complete Sing Up' });
        // }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        user.sessionExpiration = new Date().getTime() + (60 * 60 * 24 * 1000)
        user.lastLogin = new Date();

        await user.save();

        return res.status(200).json({ message: 'Successfully Sign In', user });
        // res.status(200).json({ message: 'Successfully Sign In', id: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Sign-In , try Again Later' });
    }
});


// /api/auth//update_profile
const updateprofile = asyncHandler(async (req, res) => {
    try {
        const { userId, primaryMarket, DOB, username, password , mobileNumber} = req.body;
        // const { email } = req.body;
        console.log(req.body);
        const file = req.file;
        const existingUser = await User.findOne({ _id: userId });

        if (!existingUser) {

            return res.status(400).json({ message: 'User not found', });
        }
        if (!existingUser.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (primaryMarket !== undefined) {
            existingUser.primaryMarket = primaryMarket;
        }

        if (DOB !== undefined) {
            existingUser.DOB = DOB;
        }
        if (mobileNumber !== undefined) {
            existingUser.mobileNumber = mobileNumber;
        }

        if (username !== undefined) {
            existingUser.username = username;
        }

        if (password !== undefined) {
            existingUser.password = password;
        }
        // Handle profile image upload
        if (file) {
            const imageUrl = await file.location;
            if (imageUrl) {
                existingUser.profileImageUrl = imageUrl;
            } else {
                return res.status(500).json({ message: 'Failed to upload profile image' });
            }
        }

        await existingUser.save();
        res.status(200).json({ message: 'Updated Profile', user: existingUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Update User Profile' });
    }
});

// /api/auth//verify/updateEmail
const updateEmail = asyncHandler(async (req, res) => {
    try {
        const { email, UserID } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Invalid Email' });
        }

        const existingUser = await User.findOne({ email });
        console.log(existingUser)
        if (!existingUser.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (existingUser && existingUser.isemailverified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const user = await User.findOne({ _id: UserID });
        if(existingUser.email  !==  user.email){
            return res.status(400).json({ message: 'Email is already Registred With another User' });
        }
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const expirationTokenTime = new Date(Date.now() + 20 * 60 * 1000);
        await GenerateEmail(UserID, verificationToken, email)

        user.verificationToken = verificationToken;
        user.expirationTokenTime = expirationTokenTime;
        await user.save();

        res.status(200).json({ message: 'Updated Profile', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Verify Email' });
    }
});


// /api/auth/verify/:id/:token server side redirect email verification
const AuthVerificationEmail = asyncHandler(async (req, res) => {
    const { token, email, id } = req.params;
    console.log("verify me " + token, id, email);
    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            res.redirect(`${process.env.Web_ORIGJN_URL}/login?verification=error`);
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (token === user.verificationToken) {
            const currentTime = new Date();
            if (currentTime <= user.expirationTokenTime) {
                user.isemailverified = true;
                user.email = email;
                await user.save();
                res.redirect(`${process.env.Web_ORIGJN_URL}/login/?verification=success`);

            } else {
                res.redirect(`${process.env.Web_ORIGJN_URL}/login?verification=error`);
            }
        } else {
            res.redirect(`${process.env.Web_ORIGJN_URL}/login?verification=error`);
        }

    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.Web_ORIGJN_URL}/login?verification=error`);
    }
});


// send email request to srver for forgot or verification
const forget_passowrd = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const expirationTokenTime = new Date(Date.now() + 20 * 60 * 1000); // Current time + 5 minutes

        const verificationLink = `${process.env.Server_URL}/api/auth/verify/${user._id}/${verificationToken}`;

        const mailOptions = {
            from: '"UMAIR Athar" <umairathar0007@gmail.com>',
            to: email,
            subject: 'Email Verification',
            html: ` 
          
        <p>RealEstate Verification Email</p>
        <p> Please click the following link to verify your email: </p>
        <a href=${verificationLink} target="_blank">Verify Me</a>
        <p>${verificationLink}</p>`
        };


        const info = await transporter.sendMail(mailOptions);
        console.log("message Sent status" + info.messageId);

        user.verificationToken = verificationToken;
        user.expirationTokenTime = expirationTokenTime;
        await user.save();

        res.status(200).json({ message: 'Verification Email Sent', user });

    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Failed to verify email' });
    }
});

// /api/auth/verify/:id/:token server side redirect email verification
const set_passowrdRoute = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { id } = req.params;
    console.log("verify me " + token, id);
    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            res.redirect(`${process.env.Web_ORIGJN_URL}/forgetPassword?verification=error`);
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        console.log(user);
        if (token === user.verificationToken) {
            const currentTime = new Date();
            console.log(currentTime, user.expirationTokenTime);
            if (currentTime <= user.expirationTokenTime) {
                user.isemailverified = true;
                await user.save();
                res.redirect(`${process.env.Web_ORIGJN_URL}/set_passowrd/${token}/${id}?verification=success`);

            } else {
                console.log("time error");
                res.redirect(`${process.env.Web_ORIGJN_URL}/forgetPassword?verification=error`);
            }
        } else {
            console.log("token", user.verificationToken);

            res.redirect(`${process.env.Web_ORIGJN_URL}/forgetPassword?verification=error`);
        }

    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.Web_ORIGJN_URL}/forgetPassword?verification=error`);
    }
});

// /api/auth/:token/forgotPassword
const UpdateNewPassword = asyncHandler(async (req, res) => {

    const { password, userId } = req.body;
    const { token } = req.params;
    try {
        const options = { maxTimeMS: 30000 };
        const user = await User.findOne({ _id: userId }, null, options);

        if (!user) {
            return res.status(400).json({ message: "User with this email not found" });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (!user.isemailverified) {
            return res.status(400).json({ message: "Email is not verified" })
        }
        if (user.verificationToken !== token || !password) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        user.verificationToken = null;
        user.password = password
        await user.save()

        res.status(200).json({ message: 'Password Updated successfully', user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Update Password' });
    }
});



module.exports = {
    registerUser,
    forget_passowrd,
    singin,
    UpdateNewPassword,
    set_passowrdRoute,
    updateprofile,
    updateEmail,
    AuthVerificationEmail
};
