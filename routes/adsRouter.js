const express = require("express");
const router = express.Router();
const {upload} = require("../utils/aws-v3")


const {
    getAllAds,
    deleteAd,
    postAds
} = require("../controllers/AdsController");


router.route("/add-tasks").post( upload('Ads').single('AdsImage') , postAds);
router.route("/get-All-tasks").get(getAllAds);

router.route("/delete-tasks/:taskId").delete(deleteAd);



module.exports = router;


 