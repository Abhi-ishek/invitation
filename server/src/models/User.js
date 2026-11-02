import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'designer'],
      default: 'customer',
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    addresses: [
      {
        city: String,
        state: String,
        country: { type: String, default: 'India' },
        pincode: String,
      },
    ],
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Access token generator
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.ACCESS_TOKEN_SECRET || 'wedding_wishcraft_access_secret_key_2026',
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
  );
};

// Refresh token generator
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET || 'wedding_wishcraft_refresh_secret_key_2026',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

export const User = mongoose.model('User', userSchema);
