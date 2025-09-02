const API_BASE_URL = '/api';

class TaskService {
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

  async getTasks(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const endpoint = `/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getTask(id) {
    return this.makeRequest(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return this.makeRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(id, taskData) {
    return this.makeRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async deleteTask(id) {
    return this.makeRequest(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleTask(id) {
    return this.makeRequest(`/tasks/${id}/toggle`, {
      method: 'PATCH'
    });
  }

  async getStats() {
    return this.makeRequest('/tasks/stats');
  }
}

export const taskService = new TaskService();
