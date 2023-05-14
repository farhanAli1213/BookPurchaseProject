const User = require('./../model/userModel');
const catchAsync = require('./../Utils/catchAsyns')
const AppError = require('./../Utils/appError')
const factoryFunctions = require('./handlerFactory');


exports.getAllUsers = factoryFunctions.getAll(User)

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}



// For allowing only specific fields updation
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(element => {
        if (allowedFields.includes(element)) {
            return newObj[element] = obj[element]
        }
    })
    return newObj;
}

// Update Fields
exports.updateMe = catchAsync(async (req, res, next) => {
    // console.log('Requesttttttttttttttt', req.file);
    // console.log('bodyyyyyyyyyyyyyyyy', req.body);


    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('This route is not for password update. Please go to Password update route.'), 400);
    }

    // 2) Filter out unwanted fields that's not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });


    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})


// Delete user
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})


exports.getUser = factoryFunctions.getOne(User);
exports.updateUser = factoryFunctions.updateOne(User)
exports.deleteUser = factoryFunctions.deleteOne(User)

const mongoose=require('mongoose')

exports.blockUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const action = req.params.action; // 'block' or 'unblock'

    if (!mongoose.isValidObjectId(userId)) {
        return next(new AppError("Invalid user ID", 400));
    }

    const user = await User.findByIdAndUpdate(userId, { blocked: action === 'block' });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const message = action === 'block' ? 'User blocked successfully' : 'User unblocked successfully';

    res.status(200).json({
        status: "success",
        data: {
            message: message,
        },
    });
});








