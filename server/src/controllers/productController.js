import { Product } from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      badge,
      sort = 'featured',
      page = 1,
      limit = 100,
    } = req.query;

    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (badge && badge !== 'All') {
      query.badge = badge;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { salesCount: -1, rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            limit: Number(limit),
          },
        },
        'Products fetched successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getTrendingAndFeatured = async (req, res, next) => {
  try {
    const [trending, bestsellers] = await Promise.all([
      Product.find({ isActive: true, badge: { $in: ['Trending', 'Bestseller'] } })
        .sort({ rating: -1 })
        .limit(6),
      Product.find({ isActive: true }).sort({ salesCount: -1 }).limit(6),
    ]);

    const result = trending.length > 0 ? trending : bestsellers;

    res.status(200).json(new ApiResponse(200, result, 'Trending products fetched'));
  } catch (error) {
    next(error);
  }
};

export const getProductBySlugOrId = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier });
    }

    if (!product) {
      throw new ApiError(404, 'Wedding invitation video template not found');
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4);

    res.status(200).json(
      new ApiResponse(
        200,
        { product, related },
        'Product details retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { title, category, price, originalPrice, description, thumbnail, previewVideo, badge, tags } = req.body;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct = await Product.create({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      category,
      price,
      originalPrice: originalPrice || price,
      description,
      thumbnail,
      previewVideo,
      badge: badge || 'None',
      tags: tags || [],
    });

    res.status(201).json(new ApiResponse(201, newProduct, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      throw new ApiError(404, 'Product not found');
    }
    res.status(200).json(new ApiResponse(200, updated, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};
