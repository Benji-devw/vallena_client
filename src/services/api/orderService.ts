import { axiosInstance, API_URLS } from './axiosConfig';
import { Order } from '@/types/orderTypes';

export const orderService = {
  createOrder: async (orderData: Omit<Order, '_id' | 'createdAt'>) => {
    const response = await axiosInstance.post(`${API_URLS.orders}/orders`, orderData);
    return response.data;
  },

  // Get user orders
  getUserOrders: async (userId: string) => {
    const response = await axiosInstance.get(`${API_URLS.orders}/orders/user/${userId}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string) => {
    const response = await axiosInstance.get(`${API_URLS.orders}/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: Order['statut']) => {
    const response = await axiosInstance.patch(`${API_URLS.orders}/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Get total orders
  getOrdersByUserId: async (userId: string) => {
    const response = await axiosInstance.get(`${API_URLS.orders}/orders/user/${userId}`);
    return response.data;
  },
};
