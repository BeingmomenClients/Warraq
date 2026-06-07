const Model = require('../models/bookstoreModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.getDataByFilter = catchAsync(async (req, res, next) => {
  if (req.params.representativeId) {
    req.mergeFilter = { representativeIds: req.params.representativeId };
    req.otherPop = '-representativeIds';
  }

  next();
});

exports.getAllNoPagination = factory.getAllNoPagination(
  Model,
  [],
  (selectFields = 'name')
);

exports.getAll = factory.getAll(Model, {
  popOptions: [
    { path: 'representatives', select: 'name ' }
  ]
});
exports.getOne = factory.getOne(Model);
exports.createOne = factory.createOne(Model);
exports.updateOne = factory.updateOne(Model);

exports.deleteOne = factory.deleteOne(Model);
