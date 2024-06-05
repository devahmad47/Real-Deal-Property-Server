const express = require("express");
const router = express.Router();
const {
    adminSignUp,
    adminLogin
} = require("../controllers/adminController");
router.route("/signup").post( adminSignUp);
router.route("/login").post(adminLogin);
module.exports = router;


 