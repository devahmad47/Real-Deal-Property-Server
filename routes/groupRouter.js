const express = require("express");
const router = express.Router();
const { upload } = require("../utils/aws-v3")

const {
    createGroup,
    addMedia,
    getGroups,
    deleteGroups
} = require("../controllers/groupController");


router.route("/Create_group").post(upload('Groups').single('groupThumbnilMedia'), createGroup);
router.route("/:groupID/Add_media").post( upload('Groups').single('Postmedia') ,addMedia);
router.route("/get_groups").get(getGroups);
router.route("/:groupID/delete_Group").delete(deleteGroups);

module.exports = router;



 