const express = require("express");
const bookController = require("./../controllers/bookController");
const authenticationController = require("./../controllers/authenticationControllers");


const router = express.Router();

router
  .route("/")
  .get(
    // authenticationController.protect,
    bookController.getAllBooks
  )

router.route('/get-report/:date/:period/:bookId?')
  .get(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    bookController.getSalesReport
  )
  .post(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    bookController.createBook
  );

router
  .route("/:id")
  .get(
    authenticationController.protect,
    bookController.getBookById
  )
  .patch(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    bookController.updateBook
  )
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    bookController.deleteBook
  );

module.exports = router;
