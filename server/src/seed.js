import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import mongoose from 'mongoose';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { User } from './models/User.js';
import { Coupon } from './models/Coupon.js';
import { Video } from './models/Video.js';
import { ALL_57_PRODUCTS } from './syncCloudinary.js';

export const ALL_PRODUCTS = ALL_57_PRODUCTS;

const CATEGORIES = [
  {
    name: '3D AI Invitation',
    slug: '3d-ai-invitation',
    description: 'Cinematic hyper-realistic 3D avatars of the couple with personalized AI voiceovers and royal set pieces.',
    icon: 'Sparkles',
    isPopular: true,
    order: 1,
  },
  {
    name: 'Royal Traditional',
    slug: 'royal-traditional',
    description: 'Majestic Rajasthani forts, palatial arches, gold leaf calligraphy and sacred Vedic shlokas.',
    icon: 'Crown',
    isPopular: true,
    order: 2,
  },
  {
    name: 'Caricature & Save The Date',
    slug: 'caricature-save-the-date',
    description: 'Whimsical illustrated couple caricatures animating your meet-cute story, proposal and celebration dates.',
    icon: 'Smile',
    isPopular: true,
    order: 3,
  },
  {
    name: 'Minimal & Modern',
    slug: 'minimal-modern',
    description: 'Contemporary chic typography, monochrome noir with champagne accents, and sleek 60fps transitions.',
    icon: 'Layout',
    isPopular: false,
    order: 4,
  },
  {
    name: 'Muslim Invitations',
    slug: 'muslim-invitations',
    description: 'Intricate Islamic geometric patterns, Quranic Ayahs, Bismillah calligraphy and opulent emerald gold mandaps.',
    icon: 'Moon',
    isPopular: false,
    order: 5,
  },
  {
    name: 'South Indian',
    slug: 'south-indian',
    description: 'Temple architecture, auspicious Nadaswaram chords, brass lamps, and traditional silk border frames.',
    icon: 'Flame',
    isPopular: false,
    order: 6,
  },
  {
    name: 'Custom Designs',
    slug: 'custom-designs',
    description: '100% tailor-made bespoke video concepts designed from scratch with our senior motion artists.',
    icon: 'Wand2',
    isPopular: false,
    order: 7,
  },
];

async function seed() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedding_wishcraft';
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected successfully.');

  console.log('Clearing old product, video, and category collections...');
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Video.deleteMany({});

  console.log('Seeding 7 Invitation Categories...');
  await Category.insertMany(CATEGORIES);

  console.log(`Seeding all ${ALL_57_PRODUCTS.length} Cloudinary-powered products...`);
  await Product.insertMany(ALL_57_PRODUCTS);

  console.log(`Seeding Video collection for legacy endpoints...`);
  const videosForCollection = ALL_57_PRODUCTS.map((p) => ({
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: p.category === 'Royal Traditional' ? 'Royal Palace' : p.category === '3D AI Invitation' ? 'Royal Palace' : p.category === 'Caricature & Save The Date' ? 'Animated Caricature' : p.category === 'Minimal & Modern' ? 'Modern Minimalist' : p.category === 'South Indian' ? 'Traditional Vedic' : 'Royal Palace',
    price: p.price,
    originalPrice: p.originalPrice,
    durationSeconds: p.durationSeconds,
    aspectRatio: '9:16',
    previewVideoUrl: p.previewVideo,
    thumbnailUrl: p.thumbnail,
    tags: p.tags,
    features: p.features,
    isFeatured: ['Bestseller', 'Trending'].includes(p.badge),
    deliveryHours: p.deliveryHours,
    rating: p.rating,
    reviewsCount: p.numReviews,
  }));
  await Video.insertMany(videosForCollection);

  console.log('Seeding Promo Coupons...');
  await Coupon.deleteMany({});
  await Coupon.create({
    code: 'WELCOME10',
    discountPercent: 10,
    firstOrderOnly: true,
    usageLimit: 5000,
    isActive: true,
  });
  await Coupon.create({
    code: 'ROYAL20',
    discountPercent: 20,
    firstOrderOnly: false,
    usageLimit: 1000,
    isActive: true,
  });

  console.log('Checking / Seeding Demo Users...');
  const existingAdmin = await User.findOne({ email: 'admin@weddingwishcraft.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Wishcraft Admin',
      email: 'admin@weddingwishcraft.com',
      password: 'Wishcraft@2026',
      role: 'admin',
      phone: '+91 98765 00000',
    });
    console.log('Created Admin: admin@weddingwishcraft.com / Wishcraft@2026');
  }

  const existingCustomer = await User.findOne({ email: 'couple@weddingwishcraft.com' });
  if (!existingCustomer) {
    await User.create({
      name: 'Aditi & Rohan',
      email: 'couple@weddingwishcraft.com',
      password: 'Love@2026',
      role: 'customer',
      phone: '+91 98765 11111',
    });
    console.log('Created Customer: couple@weddingwishcraft.com / Love@2026');
  }

  console.log(`✨ All ${ALL_57_PRODUCTS.length} Cloudinary video invitation products successfully seeded to MongoDB!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
