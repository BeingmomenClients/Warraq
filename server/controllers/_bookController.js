const Model = require('../models/bookModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.getAllNoPagination = factory.getAllNoPagination(
  Model,
  [],
  (selectFields = 'title availableQuantity price')
);

exports.getDataByFilter = catchAsync(async (req, res, next) => {
  req.otherPop = '-purchasePrice';

  next();
});

exports.getAllForRepresentative = factory.getAll(Model);
exports.getAll = factory.getAll(Model);
exports.getOne = factory.getOne(Model);
exports.createOne = factory.createOne(Model);
exports.updateOne = factory.updateOne(Model);

exports.deleteOne = factory.deleteOne(Model);
