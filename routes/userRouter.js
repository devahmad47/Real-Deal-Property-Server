const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUserStatus,
    updateUserPassword,
    addShortcut,
    removeShortcut,
    deleteUnverified,
    activeUsers
} = require("../controllers/userController");


router.route("/get_all_users").get(getAllUsers);
router.route("/:id/get_user").get(getSingleUser);
router.route("/:id/delete_user").delete(deleteUser);
router.route("/:id/update_user_status").post(updateUserStatus);
router.route("/:id/update_user_password").post(updateUserPassword);
router.route("/deleteUnverified").delete(deleteUnverified);

router.route("/shorcuts/:userId/addShortcuts").post(addShortcut);
router.route("/removeShortcut/:userId/:groupID").delete(removeShortcut);
router.route("/get-all-activeUser").get(activeUsers);


module.exports = router;


