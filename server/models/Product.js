const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: { type: Number, required: true },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    category: {
      type: String,
      enum: ['luxury', 'sport', 'classic', 'digital'],
      required: true,
    },
    images: [String],
    thumbnail: String,
    stock: { type: Number, default: 10 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    specs: {
      movement: String,
      caseMaterial: String,
      caseSize: String,
      waterResistance: String,
      crystal: String,
      strap: String,
      powerReserve: String,
      functions: [String],
    },
    colors: [String],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    badge: String,
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

module.exports = mongoose.model('Product', productSchema);
