const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateUser,
  getUsers,
  getUser,
} = require("../controllers/user");

router.get("/", auth, getUsers);
router.get("/me", auth, getCurrentUser);
router.get("/:userId", getUser);
router.patch("/me", auth, updateUser);

module.exports = router;
