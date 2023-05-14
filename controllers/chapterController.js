const Chapter = require('./../model/chaptersModel')
const catchAsync = require('./../Utils/catchAsyns')
const AppError = require('./../Utils/appError')
const factoryFunctions = require('./handlerFactory');



exports.getAllChapters = factoryFunctions.getAll(Chapter)
exports.createChapter = factoryFunctions.createOne(Chapter);
exports.getChapterById = factoryFunctions.getOne(Chapter);
exports.updateChapter = factoryFunctions.updateOne(Chapter);
exports.deleteChapter = factoryFunctions.deleteOne(Chapter);
