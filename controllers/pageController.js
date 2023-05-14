const Page = require('./../model/pagesModel')
const catchAsync = require('./../Utils/catchAsyns')
const AppError = require('./../Utils/appError')
const factoryFunctions = require('./handlerFactory');



exports.getAllPages = factoryFunctions.getAll(Page)
exports.createPage = factoryFunctions.createOne(Page);
exports.getPageById = factoryFunctions.getOne(Page);
exports.updatePage = factoryFunctions.updateOne(Page);
exports.deletePage = factoryFunctions.deleteOne(Page);
