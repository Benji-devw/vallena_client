import axios from 'axios';

const API_URL = 'http://localhost:8800/api';

export interface Product {
  _id: string;
  imgCollection: string[];
  titleProduct: string;
  categoryProduct?: string;
  descriptionProduct?: string;
  priceProduct: number;
  sizeProduct?: string;
  weightProduct?: string;
  quantityProduct?: number;
  stockProduct?: boolean;
  promotionProduct?: boolean;
  reporterProduct?: string;
  tags?: string;
  matter?: string;
  composition?: string;
  fabrication?: string;
  color?: string;
  entretien?: string;
  novelty?: boolean;
  oldPriceProduct?: number;
  displaySlideHome?: boolean;
  yearCollection?: number;
  visible?: boolean;
  notes?: number;
  comments?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  order?: string;
  search?: string;
  page?: number;
  limit?: number;
  promotion?: boolean;
  novelty?: boolean;
  matter?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Matter {
  id: string;
  name: string;
}

export interface Color {
  id: string;
  name: string;
}

export const productService = {
  async getAllProducts(filters: ProductFilters = {}) {
    try {
      const params = new URLSearchParams();
      // console.log("filters", filters);

      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.order) params.append('order', filters.order);
      if (filters.search) params.append('search', filters.search);
      if (filters.matter) params.append('matter', filters.matter);
      if (filters.color) params.append('color', filters.color);
      // Dont pass promotion and novelty because they are handled by SortBy component
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get(`${API_URL}/shop?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  async getProductById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/shop/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    console.log('🔍 getCategories');
    try {
      const response = await axios.get(`${API_URL}/shop/categories`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  async getMatters(): Promise<Matter[]> {
    console.log('🔍 getMatters');
    try {
      const response = await axios.get(`${API_URL}/shop/matters`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
      throw error;
    }
  },

  async getColors(): Promise<Color[]> {
    console.log('🔍 getColors');
    try {
      const response = await axios.get(`${API_URL}/shop/colors`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des couleurs:', error);
      throw error;
    }
  },

  // Get Promotional Products
  getPromotionalProducts: async () => {
    const response = await axios.get(`${API_URL}/products`, {
      params: { isPromotion: true },
    });
    return response.data;
  },

  // Get New Products
  getNewProducts: async () => {
    const response = await axios.get(`${API_URL}/products`, {
      params: { isNew: true },
    });
    return response.data;
  },

  // Search Products
  searchProducts: async (query: string) => {
    const response = await axios.get(`${API_URL}/products/search`, {
      params: { q: query },
    });
    return response.data;
  },
};
