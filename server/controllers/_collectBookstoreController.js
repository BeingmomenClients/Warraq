const Model = require('../models/collectBookstoreModel');
const Bookstore = require('../models/bookstoreModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

exports.getDataByFilter = catchAsync(async (req, res, next) => {
  if (req.params.bookstoreId) {
    req.mergeFilter = { bookstoreId: req.params.bookstoreId };
  }

  next();
});

exports.getAll = factory.getAll(Model);
exports.getOne = factory.getOne(Model);

// Middleware to start a transaction
exports.startTransaction = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  req.dbSession = session;
  next();
});

exports.updateBookstore = catchAsync(async (req, res, next) => {
  const { bookstoreId, amount } = req.body;
  const oldCollect = req.oldCollect;

  let balanceChange = 0;

  if (oldCollect) {
    // For update: calculate the differences
    balanceChange = oldCollect.amount - amount;
  } else {
    // For create: use the full amount
    balanceChange = amount;
  }

  const updateBookstore = await Bookstore.findByIdAndUpdate(
    bookstoreId,
    {
      $inc: {
        balance: balanceChange
      }
    },
    { new: true, session: req.dbSession }
  );

  if (!updateBookstore) {
    throw new AppError('Bookstore not found', 400);
  }

  next();
});

exports.getOldCollect = catchAsync(async (req, res, next) => {
  const oldCollect = await Bookstore.findById(req.params.id).session(
    req.dbSession
  );
  if (!oldCollect) {
    return next(new AppError('No document found with that ID', 400));
  }
  req.oldCollect = oldCollect;
  next();
});

exports.createOne = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const doc = await Model.create([req.body], { session: req.dbSession });
  req.createdInvoice = doc[0];
  next();
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    session: req.dbSession
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 400));
  }

  req.updatedInvoice = doc;
  next();
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id, {
    session: req.dbSession
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 400));
  }

  req.deletedInvoice = doc;
  next();
});

exports.revertAllChanges = catchAsync(async (req, res, next) => {
  const { bookstoreId, amount } = req.deletedInvoice;

  const updateBookstore = await Bookstore.findByIdAndUpdate(
    bookstoreId,
    {
      $inc: {
        balance: -amount
      }
    },
    { new: true, session: req.dbSession }
  );
  if (!updateBookstore) {
    throw new AppError('bookstore not found', 400);
  }
  next();
});

// Middleware to commit the transaction and send response
exports.commitTransactionAndRespond = catchAsync(async (req, res, next) => {
  await req.dbSession.commitTransaction();
  req.dbSession.endSession();

  let statusCode, message, responseData;

  if (req.createdInvoice) {
    statusCode = 201;
    message = 'Created successfully';
    responseData = req.createdInvoice;
  } else if (req.updatedInvoice) {
    statusCode = 200;
    message = 'Updated successfully';
    responseData = req.updatedInvoice;
  } else if (req.deletedInvoice) {
    statusCode = 200;
    message = 'Deleted successfully';
    responseData = req.deletedInvoice;
  } else {
    // This case should not happen, but we'll handle it just in case
    statusCode = 200;
    message = 'Operation completed successfully';
    responseData = null;
  }

  res.status(statusCode).json({
    status: 'success',
    message: message,
    data: responseData
  });
});

// Error handling middleware
exports.handleTransactionError = catchAsync(async (err, req, res, next) => {
  if (req.dbSession) {
    await req.dbSession.abortTransaction();
    req.dbSession.endSession();
  }
  next(err);
});
