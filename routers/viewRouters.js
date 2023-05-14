const express = require('express')
const purchasingController = require('./../controllers/purchasingController');
const authenticationController = require('./../controllers/authenticationControllers')


const router = express.Router();


router.route('/')
.get(
    purchasingController.createBookingCheckout)

module.exports = router;