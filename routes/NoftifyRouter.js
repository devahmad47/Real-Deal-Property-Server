const express = require("express");
const router = express.Router();

const {
    NoftifyContoller
} = require("../controllers/NoftifyContoller");


router.route("/removeNotification/:notificationId").post(NoftifyContoller);



module.exports = router;

