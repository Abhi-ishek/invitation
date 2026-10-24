import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Royal Palace', 'Modern Minimalist', 'Traditional Vedic', 'Floral Bloom', 'Destination & Beach', 'Animated Caricature'],
      default: 'Royal Palace',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    durationSeconds: {
      type: Number,
      default: 45,
    },
    aspectRatio: {
      type: String,
      enum: ['9:16', '16:9', '1:1'],
      default: '9:16',
    },
    previewVideoUrl: {
      type: String,
      required: [true, 'Preview video URL is required'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail image URL is required'],
    },
    tags: [{ type: String }],
    musicTrack: {
      type: String,
      default: 'Shehnai & Sitar Symphony',
    },
    features: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    deliveryHours: {
      type: Number,
      default: 24,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Video = mongoose.model('Video', videoSchema);
