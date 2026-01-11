const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token (user or admin)
function getAuthToken(): string | null {
  return localStorage.getItem('userToken') || localStorage.getItem('adminToken');
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Products API
export const productsAPI = {
  getAll: () => apiRequest<any[]>('/products'),
  getById: (id: number) => apiRequest<any>(`/products/${id}`),
  create: (productData: FormData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: productData,
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create product');
      return res.json();
    });
  },
  update: (id: number, productData: FormData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: productData,
    }).then(res => {
      if (!res.ok) throw new Error('Failed to update product');
      return res.json();
    });
  },
  delete: (id: number) => apiRequest<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    return data;
  },
  
  // User registration
  register: async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
        const errorMessage = errorData.error || errorData.message || `Registration failed (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  },
  
  // Admin login (legacy)
  adminLogin: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    if (data.token && data.user?.role === 'admin') {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
    }
    return data;
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
