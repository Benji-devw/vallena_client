import axios from 'axios';
import { mockComments } from '@/__tests__/mocks/commentsMocks';
import { Comment } from '@/types/commentTypes';

const API_URL = 'http://localhost:8800/api';

export const commentsService = {
  async getComments() {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === 'dev') {
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
      if (process.env.NEXT_PUBLIC_USE_MOCK === 'dev') {
        const response = mockComments.filter((comment: any) => comment.idProduct === idProduct);
        return response;
      }

      const response = await axios.get(`${API_URL}/comment/${idProduct}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async getCommentsRating(idProduct: string): Promise<number[]> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === 'dev') {
        return mockComments
          .filter((comment: Comment) => comment.idProduct === idProduct)
          .map((comment: Comment) => comment.note)
          .filter(
            (noteValue): noteValue is number => typeof noteValue === 'number' && !isNaN(noteValue)
          );
      }

      const response = await axios.get(`${API_URL}/comment/rating/${idProduct}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching comments rating:', error);
      return [];
    }
  },
};
