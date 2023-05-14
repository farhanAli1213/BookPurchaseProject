const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Book = require('./../model/bookModel')
const User = require('./../model/userModel')
const Purchasing = require('../model/purchasingModel');
const catchAsync = require('../Utils/catchAsyns')
const AppError = require('../Utils/appError')
const factoryFunctions = require('./handlerFactory');



exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) GET THE CURRENTLY BOOKED USER
    const book = await Book.findById(req.params.bookId);

    // 2) CREATE CHECKOUT SESSION
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // success_url: `${req.protocol}://${req.get('host')}/`,

        success_url: `${req.protocol}://${req.get("host")}/?book=${req.params.bookId}&user=${req.user._id}&price=${book.price}`,


        cancel_url: `${req.protocol}://${req.get('host')}/`,
        customer_email: req.user.email,
        client_reference_id: req.params.bookId,
        "line_items": [
            {
                price_data: {
                    unit_amount: book.price * 100,
                    currency: 'usd',
                    product_data: {
                        name: `${book.title} Book`,
                        description: book.subject,
                    },
                },
                quantity: 1
            }
        ],
        mode: "payment",
    })
    // console.log(list_items);

    // 3) CREATE SESSION AS RESPONSE
    res.status(200).json({
        status: 'success',
        session
    })
})


// CREATING NEW BOOKING
exports.createBookingCheckout = catchAsync(async(req,res,next) =>{
    
    const { book, user, price} = req.query;
    const checkBlocked = await User.findById(user)
    if (checkBlocked.blocked) {
        return next(new AppError("You can't buyed this book because you are blocked", 400));
      }

    // console.log("book: ",book,"user: ", user,"price:", price);
    if(!book && !user && !price) return next();
    const purchase = await Purchasing.create({ book, user, price});
    // console.log(purchase);
    res.redirect(req.originalUrl.split('?')[0]);

});



exports.createPurchasing = factoryFunctions.createOne(Purchasing)


