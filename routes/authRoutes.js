const express = require("express");
const router = express.Router();
const { upload } = require("../utils/aws-v3")

const {
    registerUser,
    forget_passowrd,
    singin,
    UpdateNewPassword,
    set_passowrdRoute,
    updateprofile,
    updateEmail,
    AuthVerificationEmail
} = require("../controllers/authController");


router.route("/register_User").post(upload('Users').single('profileImage'), registerUser); // 

router.route("/signin").post(singin);

router.route("/update_profile").post(upload('Users').single('profileImage'), updateprofile);
router.route("/verify/updateEmail").post(updateEmail);
router.route("/email_Auth_verify/:email/:id/:token").get(AuthVerificationEmail);


router.route("/verify_email").post(forget_passowrd); // first verify email and generte token 
router.route("/verify/:id/:token").get(set_passowrdRoute); // server redirect to auth token
router.route("/:token/forgotPassword").post(UpdateNewPassword); // update new password




module.exports = router;

