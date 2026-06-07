const mongoose = require('mongoose');
const { slug } = require('../controllers/globalFactory');

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'عنوان الكتاب مطلوب'],
      unique: true
    },
    slug: String,
    author: {
      type: String
    },
    price: {
      type: String,
      required: [true, 'سعر البيع مطلوب']
    },
    purchasePrice: {
      type: String,
      required: [true, 'سعر الشراء مطلوب']
    },
    availableQuantity: {
      type: Number,
      default: 0
    },
    // إجمالي عدد بيع هذا الكتاب
    totalSales: {
      type: Number,
      default: 0
    },
    // إجمالي الايراد هذا الكتاب
    totalRevenue: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Book must belong to a user']
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
  title: 1
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
schema.pre('save', function(next) {
  this.slug = slug(this.title);
  next();
});

const Book = mongoose.model('Book', schema);

module.exports = Book;
