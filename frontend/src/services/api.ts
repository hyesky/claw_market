import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const productsApi = {
  list: (params: any) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  createVersion: (id: string, data: any) => api.post(`/products/${id}/versions`, data),
  getVersions: (id: string) => api.get(`/products/${id}/versions`),
};

export const searchApi = {
  search: (query: string, params?: any) =>
    api.get('/search', { params: { q: query, ...params } }),
  suggestions: (query: string) => api.get('/search/suggestions', { params: { q: query } }),
  filters: () => api.get('/search/filters'),
};

export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  pay: (id: string, data: any) => api.post(`/orders/${id}/pay`, data),
  list: (params?: any) => api.get('/orders', { params }),
};

export const reviewsApi = {
  submit: (productId: string, data: any) => api.post(`/reviews/product/${productId}`, data),
  get: (productId: string) => api.get(`/reviews/product/${productId}`),
  getRating: (productId: string) => api.get(`/reviews/product/${productId}/rating`),
};

export default api;
