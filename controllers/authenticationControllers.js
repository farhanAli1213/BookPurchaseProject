const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const User = require('./../model/userModel')
const catchAsyns = require('./../Utils/catchAsyns')
const AppError = require('./../Utils/appError')
const crypto = require('crypto')
const { MongoClient, ObjectId } = require('mongodb');


const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


const createSignToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // secure: true,
        httpOnly: true 
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOption.secure = true;
    }
    res.cookie('jwt', token, cookieOption)


    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}


exports.signup = catchAsyns(async (req, res, next) => {
    // const newUser = await User.create(req.body)

    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     role: req.body.role,
    //     confirmPassword: req.body.confirmPassword,
    //     passwordChangedAt: req.body.passwordChangedAt
    // })

    const newUser = await User.create(req.body)

    createSignToken(newUser, 201, res)

});


exports.login = catchAsyns(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exists
    if (!email || !password) {
        next(new AppError('Please first provide your both email and password', 400))
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything is okay,send token to client
    createSignToken(user, 200, res)

})


// GET ACCESS TO PRIVATE PAGES MEANS FIRST LOGIN AND THEN GIVING ACCESS
exports.protect = catchAsyns(async (req, res, next) => {
    // 1) Getting token and check its existance
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log('ddddddddddd',token);
    if (!token) {
        return next(new AppError('You are not login! Please login first.', 401))
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this id is not exist.', 401))
    }

    // 4) Check if user changed password after token was issued
    if (currentUser.afterChangePassword(decoded.iat)) {
        return next(new AppError('User recently changed the password! Please login again.', 401))

    }

    // GRANT ACCESS TO PROTECTED ROUTES
    req.user = currentUser;
    next();
})


// Defining permissions as user and admin
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!(roles.includes(req.user.role))) {
            return next(new AppError("You don't have permissions to perform this role.", 403)) 
        }
        next();
    }

}


// Forget and update password through email
exports.forgotPassword = catchAsyns(async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("There is no user with that email address.", 404))
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user email address
    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword//${resetToken}`
        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent successfully'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError("There was error sending the email! Try again later.", 500))
    }
})


// Reset Password
exports.resetPassword = catchAsyns(async (req, res, next) => {
    // 1)Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError("Token has expired or invalid.", 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changePasswordAt property of the user

    // 4) Log the user in, sent JWT
    createSignToken(user, 200, res)

})


// Update password
exports.updatePassword = catchAsyns(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError("Your current password is wrong.", 401));
    }

    // 3) If so then update the password
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    await user.save();

    // 4) Log user in, Sent JWT
    createSignToken(user, 200, res)

})