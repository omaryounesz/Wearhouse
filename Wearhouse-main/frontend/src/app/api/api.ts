import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

console.log('Using API URL:', API_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  register: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    try {
      console.log('Register API call with data:', {
        ...userData,
        password: '[REDACTED]'
      });
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },
  
  verifyEmail: async (token: string) => {
    try {
      const response = await api.post('/auth/verify', { token });
      return response.data;
    } catch (error) {
      console.error('Verify email API error:', error);
      throw error;
    }
  },
  
  resendVerification: async (email: string) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      console.error('Resend verification API error:', error);
      throw error;
    }
  },
};

// Products API
export const productsAPI = {
  getProducts: async (params?: { 
    category?: string; 
    size?: string; 
    condition?: string;
    search?: string;
    sort?: string;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (productData: FormData) => {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: {
    first_name?: string;
    last_name?: string;
    avatar?: File;
  }) => {
    const formData = new FormData();
    
    if (userData.first_name) {
      formData.append('first_name', userData.first_name);
    }
    
    if (userData.last_name) {
      formData.append('last_name', userData.last_name);
    }
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }
    
    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  sendMessage: async (data: {
    recipient_id: string;
    product_id: string;
    content: string;
  }) => {
    const response = await api.post('/messages', data);
    return response.data;
  },
  
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
  
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },
};

export default api; 