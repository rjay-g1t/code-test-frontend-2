import axios from 'axios';
import { ImageItem } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('sb-access-token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async uploadImages(files: File[]): Promise<ImageItem[]> {
    try {
      console.log('Uploading files to:', `${API_BASE_URL}/api/upload`);
      console.log('Auth headers:', this.getAuthHeader());
      
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('API Error uploading images:', error);
      if (axios.isAxiosError(error)) {
        console.error('Upload error status:', error.response?.status);
        console.error('Upload error data:', error.response?.data);
        throw new Error(`Upload failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
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
        has_more: false
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
