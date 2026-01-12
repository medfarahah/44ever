// API Base URL - use relative paths for Vercel serverless functions
// In development, use localhost backend; in production, use relative paths
const API_BASE_URL = import.meta.env.DEV 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  : '/api'; // Relative path for Vercel serverless functions

// Log API URL for debugging
if (import.meta.env.DEV) {
  console.log('[API] Base URL:', API_BASE_URL);
}

// Helper function to get auth token (user or admin)
function getAuthToken(): string | null {
  return localStorage.getItem('userToken') || localStorage.getItem('adminToken');
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // API_BASE_URL is always set (either localhost in dev or '/api' in production)

  const token = getAuthToken();
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Only set Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[API] ${options.method || 'GET'} ${url}`);
  if (token) {
    console.log(`[API] Token present: ${token.substring(0, 20)}...`);
  } else {
    console.warn(`[API] No token found for ${options.method || 'GET'} ${url}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    console.log(`[API] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.json().catch(async () => {
        // If JSON parsing fails, try to get text
        const text = await response.text().catch(() => 'Unknown error');
        return { 
          error: `Request failed with status ${response.status}`,
          message: text
        };
      });
      console.error('[API Error]', {
        status: response.status,
        statusText: response.statusText,
        error: error.error,
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[API Network Error]', error);
      throw new Error('Cannot connect to server. Please check if the backend is running and VITE_API_URL is set correctly.');
    }
    throw error;
  }
}

// Products API
export const productsAPI = {
  getAll: () => apiRequest<any[]>('/products'),
  getById: (id: number) => apiRequest<any>(`/products/${id}`),

  // Create product (JSON body, images as URLs/base64 strings)
  create: (productData: {
    name: string;
    category: string;
    price: number | string;
    description?: string;
    featured?: boolean;
    images?: string[];
  }) => apiRequest<any>('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  // Update product (JSON body)
  update: (id: number, productData: {
    name?: string;
    category?: string;
    price?: number | string;
    description?: string;
    featured?: boolean;
    images?: string[];
  }) => apiRequest<any>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),

  // Delete product
  delete: (id: number) => apiRequest<{ message: string }>(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiRequest<any[]>('/orders'),
  getById: (id: number) => apiRequest<any>(`/orders/${id}`),
  create: (orderData: any) => apiRequest<any>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  update: (id: number, orderData: any) => apiRequest<any>(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  updateStatus: (id: number, status: string, notes?: string) => apiRequest<any>(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/orders/${id}`, { method: 'DELETE' }),
};

// Franchise API
export const franchiseAPI = {
  getAll: () => apiRequest<any[]>('/franchise'),
  getById: (id: number) => apiRequest<any>(`/franchise/${id}`),
  create: (applicationData: any) => apiRequest<any>('/franchise', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),
  update: (id: number, applicationData: any) => apiRequest<any>(`/franchise/${id}`, {
    method: 'PUT',
    body: JSON.stringify(applicationData),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/franchise/${id}`, { method: 'DELETE' }),
};

// Customers API
export const customersAPI = {
  getAll: () => apiRequest<any[]>('/customers'),
  getById: (id: number) => apiRequest<any>(`/customers/${id}`),
  create: (customerData: any) => apiRequest<any>('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
  update: (id: number, customerData: any) => apiRequest<any>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customerData),
  }),
  delete: (id: number) => apiRequest<{ message: string }>(`/customers/${id}`, { method: 'DELETE' }),
};

// Auth API
export const authAPI = {
  // User login
  login: async (email: string, password: string) => {
    if (!API_BASE_URL) {
      throw new Error('API server is not configured. Please set VITE_API_URL environment variable.');
    }

    try {
      const url = `${API_BASE_URL}/auth/login`;
      console.log('[Auth] Login request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Login failed' }));
        console.error('[Auth] Login error:', error);
        throw new Error(error.error || error.message || 'Invalid email or password');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[Auth] Network error:', error);
        throw new Error('Cannot connect to server. Please check if the backend is running and VITE_API_URL is set correctly.');
      }
      throw error;
    }
  },
  
  // User registration
  register: async (name: string, email: string, password: string, phone?: string) => {
    if (!API_BASE_URL) {
      throw new Error('API server is not configured. Please set VITE_API_URL environment variable.');
    }

    try {
      const url = `${API_BASE_URL}/auth/register`;
      console.log('[Auth] Register request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
        const errorMessage = errorData.error || errorData.message || `Registration failed (${response.status})`;
        console.error('[Auth] Registration error:', errorData);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[Auth] Network error:', error);
        throw new Error('Cannot connect to server. Please check if the backend is running and VITE_API_URL is set correctly.');
      }
      throw error;
    }
  },
  
  // Admin login (supports both hardcoded admin and database admin users)
  adminLogin: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Invalid email or password');
    }

    const data = await response.json();
    
    // Check if user is admin (either hardcoded admin or database admin)
    if (data.token && data.user?.role === 'admin') {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      return data;
    }
    
    // If not admin, throw error
    throw new Error('Access denied. Admin privileges required.');
  },
  
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  
  verify: () => apiRequest<{ valid: boolean }>('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token: getAuthToken() }),
  }),
  
  getCurrentUser: () => apiRequest<any>('/auth/me'),
  
  updateProfile: (userData: any) => apiRequest<any>('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  changePassword: (currentPassword: string, newPassword: string) => apiRequest<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }),
};
