const mongoose = require('mongoose');
const Model = require('../models/purchaseInvoicesModel');
const Book = require('../models/bookModel');
const Counter = require('../models/counterModel');
const Bookstore = require('../models/bookstoreModel');
const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = factory.getAll(Model, {
  popOptions: [
    { path: 'bookstore', select: 'name' },
    { path: 'representative', select: 'name' }
  ],
  optSort: {
    sort: 'serialNumber'
  }
});

exports.getOne = factory.getOne(Model, [
  { path: 'bookstore', select: 'name' },
  { path: 'representative', select: 'name' },
  {
    path: 'bookIds.book',
    select: 'title price availableQuantity' // Add any fields you want to select from the Book model
  }
]);

// Middleware to start a transaction
exports.startTransaction = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  req.dbSession = session;
  next();
});

exports.checkBookStockAndCalculateTotal = catchAsync(async (req, res, next) => {
  const { bookIds } = req.body;
  let totalPrice = 0;
  let totalCost = 0;

  for (let bookEntry of bookIds) {
    const bookInDb = await Book.findById(bookEntry.bookId).session(
      req.dbSession
    );
    if (!bookInDb) {
      throw new AppError(`Book with id ${bookEntry.bookId} not found`, 404);
    }

    if (bookInDb.availableQuantity < bookEntry.count) {
      throw new AppError(
        `لا يوجد مخزون كافٍ للكتاب: المتاح: ${
          bookInDb.availableQuantity
        }, المطلوب: ${bookEntry.count}`,
        400
      );
    }

    totalPrice += parseFloat(bookEntry.price) * bookEntry.count;
    totalCost += parseFloat(bookInDb.purchasePrice) * bookEntry.count;
  }

  req.body.totalPrice = totalPrice;
  req.body.totalCost = totalCost;
  next();
});

exports.prepareInvoice = catchAsync(async (req, res, next) => {
  const { totalPrice, paidAmount, paymentType, bookIds } = req.body;

  if (paymentType === 'cash') {
    req.body.paidAmount = totalPrice;
    req.body.remainingAmount = 0;
    req.body.paymentStatus = 'paid';
  } else {
    req.body.remainingAmount = totalPrice - paidAmount;
    req.body.paymentStatus = req.body.remainingAmount === 0 ? 'paid' : 'unpaid';
  }

  req.body.orderBooksCount = bookIds.reduce(
    (total, bookEntry) => total + Number(bookEntry.count),
    0
  );

  req.body.bookIds = req.body.bookIds.map(book => ({
    ...book,
    total: book.price * book.count
  }));

  req.body.user = req.user.id;
  next();
});

// New middleware to generate serial number
exports.generateSerialNumber = catchAsync(async (req, res, next) => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'purchaseInvoiceSerial' },
    { $inc: { value: 1 } },
    { new: true, upsert: true, session: req.dbSession }
  );

  req.body.serialNumber = counter.value;
  next();
});

exports.createOne = catchAsync(async (req, res, next) => {
  req.body.representativeId = req.user.id;
  const doc = await Model.create([req.body], { session: req.dbSession });
  req.createdInvoice = doc[0];
  next();
});

exports.getOldInvoice = catchAsync(async (req, res, next) => {
  const oldInvoice = await Model.findById(req.params.id).session(req.dbSession);
  if (!oldInvoice) {
    return next(new AppError('No document found with that ID', 404));
  }
  req.oldInvoice = oldInvoice;
  next();
});

