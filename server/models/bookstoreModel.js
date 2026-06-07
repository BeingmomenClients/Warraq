const mongoose = require('mongoose');
const AppError = require('./../utils/appError');
const { slug } = require('../controllers/globalFactory');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'الاسم مطلوب']
    },
    slug: String,
    address: {
      type: String,
      required: [true, 'العنوان مطلوب']
    },
    phone: {
      type: String
    },
    balance: {
      type: Number,
      default: 0
    },
    booksCount: {
      type: Number,
      default: 0
    },

    representativeIds: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      select: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Bookstore must belong to a user']
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
  name: 1
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
schema.pre('save', function(next) {
  this.slug = slug(this.name);
  next();
});

schema.virtual('representatives', {
  ref: 'User',
  localField: 'representativeIds',
  foreignField: '_id'
  // justOne: true
});

// Add this pre-remove hook
schema.pre('findOneAndDelete', async function(next) {
  const { balance } = await this.model.findOne(this.getQuery());

  if (balance > 0) {
    return next(new AppError('لا يمكن حذف المكتبة لأن لديها رصيد متبقي', 400));
  }

  if (balance < 0) {
    return next(new AppError('لا يمكن حذف المكتبة لأن عليها ديون مستحقة', 400));
  }

  next();
});

const Bookstore = mongoose.model('Bookstore', schema);

module.exports = Bookstore;
