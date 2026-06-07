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
    representativeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'RepresentativeId is required']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Collect Representative belong to a user']
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

const CollectRepresentative = mongoose.model('CollectRepresentative', schema);

module.exports = CollectRepresentative;
