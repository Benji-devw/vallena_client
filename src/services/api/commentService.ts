import axios from 'axios';
import { Comment } from '@/types/commentTypes';
import { mockComments } from '@/__tests__/mocks/commentsMocks';

const API_URL = 'http://localhost:8800/api';

export const commentsService = {
  async getComments() {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === "dev") {
        const response = mockComments;
        return response;
      }
      const response = await axios.get(`${API_URL}/comment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },  

  async getCommentsByProduct(idProduct: string) {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === "dev") {
        const response = mockComments;
        return response;
      }
      const response = await axios.get(`${API_URL}/comment/${idProduct}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async getCommentsRating(idProduct: string) {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === "dev") {
        const response = mockComments;
        return response;
      }
      const response = await axios.get(`${API_URL}/comment/rating/${idProduct}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments rating:', error);
      throw error;
    }
  }
};


