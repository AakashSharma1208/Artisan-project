import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle data directly
api.interceptors.response.use(
  (response) => {
    console.log(`API Success: ${response.config.url}`, response.data);
    return response.data;
  },
  (error) => {
    console.error(`API Error: ${error.config?.url}`, error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export const productsService = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/products${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (body) => api.post('/products', body),
  update: (id, body) => api.put(`/products/${id}`, body),
  delete: (id) => api.delete(`/products/${id}`),
};

export const authService = {
  login: (body) => api.post('/auth/login', body),
  signup: (body) => api.post('/auth/signup', body),
  profile: () => api.get('/auth/profile'),
  googleAuth: (body) => api.post('/auth/google', body),
};

export const vendorService = {
  register: (body) => api.post('/vendors/register', body),
  getProfile: () => api.get('/vendors/profile'),
  updateProfile: (body) => api.put('/vendors/profile', body),
  getVendorById: (id) => api.get(`/vendors/${id}`),
  getMe: () => api.get('/vendors/me'),
  update: (body) => api.put('/vendors/update', body),
};

export const ordersService = {
  create: (body) => api.post('/orders', body),
  mine: () => api.get('/orders/myorders'),
  getVendorOrders: () => api.get('/orders/vendor'),
};

export const aiService = {
  chat: (message) => api.post('/ai/chat', { message }),
};

export const contactService = {
  sendEmail: (body) => api.post('/contact', body),
};

export const reviewsService = {
  getProductReviews: (productId) => api.get(`/reviews/${productId}`),
  addReview: (reviewData) => api.post('/reviews', reviewData),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  promoteUser: (id) => api.put(`/admin/users/${id}/promote`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getVendors: () => api.get('/admin/vendors'),
  approveVendor: (id, isApproved) => api.put(`/admin/vendors/${id}/approve`, { isApproved }),
  getProducts: () => api.get('/admin/products'),
  addProduct: (body) => api.post('/admin/products', body),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
};

export default api;
