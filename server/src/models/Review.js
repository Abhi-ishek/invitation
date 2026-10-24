import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      name: { type: String, required: true },
      avatar: { type: String, default: '' },
      city: { type: String, default: 'Delhi' },
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      default: 'Wedding Invitation Video',
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
