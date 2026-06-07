const mongoose = require('mongoose');
const { slug } = require('../controllers/globalFactory');

const schema = new mongoose.Schema(
  {
    serialNumber: {
      type: Number,
      required: true,
      unique: true
    },
    representativeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'المندوب مطلوب']
    },
    bookstoreId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bookstore',
      required: [true, 'المكتبة مطلوبة']
    },
    bookIds: [
      {
        bookId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Book',
          required: [true, 'الكتاب مطلوب']
        },
        price: {
          type: Number,
          required: [true, 'سعر الكتاب مطلوب']
        },
        count: {
          type: Number,
          required: [true, 'عدد الكتب مطلوب']
        },
        total: {
          type: Number,
          required: [true, 'المجموع مطلوب']
        }
      }
    ],
    paymentType: {
      type: String,
      enum: ['cash', 'credit'], // نقدي و آجل
      required: [true, 'عنوان الكتاب مطلوب']
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid'
    },
    totalCost: {
      type: Number,
      required: [true, 'اجمالي التكلفة مطلوب']
    },
    totalPrice: {
      type: Number,
      required: [true, 'اجمالي السعر مطلوب']
    },
    paidAmount: {
      type: Number,
      required: [true, 'القيمة المدفوعة مطلوبة']
    },
    remainingAmount: {
      type: Number,
      required: [true, 'المبلغ المتبقي مطلوب']
    },
    orderBooksCount: {
      type: Number,
      required: [true, 'عدد الكتب مطلوب']
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now,
      select: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'PurchaseInvoices must belong to a user']
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

schema.index({
  serialNumber: 1
});

schema.virtual('representative', {
  ref: 'User',
  localField: 'representativeId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('bookstore', {
  ref: 'Bookstore',
  localField: 'bookstoreId',
  foreignField: '_id',
  justOne: true
});

// Virtual for books
schema.virtual('bookIds.book', {
  ref: 'Book',
  localField: 'bookIds.bookId',
  foreignField: '_id'
});

// schema.virtual('books', {
//   ref: 'Book',
//   localField: 'bookIds',
//   foreignField: '_id',
//   justOne: true
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
schema.pre('save', function(next) {
  this.slug = slug(this.serialNumber);
  next();
});

const PurchaseInvoices = mongoose.model('PurchaseInvoices', schema);

module.exports = PurchaseInvoices;
