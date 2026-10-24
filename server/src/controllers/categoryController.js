import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    
    // Add product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat.name, isActive: true });
        return {
          ...cat.toObject(),
          productCount: count,
        };
      })
    );

    res.status(200).json(new ApiResponse(200, categoriesWithCounts, 'Categories fetched successfully'));
  } catch (error) {
    next(error);
  }
};
