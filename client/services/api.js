const API_BASE_URL = 'http://localhost:3001/api';



class ApiService {

  constructor() {

    this.role = 'author'; // Default role, can be changed

  }



  setRole(role) {

    this.role = role;

  }



  getHeaders() {

    return {

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${this.role}`

    };

  }



  async request(endpoint, options = {}) {

    const url = `${API_BASE_URL}${endpoint}`;

    const config = {

      headers: this.getHeaders(),

      ...options

    };



    try {

      const response = await fetch(url, config);

      

      if (!response.ok) {

        const error = await response.json();

        throw new Error(error.error || `HTTP error! status: ${response.status}`);

      }

      

      return await response.json();

    } catch (error) {

      console.error('API request failed:', error);

      throw error;

    }

  }



  // Articles

  async getArticles(filters = {}) {

    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);

    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    
    const query = params.toString() ? `?${params}` : '';

    return this.request(`/articles${query}`);

  }



  async getArticle(id) {

    return this.request(`/articles/${id}`);

  }



  async createArticle(articleData) {

    return this.request('/articles', {

      method: 'POST',

      body: JSON.stringify(articleData)

    });

  }



  async updateArticle(id, articleData) {

    return this.request(`/articles/${id}`, {

      method: 'PUT',

      body: JSON.stringify(articleData)

    });

  }



  async deleteArticle(id, authorId) {

    return this.request(`/articles/${id}`, {

      method: 'DELETE',

      body: JSON.stringify({ authorId })

    });

  }



  async submitArticle(id, authorId) {

    return this.request(`/articles/${id}/submit`, {

      method: 'POST',

      body: JSON.stringify({ authorId })

    });

  }



  async publishArticle(id) {

    return this.request(`/articles/${id}/publish`, {

      method: 'POST'

    });

  }



  async rejectArticle(id) {

    return this.request(`/articles/${id}/reject`, {

      method: 'POST'

    });

  }



  async healthCheck() {

    return this.request('/health');

  }

}



export const apiService = new ApiService();

