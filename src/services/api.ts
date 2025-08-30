import axios from 'axios';
import { ImageItem } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('sb-access-token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async uploadImages(files: File[]): Promise<ImageItem[]> {
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

    return response.data;
  }

  async getImages(page: number = 1, limit: number = 20): Promise<ImageItem[]> {
    const response = await axios.get(`${API_BASE_URL}/api/images`, {
      params: { page, limit },
      headers: this.getAuthHeader(),
    });

    return response.data;
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
    const response = await axios.post(
      `${API_BASE_URL}/api/search`,
      { query, page, limit },
      { headers: this.getAuthHeader() }
    );

    return response.data;
  }

  async findSimilarImages(
    imageId: number,
    limit: number = 10
  ): Promise<ImageItem[]> {
    const response = await axios.post(
      `${API_BASE_URL}/api/similar`,
      { image_id: imageId, limit },
      { headers: this.getAuthHeader() }
    );

    return response.data;
  }

  async filterByColor(color: string, limit: number = 20): Promise<ImageItem[]> {
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

    return response.data;
  }
}

export const apiService = new ApiService();
