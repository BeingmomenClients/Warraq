const User = require('../models/userModel');
const PurchaseInvoice = require('../models/purchaseInvoicesModel');
const CollectRepresentative = require('../models/collectRepresentativeModel');
const Bookstore = require('../models/bookstoreModel');
const Book = require('../models/bookModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getStatistics = catchAsync(async (req, res, next) => {
  const { dateFrom, dateTo } = req.query;

  const dateFilter = {};
  if (dateFrom || dateTo) {
    dateFilter.createdAt = {};
    if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
  }

  const [
    totalUsers,
    totalBooks,
    totalBookstores,
    totalInvoices,
    totalSales,
    totalCost,
    topSellingBooks,
    topBookstores,
    financialSummary,
    totalRepresentatives,
    topRepresentatives,
    totalCollected,
    totalBookstoreBalance
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'dev' } }),
    Book.countDocuments(),
    Bookstore.countDocuments(),
    PurchaseInvoice.countDocuments(dateFilter),
    PurchaseInvoice.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]),
    PurchaseInvoice.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]),
    PurchaseInvoice.aggregate([
      { $match: dateFilter },
      { $unwind: '$bookIds' },
      {
        $group: {
          _id: '$bookIds.bookId',
          totalSold: { $sum: '$bookIds.count' },
          totalRevenue: {
            $sum: { $multiply: ['$bookIds.count', '$bookIds.price'] }
          }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 1,
          title: '$bookDetails.title',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]),
    Bookstore.aggregate([
      { $sort: { booksCount: -1 } },
      { $limit: 3 },
      { $project: { _id: 0, name: 1, booksCount: 1 } },
      {
        $group: {
          _id: null,
          topBookstores: { $push: '$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          topBookstores: {
            $cond: {
              if: { $eq: [{ $size: '$topBookstores' }, 0] },
              then: [{ name: 'N/A', booksCount: 0 }],
              else: '$topBookstores'
            }
          }
        }
      },
      { $unwind: '$topBookstores' },
      { $replaceRoot: { newRoot: '$topBookstores' } }
    ]),
    User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalAmountToCollect: {
            $sum: { $cond: [{ $lt: ['$balance', 0] }, { $abs: '$balance' }, 0] }
          }
        }
      }
    ]),
    User.countDocuments({ role: 'representative' }),
    PurchaseInvoice.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$representativeId',
          totalSales: { $sum: '$totalPrice' },
          invoicesCount: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'representative'
        }
      },
      { $unwind: '$representative' },
      {
        $project: {
          _id: 0,
          name: '$representative.name',
          totalSales: 1,
          invoicesCount: 1
        }
      }
    ]),
    CollectRepresentative.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]),
    Bookstore.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$balance' }
        }
      }
    ])
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalBooks,
      totalBookstores,
      totalInvoices,
      totalSales: totalSales[0]?.total || 0,
      totalCost: totalCost[0]?.total || 0,
      topSellingBooks,
      topBookstores,
      totalAmountToCollect: financialSummary[0]?.totalAmountToCollect || 0,
      totalRepresentatives,
      topRepresentatives,
      totalCollected: totalCollected[0]?.totalAmount || 0,
      totalBookstoreBalance: totalBookstoreBalance[0]?.totalBalance || 0
    }
  });
});
exports.getIndividualRepresentativeStatistics = catchAsync(
  async (req, res, next) => {
    const representativeId = req.params.id;

    // Check if the representative exists
    const representative = await User.findOne({
      _id: representativeId,
      role: 'representative'
    });
    if (!representative) {
      return next(new AppError('No representative found with that ID', 404));
    }

    // Ensure representatives can only access their own statistics
    if (req.user.role === 'representative' && req.user.id !== req.params.id) {
      return next(new AppError('You can only view your own statistics', 403));
    }

    const [
      salesData,
      collectedFromRepresentative,
      managedBookstores,
      topSellingBooks,
      bookstoreBalances
    ] = await Promise.all([
      PurchaseInvoice.aggregate([
        { $match: { representativeId: representative._id } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalPrice' },
            invoicesCount: { $sum: 1 },
            totalBooksCount: { $sum: '$orderBooksCount' },
            paidAmount: { $sum: '$paidAmount' },
            remainingAmount: { $sum: '$remainingAmount' }
          }
        }
      ]),
      CollectRepresentative.aggregate([
        { $match: { representativeId: representative._id } },
        {
          $group: {
            _id: null,
            totalCollected: { $sum: '$amount' }
          }
        }
      ]),
      Bookstore.find({ representativeIds: representative._id })
        .sort({ booksCount: -1 }) // Sort by booksCount descending (highest booksCount first)
        .limit(3)
        .select('name balance booksCount'),
      PurchaseInvoice.aggregate([
        { $match: { representativeId: representative._id } },
        { $unwind: '$bookIds' },
        {
          $group: {
            _id: '$bookIds.bookId',
            totalSold: { $sum: '$bookIds.count' },
            totalRevenue: {
              $sum: { $multiply: ['$bookIds.count', '$bookIds.price'] }
            }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'bookDetails'
          }
        },
        { $unwind: '$bookDetails' },
        {
          $project: {
            _id: 0,
            title: '$bookDetails.title',
            totalSold: 1,
            totalRevenue: 1
          }
        }
      ]),
      Bookstore.aggregate([
        { $match: { representativeIds: representative._id } },
        {
          $group: {
            _id: null,
            totalAmountToCollect: { $sum: '$balance' },
            bookstoresCount: { $sum: 1 },
            bookstoresWithDebt: {
              $sum: { $cond: [{ $lt: ['$balance', 0] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    const salesStats = salesData[0] || {
      totalSales: 0,
      invoicesCount: 0,
      totalBooksCount: 0,
      paidAmount: 0,
      remainingAmount: 0
    };

    const bookstoreStats = bookstoreBalances[0] || {
      totalAmountToCollect: 0,
      bookstoresCount: 0,
      bookstoresWithDebt: 0
    };

    // Calculate total collected amount
    const totalCollectedAmount =
      (collectedFromRepresentative[0]?.totalCollected || 0) +
      salesStats.paidAmount;

    res.status(200).json({
      status: 'success',
      data: {
        representative: {
          id: representative._id,
          name: representative.name,
          email: representative.email,
          phone: representative.phone,
          balance: representative.balance
        },
        totalSales: salesStats.totalSales,
        invoicesCount: salesStats.invoicesCount,
        totalBooksCount: salesStats.totalBooksCount,
        paidAmount: salesStats.paidAmount,
        remainingAmount: salesStats.remainingAmount,
        totalCollectedAmount,
        managedBookstores: managedBookstores.map(store => ({
          id: store._id,
          name: store.name,
          booksCount: store.booksCount
        })),
        topSellingBooks,
        bookstoreStats: {
          totalAmountToCollect: Math.abs(bookstoreStats.totalAmountToCollect),
          bookstoresCount: bookstoreStats.bookstoresCount,
          bookstoresWithDebt: bookstoreStats.bookstoresWithDebt
        }
      }
    });
  }
);
