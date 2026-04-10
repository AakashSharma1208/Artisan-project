// api.js - Helper functions for communicating with the backend API

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch wrapper to handle auth tokens and JSON parsing
 */
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API calls
const AuthAPI = {
    login: async (credentials) => {
        return await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },
    signup: async (userData) => {
        return await fetchAPI('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
};

// Products API calls
const ProductsAPI = {
    getAll: async (queryParams = '') => {
        return await fetchAPI(`/products${queryParams}`);
    },
    getById: async (id) => {
        return await fetchAPI(`/products/${id}`);
    }
};
