import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String },
  customizationData: {
    brideName: { type: String, default: '' },
    groomName: { type: String, default: '' },
    weddingDate: { type: String, default: '' },
    venue: { type: String, default: '' },
    events: [
      {
        eventName: String,
        eventDate: String,
        venue: String,
      },
    ],
    language: { type: String, default: 'English & Hindi' },
    musicChoice: { type: String, default: 'Default Shehnai Symphony' },
    notes: { type: String, default: '' },
    photoUrls: [{ type: String }],
  },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Order Placed', 'Payment Verification', 'In Production', 'Preview Ready', 'Completed', 'Cancelled'],
    required: true,
  },
  note: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponUsed: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'under_review', 'paid', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Razorpay', 'COD', 'UPI'],
      default: 'Razorpay',
    },
    weddingDetails: {
      groomName: { type: String, default: '' },
      groomMotherName: { type: String, default: '' },
      groomFatherName: { type: String, default: '' },

      brideName: { type: String, default: '' },
      brideMotherName: { type: String, default: '' },
      brideFatherName: { type: String, default: '' },

      haldiDate: { type: String, default: '' },
      haldiTimings: { type: String, default: '' },
      haldiVenue: { type: String, default: '' },

      weddingDate: { type: String, default: '' },
      weddingTimings: { type: String, default: '' },
      weddingVenue: { type: String, default: '' },

      mehendiDate: { type: String, default: '' },
      mehendiTimings: { type: String, default: '' },
      mehendiVenue: { type: String, default: '' },

      additionalNotes: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    orderStatus: {
      type: String,
      enum: ['Order Placed', 'Payment Verification', 'In Production', 'Preview Ready', 'Completed', 'Cancelled'],
      default: 'Order Placed',
    },
    statusHistory: [statusHistorySchema],
    previewVideoUrl: {
      type: String,
      default: null,
    },
    finalVideoUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to generate order number if not provided
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    this.orderNumber = `#WW${randomSuffix}`;
  }
  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [
      {
        status: 'Order Placed',
        note: 'Order successfully created and awaiting production queue.',
        timestamp: new Date(),
      },
    ];
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);
