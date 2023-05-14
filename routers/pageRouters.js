const express = require("express");
const pageController = require("./../controllers/pageController");
const authenticationController = require("./../controllers/authenticationControllers");

const router = express.Router();

router
  .route("/")
  .get(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    pageController.getAllPages
  )
  .post(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    pageController.createPage
  );

router
  .route("/:id")
  .get(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    pageController.getPageById
  )
  .patch(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    pageController.updatePage
  )
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    pageController.deletePage
  );

module.exports = router;