exports.updateOne = catchAsync(async (req, res, next) => {
  req.body.representativeId = req.user.id;
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    session: req.dbSession
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  req.updatedInvoice = doc;
  next();
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id, {
    session: req.dbSession
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  req.deletedInvoice = doc;
  next();
});

exports.updateBookstore = catchAsync(async (req, res, next) => {
  const { bookstoreId, paidAmount, totalPrice } = req.body;
  const oldInvoice = req.oldInvoice;

  let balanceChange = 0;
  let booksCountChange = 0;

  const newRemainingAmount = totalPrice - paidAmount;

  if (oldInvoice) {
    // For update: calculate the differences
    const oldRemainingAmount = oldInvoice.totalPrice - oldInvoice.paidAmount;
    balanceChange = oldRemainingAmount - newRemainingAmount;
    booksCountChange = req.body.orderBooksCount - oldInvoice.orderBooksCount;
  } else {
    // For create: use the full amounts
    balanceChange = -newRemainingAmount;
    booksCountChange = req.body.orderBooksCount;
  }

  const updatedBookstore = await Bookstore.findByIdAndUpdate(
    bookstoreId,
    {
      $inc: {
        balance: balanceChange,
        booksCount: booksCountChange
      }
    },
    { new: true, session: req.dbSession }
  );

  if (!updatedBookstore) {
    throw new AppError('Bookstore not found', 404);
  }

  next();
});

exports.updateUserOrRepresentative = catchAsync(async (req, res, next) => {
  const {
    representativeId,
    remainingAmount,
    orderBooksCount,
    totalPrice
  } = req.body;

  const oldInvoice = req.oldInvoice;

  let balanceChange = 0;
  let booksCountChange = 0;
  let totalOutstandingSales = 0;

  if (oldInvoice) {
    // For update: calculate the differences
    balanceChange = oldInvoice.remainingAmount - remainingAmount;
    booksCountChange = orderBooksCount - oldInvoice.orderBooksCount;
    totalOutstandingSales = -oldInvoice.totalPrice + totalPrice;
  } else {
    // For create: use the full amounts
    balanceChange = -remainingAmount;
    booksCountChange = orderBooksCount;
    totalOutstandingSales = totalPrice;
  }

  const updatedUser = await User.findByIdAndUpdate(
    representativeId,
    {
      $inc: {
        balance: balanceChange,
        booksCount: booksCountChange,
        totalOutstandingSales: totalOutstandingSales
      }
    },
    { new: true, session: req.dbSession }
  );

  if (!updatedUser) {
    throw new AppError('User or representative not found', 404);
  }

  next();
});

exports.adjustBookQuantity = catchAsync(async (req, res, next) => {
  const newBookIds = req.body.bookIds;
  const oldBookIds = (req.oldInvoice && req.oldInvoice.bookIds) || [];

  const bookAdjustments = new Map();

  // Calculate the differences
  oldBookIds.forEach(oldBook => {
    bookAdjustments.set(oldBook.bookId.toString(), {
      count: oldBook.count,
      profit: oldBook.count * oldBook.price
    });
  });

  newBookIds.forEach(newBook => {
    const oldAdjustment = bookAdjustments.get(newBook.bookId.toString()) || {
      count: 0,
      profit: 0
    };
    bookAdjustments.set(newBook.bookId.toString(), {
      count: oldAdjustment.count - newBook.count,
      profit: -newBook.count * newBook.price + oldAdjustment.profit
    });
  });

  // Apply the adjustments
  for (let [bookId, adjustment] of bookAdjustments) {
    if (adjustment.count !== 0 || adjustment.profit !== 0) {
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
          $inc: {
            availableQuantity: adjustment.count,
            totalSales: -adjustment.count,
            totalRevenue: -adjustment.profit
          }
        },
        { new: true, session: req.dbSession }
      );

      if (updatedBook.availableQuantity < 0) {
        throw new AppError(
          `Unexpected error: Negative stock for book: ${updatedBook.title}`,
          500
        );
      }
    }
  }

  next();
});
exports.revertAllChanges = catchAsync(async (req, res, next) => {
  const {
    bookstoreId,
    representativeId,
    remainingAmount,
    orderBooksCount,
    bookIds,
    totalPrice
  } = req.deletedInvoice;

  // Revert bookstore changes
  await Bookstore.findByIdAndUpdate(
    bookstoreId,
    {
      $inc: {
        balance: remainingAmount,
        booksCount: -orderBooksCount
      }
    },
    { session: req.dbSession }
  );

  // Revert user/representative changes
  await User.findByIdAndUpdate(
    representativeId,
    {
      $inc: {
        balance: remainingAmount,
        booksCount: -orderBooksCount,
        totalOutstandingSales: -totalPrice
      }
    },
    { session: req.dbSession }
  );

  // Revert book quantity changes
  for (let bookEntry of bookIds) {
    await Book.findByIdAndUpdate(
      bookEntry.bookId,
      {
        $inc: {
          availableQuantity: bookEntry.count,
          totalSales: -bookEntry.count,
          totalRevenue: -bookEntry.count * bookEntry.price
        }
      },
      { new: true, session: req.dbSession }
    );
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
