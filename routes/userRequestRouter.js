const express = require("express");
const router = express.Router();

const {
    requestUser,
    deleteRequest,
    acceptRequest
} = require("../controllers/userRequestController");


router.route("/:RequestedId").post( requestUser);
router.route("/:requestID/Delete_Request/:thisuser").delete(deleteRequest);
router.route("/:requestID/Accept_Request").post(acceptRequest);



module.exports = router;

  