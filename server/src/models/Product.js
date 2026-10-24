import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        '3D AI Invitation',
        'Royal Traditional',
        'Caricature & Save The Date',
        'Minimal & Modern',
        'Muslim Invitations',
        'South Indian',
        'Custom Designs',
      ],
      default: 'Royal Traditional',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    tags: [{ type: String }],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: function () {
        if (this.originalPrice && this.originalPrice > this.price) {
          return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
        }
        return 0;
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail image URL is required'],
    },
    previewVideo: {
      type: String,
      required: [true, 'Preview video URL is required'],
    },
    galleryImages: [{ type: String }],
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      enum: ['Bestseller', 'New', 'Trending', 'Popular', 'None'],
      default: 'None',
    },
    durationSeconds: {
      type: Number,
      default: 50,
    },
    aspectRatio: {
      type: String,
      default: '9:16',
    },
    customizationFields: {
      brideName: { type: Boolean, default: true },
      groomName: { type: Boolean, default: true },
      weddingDate: { type: Boolean, default: true },
      venue: { type: Boolean, default: true },
      eventsTimeline: { type: Boolean, default: true },
      photoUploads: { type: Boolean, default: true },
      musicChoice: { type: Boolean, default: true },
      language: { type: Boolean, default: true },
    },
    features: [{ type: String }],
    musicTrack: {
      type: String,
      default: 'Royal Shehnai & Sitar Blend',
    },
    deliveryHours: {
      type: Number,
      default: 24,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function () {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

export const Product = mongoose.model('Product', productSchema);
