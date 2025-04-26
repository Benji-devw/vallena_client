import { axiosInstance, API_URLS } from './axiosConfig';

export interface Order {
  _id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export const orderService = {
  // Créer une nouvelle commande
  createOrder: async (orderData: Omit<Order, '_id' | 'createdAt'>) => {
    const response = await axiosInstance.post(`${API_URLS.orders}/orders`, orderData);
    return response.data;
  },

  // Récupérer les commandes d'un utilisateur
  getUserOrders: async (userId: string) => {
    const response = await axiosInstance.get(`${API_URLS.orders}/orders/user/${userId}`);
    return response.data;
  },

  // Récupérer une commande par ID
  getOrderById: async (orderId: string) => {
    const response = await axiosInstance.get(`${API_URLS.orders}/orders/${orderId}`);
    return response.data;
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const response = await axiosInstance.patch(`${API_URLS.orders}/orders/${orderId}/status`, { status });
    return response.data;
  }
}; 