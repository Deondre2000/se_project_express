const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/user");
const { validateUpdateUserBody } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);

router.patch(
  "/me",
  auth,
  validateUpdateUserBody,
  updateUser
);

module.exports = router;
