import axios from 'axios';
import { ImageItem } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('sb-access-token');
    console.log('Getting auth token:', token ? `Token found (${token.substring(0, 20)}...)` : 'No token');
    
    if (token) {
      // Check if token is expired (basic JWT check)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        console.log('Token expiry:', new Date(payload.exp * 1000));
        console.log('Current time:', new Date(currentTime * 1000));
        console.log('Token valid:', payload.exp > currentTime);
        
        if (payload.exp <= currentTime) {
          console.warn('Token has expired, removing from localStorage');
          localStorage.removeItem('sb-access-token');
          return {};
        }
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private handleApiError(error: any, operation: string) {
    console.error(`API Error during ${operation}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      console.error(`${operation} error status:`, status);
      console.error(`${operation} error data:`, error.response?.data);

      // Handle specific error cases
      if (status === 401) {
        console.warn('Authentication failed - clearing stored token');
        localStorage.removeItem('sb-access-token');
        throw new Error('Authentication required. Please log in again.');
      } else if (status === 403) {
        throw new Error('Access forbidden. Please check your permissions.');
      } else if (status === 404) {
        throw new Error('API endpoint not found.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error(
          'Network error. Please check your connection and try again.'
        );
      } else {
        throw new Error(`${operation} failed: ${message}`);
      }
    }

    throw error;
  }

  async uploadImages(files: File[]): Promise<ImageItem[]> {
    try {
      console.log('Uploading files to:', `${API_BASE_URL}/api/upload`);
      console.log('Auth headers:', this.getAuthHeader());
      console.log(
        'Files to upload:',
        files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
      );

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Log FormData contents
      console.log('FormData has', files.length, 'files');

      const response = await axios.post(
        `${API_BASE_URL}/api/upload`,
        formData,
        {
          headers: {
            ...this.getAuthHeader(),
            // Don't set Content-Type manually for FormData - let browser set it with boundary
          },
        }
      );

      console.log('Upload response:', response.data);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      this.handleApiError(error, 'Upload');
      return []; // Fallback return
    }
  }

  async getImages(page: number = 1, limit: number = 20): Promise<ImageItem[]> {
    try {
      console.log('Fetching images from:', `${API_BASE_URL}/api/images`);
      console.log('Auth headers:', this.getAuthHeader());

      const response = await axios.get(`${API_BASE_URL}/api/images`, {
        params: { page, limit },
        headers: this.getAuthHeader(),
      });

      console.log('API Response:', response.data);

      // Ensure we return an array
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('API Error fetching images:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      // Return empty array on error to prevent undefined issues
      return [];
    }
  }

  async searchImages(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    images: ImageItem[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
  }> {
    try {
      console.log('Searching images with query:', query);
      console.log('Search endpoint:', `${API_BASE_URL}/api/search`);

      const response = await axios.post(
        `${API_BASE_URL}/api/search`,
        { query, page, limit },
        { headers: this.getAuthHeader() }
      );

      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error searching images:', error);
      if (axios.isAxiosError(error)) {
        console.error('Search error status:', error.response?.status);
        console.error('Search error data:', error.response?.data);
      }
      // Return empty result on error
      return {
        images: [],
        total: 0,
        page,
        limit,
        has_more: false,
      };
    }
  }

  async findSimilarImages(
    imageId: number,
    limit: number = 10
  ): Promise<ImageItem[]> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/similar`,
        { image_id: imageId, limit },
        { headers: this.getAuthHeader() }
      );

      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('API Error fetching similar images:', error);
      return [];
    }
  }

  async filterByColor(color: string, limit: number = 20): Promise<ImageItem[]> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/filter-by-color`,
        { color, limit },
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('API Error filtering by color:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();
