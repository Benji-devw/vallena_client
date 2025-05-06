import axios from 'axios';

const API_URL = 'http://localhost:8800/api';

export interface Comment {
  orderNumber: string;
  idProduct: string;
  by: string;
  messageTitle: string;
  message: string;
  note: string;
  dateBuy: string;
  datePost: string;
  status: boolean;
}

export const commentsService = {
  async getComments() {
    try {
      const response = await axios.get(`${API_URL}/comment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },  

  async getCommentsByProduct(idProduct: string) {
    try {
      const response = await axios.get(`${API_URL}/comment/${idProduct}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async getCommentsRating(idProduct: string) {
    try {
      const response = await axios.get(`${API_URL}/comment/rating/${idProduct}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments rating:', error);
      throw error;
    }
  }
};


