const express = require("express");
const chapterController = require("./../controllers/chapterController");
const authenticationController = require("./../controllers/authenticationControllers");

const router = express.Router();

router
  .route("/")
  .get(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    chapterController.getAllChapters
  )
  .post(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    chapterController.createChapter
  );

router
  .route("/:id")
  .get(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    chapterController.getChapterById
  )
  .patch(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    chapterController.updateChapter
  )
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    chapterController.deleteChapter
  );

module.exports = router;
