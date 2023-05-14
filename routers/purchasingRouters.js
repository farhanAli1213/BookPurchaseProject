const purchasingController = require('../controllers/purchasingController');
const authenticationController = require('../controllers/authenticationControllers')
const express = require('express')



const router = express.Router();


router.use(authenticationController.protect)

router.get(
    '/checkout-session/:bookId',
    authenticationController.protect,
    purchasingController.getCheckoutSession,
    // purchasingController.createBookingCheckout
)
router.route('/')
.get(purchasingController.createBookingCheckout)


module.exports = router;