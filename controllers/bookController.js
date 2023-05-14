const Book = require("./../model/bookModel");
const User = require("./../model/userModel");
const Purchasing = require("./../model/purchasingModel");
const catchAsync = require("./../Utils/catchAsyns");
const AppError = require("./../Utils/appError");
const factoryFunctions = require("./handlerFactory");

exports.getAllBooks = factoryFunctions.getAll(Book);
exports.createBook = factoryFunctions.createOne(Book);
exports.updateBook = factoryFunctions.updateOne(Book);
exports.deleteBook = factoryFunctions.deleteOne(Book);

exports.getBookById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.blocked) {
    return next(
      new AppError("You can't viewed this book because you are blocked", 400)
    );
  }

  const userId = user;
  const books = await Purchasing.find({ user: userId });
  const bookIds = books.map((book) => book.book);
  const bookId = req.params.id;
  const desiredObjectId = bookIds.find(
    (bookIds) => bookIds.toString() === bookId
  );

  if (bookId == desiredObjectId) {
    try {
      const book = await Book.findById(req.params.id).populate("chapters");
      res.status(200).json({
        status: "success",
        data: {
          book,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: "Invalid data sent!",
      });
    }
  } else {
    return next(
      new AppError(
        "You can't viewed this book because you don't buyed this book",
        400
      )
    );
  }
});


// Sales Report
exports.getSalesReport = catchAsync(async (req, res, next) => {
  const { date, period } = req.params;
  const year = date * 1;
  let startDate, endDate;

  if (period === 'daily') {
    startDate = new Date(`${year}-01-01`);
    endDate = new Date(`${year}-12-30`);
  } else if (period === 'weekly') {
    startDate = new Date(`${year}-01-01`);
    endDate = new Date(`${year}-12-30`);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  } else if (period === 'monthly') {
    startDate = new Date(`${year}-01-01`);
    endDate = new Date(`${year}-12-31`);
  }
  else if (period === 'overall') {
    startDate = new Date('1900-01-01');
    endDate = new Date('2100-12-31');
  }

  const report = await Purchasing.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: [period, 'daily'] },
            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            { $cond: [
              { $eq: [period, 'weekly'] },
              { $dateToString: { format: '%Y-%U', date: '$createdAt' } },
              { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
            ]}
          ]
        },
        numBookSales: { $sum: 1 },
        totalPrice: { $sum: '$price' }
      },
    },
    {
      $addFields: { period: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { period: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      report,
    },
  });
});







