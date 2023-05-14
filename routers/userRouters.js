const express = require("express");
const userController = require("./../controllers/userControllers");
const authenticationController = require("./../controllers/authenticationControllers");
const userControllers = require("./../controllers/userControllers");
const factory = require("./../controllers/handlerFactory");

const router = express.Router();

router.post("/signup", authenticationController.signup);
router.post("/login", authenticationController.login);

router.get(
  "/me",
  authenticationController.protect,
  userController.getMe,
  userController.getUser
);


router.use(authenticationController.protect);

router.patch(
  "/updatePassword",
  // authenticationController.protect,
  authenticationController.updatePassword
);
router.patch(
  "/updateMe",
  // authenticationController.protect,
  userControllers.updateMe
);
router.delete(
  "/deleteMe",
  // authenticationController.protect,
  userControllers.deleteMe
);

router.use(authenticationController.restrictTo("admin"));

router
  .route("/")
  .get(
    authenticationController.restrictTo("admin"),
    userController.getAllUsers
  );

router.route("/blockUser/:id/:action")
  .patch(
  authenticationController.protect,
  authenticationController.restrictTo("admin"),
  userController.blockUser
);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser);

module.exports = router;
