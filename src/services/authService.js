const API_BASE_URL = '/api';

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }

  async login(email, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile() {
    return this.makeRequest('/auth/profile');
  }

  async updateProfile(profileData) {
    const response = await this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response.user;
  }

  async changePassword(currentPassword, newPassword) {
    return this.makeRequest('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  async deleteAccount(password) {
    return this.makeRequest('/users', {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });
  }
}

export const authService = new AuthService();
