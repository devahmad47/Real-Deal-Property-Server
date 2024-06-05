const express = require("express");
const router = express.Router();
const {
  fetchChats,
  accessChat,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");


router.route("/").post(accessChat);
router.route("/").get(fetchChats);
// router.route("/group").post( createGroupChat);
// router.route("/rename").put( renameGroup);
// router.route("/groupremove").put( removeFromGroup);
// router.route("/groupadd").put( addToGroup);

module.exports = router;
