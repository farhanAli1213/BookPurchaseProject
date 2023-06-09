// const Enum =require('enum')
const catchAsync = require('./../Utils/catchAsyns')
const AppError = require('./../Utils/appError')
const APIFeatures = require('./../Utils/apiFeatures');
const bookModel = require('./../model/bookModel')



exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id)

    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})



exports.updateOne = Model => catchAsync(async (req, res, next) => {

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: document
        }
    })
});


exports.createOne = Model => catchAsync(async (req, res, next) => {
    
    const document = await Model.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            data: document
        }
    })
})


exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {

    // Data embeded in POSTMAN output not in db
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const document = await query;

    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: document
        }
    })
})


exports.getAll = Model => catchAsync(async (req, res, next) => {

    let filter = {};
    if (req.params.bookId) {
        filter = { book: req.params.bookId };
    }

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    // const document = await features.query.explain();
    const document = await features.query;

    res.status(200).json({
        status: 'success',
        results: document.length,
        data: {
            data: document
        }
    })
})