import api from './api';

export const videoService = {
  getHealth: () => api.get('/health'),
  
  // Products
  getProducts: (params = {}) => api.get('/products', { params }),
  getTrending: () => api.get('/products/trending'),
  getProductByIdentifier: (identifier) => api.get(`/products/${identifier}`),
  
  // Categories
  getCategories: () => api.get('/categories'),
  
  // Orders
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getAllOrders: (params = {}) => api.get('/orders', { params }),
  
  // Coupons
  validateCoupon: (code) => api.post('/coupons/validate', { code }),
  
  // Payments
  createRazorpayOrder: (data) => api.post('/payment/razorpay/order', data),
  verifyRazorpayPayment: (data) => api.post('/payment/razorpay/verify', data),
  
  // Reviews
  getReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  
  // Contact
  submitContact: (contactData) => api.post('/contact', contactData),
};

export default videoService;
