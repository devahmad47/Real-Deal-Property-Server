const express = require("express");
const router = express.Router();
const { upload } = require("../utils/aws-v3")

const {
    groupPostReaction,
    groupPostComment,
    createGroupPost,
    deleteGroupPost
} = require("../controllers/groupPostController");


router.route("/discussionPost/:groupID/reaction/:postID").post(groupPostReaction);
router.route("/discussionPost/:groupID/add_comments/:postID").post(groupPostComment);
router.route("/:groupID/Create_Discussion_post").post(upload('Groups').array('Postmedia', 10), createGroupPost);
router.route("/:groupID/delete_discussion_post/:postID").delete(deleteGroupPost);

module.exports = router;



