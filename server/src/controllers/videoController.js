import { Video } from '../models/Video.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import mongoose from 'mongoose';

const CLOUD_NAME = (process.env.CLOUDINARY_CLOUD_NAME || 'vrljkq9h').trim();
const makeVideoUrl = (id) => `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,vc_auto/${id}.mp4`;
const makeThumbUrl = (id, sec = 1) => `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/c_scale,f_auto,q_auto,so_${sec},w_600/${id}.jpg`;

const SAMPLE_VIDEOS = [
  {
    title: 'The Royal Jodhpur Heritage E-Invite',
    slug: 'the-royal-jodhpur-heritage-e-invite',
    description: 'An opulent royal palace theme featuring golden arches, royal peacocks, fireworks, and customized shehnai background score.',
    category: 'Royal Palace',
    price: 2499,
    originalPrice: 4999,
    durationSeconds: 60,
    aspectRatio: '9:16',
    previewVideoUrl: makeVideoUrl('Sample_2'),
    thumbnailUrl: makeThumbUrl('Sample_2'),
    tags: ['Royal', 'Palace', 'Heritage', '4K Video'],
    musicTrack: 'Royal Shehnai & Sitar Symphonic Blend',
    features: ['Custom couple caricatures', 'Unlimited revisions', '4K WhatsApp ready', 'Multi-event timelines'],
    isFeatured: true,
    deliveryHours: 24,
    rating: 4.95,
    reviewsCount: 142,
  },
  {
    title: 'Vedic Sanskriti Sacred Mantras Invitation',
    slug: 'vedic-sanskriti-sacred-mantras-invitation',
    description: 'Sacred Sanskrit shlokas, mangalashtak, floral mandap visuals and traditional brass oil lamp animations.',
    category: 'Traditional Vedic',
    price: 1999,
    originalPrice: 3499,
    durationSeconds: 50,
    aspectRatio: '9:16',
    previewVideoUrl: makeVideoUrl('Sample_3'),
    thumbnailUrl: makeThumbUrl('Sample_3'),
    tags: ['Vedic', 'Traditional', 'Spiritual', 'Sanskrit'],
    musicTrack: 'Vedic Chants & Flute Melody',
    features: ['Ganesh Vandana intro', 'Auspicious muhurat timing', 'HD vertical video', 'Hindi / English bilingual'],
    isFeatured: true,
    deliveryHours: 18,
    rating: 4.88,
    reviewsCount: 98,
  },
  {
    title: '3D Hyper-Real Royal Palace AI Invitation',
    slug: '3d-hyper-real-royal-palace-ai-invitation',
    description: 'Experience your likeness rendered into a grand palace ballroom with 3D fireworks, customizable royal attire, and orchestral audio.',
    category: 'Royal Palace',
    price: 3499,
    originalPrice: 6999,
    durationSeconds: 60,
    aspectRatio: '9:16',
    previewVideoUrl: makeVideoUrl('Sample_1'),
    thumbnailUrl: makeThumbUrl('Sample_1'),
    tags: ['3D AI', 'Royal', 'Ballroom', 'Futuristic'],
    musicTrack: 'Symphonic AI Palace Score',
    features: ['3D Avatar generation from photos', 'Ultra HD 4K file', 'Multilingual voiceover', 'Express 24h delivery'],
    isFeatured: true,
    deliveryHours: 24,
    rating: 4.98,
    reviewsCount: 210,
  },
  {
    title: 'Udaipur Lake Palace Golden Shimmer Invite',
    slug: 'udaipur-lake-palace-golden-shimmer-invite',
    category: 'Destination & Beach',
    price: 2699,
    originalPrice: 5299,
    durationSeconds: 60,
    aspectRatio: '9:16',
    previewVideoUrl: makeVideoUrl('Sample_8'),
    thumbnailUrl: makeThumbUrl('Sample_8'),
    tags: ['Destination', 'Lake Palace', 'Cinematic', 'Udaipur'],
    musicTrack: 'Rajasthani Folk Meets Modern Symphony',
    features: ['Custom travel itinerary cards', 'QR Code map link embedded', 'Bespoke royal monogram', 'VIP RSVP button'],
    isFeatured: true,
    deliveryHours: 24,
    rating: 4.97,
    reviewsCount: 156,
  },
  {
    title: 'Contemporary Champagne & Velvet Noir',
    slug: 'contemporary-champagne-and-velvet-noir',
    description: 'Sleek dark maroon aesthetic with shimmering champagne dust, minimalist typography and smooth 60fps transitions.',
    category: 'Modern Minimalist',
    price: 1899,
    originalPrice: 3799,
    durationSeconds: 45,
    aspectRatio: '9:16',
    previewVideoUrl: makeVideoUrl('Sample_7'),
    thumbnailUrl: makeThumbUrl('Sample_7'),
    tags: ['Modern', 'Editorial', 'Minimalist', 'Noir'],
    musicTrack: 'Cello & Ambient Strings',
    features: ['High-fashion editorial aesthetic', 'Song replacement permitted', 'Multi-page digital card pdf included', '24h delivery'],
    isFeatured: false,
    deliveryHours: 24,
    rating: 4.89,
    reviewsCount: 104,
  },
  {
    title: 'Whimsical Love Story Caricature Animation',
    slug: 'whimsical-love-story-caricature-animation',
    description: 'Charming animated caricatures illustrating how you met, first date, proposal, and wedding celebration itinerary.',
    category: 'Animated Caricature',
    price: 2599,
    originalPrice: 5199,
    durationSeconds: 70,
    aspectRatio: '9:16',
    previewVideoUrl: makeVideoUrl('Sample_11'),
    thumbnailUrl: makeThumbUrl('Sample_11'),
    tags: ['Caricature', 'Love Story', 'Animated', 'Fun'],
    musicTrack: 'Upbeat Bollywood Acoustic Medley',
    features: ['Illustrated avatar face matching', 'Fun interactive scenes', '3 revision cycles', 'Fast WhatsApp delivery'],
    isFeatured: true,
    deliveryHours: 48,
    rating: 4.95,
    reviewsCount: 188,
  },
];

export const getVideos = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      let sortOption = { isFeatured: -1, createdAt: -1 };
      if (sort === 'price-low') sortOption = { price: 1 };
      if (sort === 'price-high') sortOption = { price: -1 };
      if (sort === 'rating') sortOption = { rating: -1 };

      let videos = await Video.find(query).sort(sortOption);

      if (videos.length === 0 && !search && (!category || category === 'All')) {
        // Seed initial sample data to MongoDB
        await Video.insertMany(SAMPLE_VIDEOS);
        videos = await Video.find(query).sort(sortOption);
      }

      return res.status(200).json(new ApiResponse(200, videos, 'Videos fetched successfully from database'));
    }

    // Fallback: Return curated samples when DB isn't running yet
    let filtered = [...SAMPLE_VIDEOS];
    if (category && category !== 'All') {
      filtered = filtered.filter((v) => v.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      filtered = filtered.filter((v) => v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return res.status(200).json(new ApiResponse(200, filtered, 'Videos fetched successfully (curated catalog)'));
  } catch (error) {
    next(error);
  }
};

export const getVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const video = await Video.findById(id);
      if (video) {
        return res.status(200).json(new ApiResponse(200, video, 'Video fetched successfully'));
      }
    }

    const fallback = SAMPLE_VIDEOS.find((v) => v._id === id || v.slug === id);
    if (!fallback) {
      throw new ApiError(404, 'Video invitation template not found');
    }

    return res.status(200).json(new ApiResponse(200, fallback, 'Video fetched successfully'));
  } catch (error) {
    next(error);
  }
};
