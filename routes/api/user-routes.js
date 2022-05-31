const router = require("express").Router();
const {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/user-controller");

// /api/user
router.route("/").get(getAllUsers).post(createUser);

// /api/user/:userId
router.route("/:userId").get(getOneUser).put(updateUser).delete(deleteUser);

// /api/user/:userId/friends/:friendId
router.route("/:userId/friends/:friendId").put(addFriend).delete(removeFriend);

module.exports = router;
