import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['phone_verification', 'login', 'password_reset', 'checkout_verification'],
      default: 'phone_verification',
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatic TTL cleanup by MongoDB
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ phone: 1, purpose: 1 });

export const Otp = mongoose.model('Otp', otpSchema);

