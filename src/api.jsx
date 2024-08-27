// src/ApiService.js
class ApiService {
    constructor() {
      this.baseURL = 'http://localhost:5000';
    }
  
    getBaseURL() {
      return this.baseURL;
    }
  }
  
  const apiService = new ApiService();
  export default apiService;
  