const express = require("express");
const router = express.Router();
const { upload } = require("../utils/aws-v3")

const {
    createPost,
    savePost,
    removeSavePost,
    getPost,
    deletePost,
    reactionPost,
    commentPost,
    filtered_Post,
    reportPost,
    editPost
} = require("../controllers/postController");


router.route("/Create_post").post(upload('Posts').array('Postmedia', 10), createPost);
router.route("/savepost/:userId").post(savePost);
router.route("/remove-post-from-savedposts/:userId/:postId").delete(removeSavePost);
router.route("/get_post").get(getPost);
router.route("/:postID/delete_post").delete(deletePost);
router.route("/:postID/reaction").post(reactionPost);
router.route("/:postID/comments").post(commentPost);
router.route("/filtered_Post").post(filtered_Post);
router.route("/reportPost/:postId").post(reportPost);
router.route("/edit-post/:postId").post(editPost);


module.exports = router;


