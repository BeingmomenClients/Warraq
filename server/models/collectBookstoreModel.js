const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'الكمية مطلوبة']
    },
    note: {
      type: String,
      required: [true, 'الملاحظة مطلوبة']
    },
    bookstoreId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'BookstoreId is required']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Collect Bookstore belong to a user']
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

const CollectBookstore = mongoose.model('CollectBookstore', schema);

module.exports = CollectBookstore;
