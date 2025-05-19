import { ProductFiltersTypes, ProductTypes, CategoryTypes, MatterTypes, ColorTypes } from '@/types/productTypes';
import axios from 'axios';
import { mockProducts, mockProductCategories, mockProductColors, mockProductMatters } from '@/__tests__/mocks/productsMocks';

const API_URL = 'http://localhost:8800/api';


export const productService = {
  async getAllProducts(filters: ProductFiltersTypes = {}) {
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

      if (process.env.NEXT_PUBLIC_USE_MOCK === "dev") {
        const response = mockProducts;
        return {
          products: response,
          total: response.length
        };
      }

      const response = await axios.get(`${API_URL}/shop?${params.toString()}`);
      return {
        products: response.data.products || response.data,
        total: response.data.total || (Array.isArray(response.data) ? response.data.length : 0)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  async getProductById(id: string) {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === "dev") {
        const response = mockProducts.find((product: any) => product._id === id);
        return response;
      }
      const response = await axios.get(`${API_URL}/shop/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  },

  async getCategories(): Promise<CategoryTypes[]> {
    // console.log('🔍 getCategories');
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === "dev") {
        const response = mockProductCategories;
        return response;
      }
      const response = await axios.get(`${API_URL}/shop/categories`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  async getMatters(): Promise<MatterTypes[]> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === "dev") {
        const response = mockProductMatters;
        return response;
      }
      const response = await axios.get(`${API_URL}/shop/matters`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
      throw error;
    }
  },

  async getColors(): Promise<ColorTypes[]> {
    // console.log('🔍 getColors');
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === "dev") {
        const response = mockProductColors;
        return response;
      }
      
      const response = await axios.get(`${API_URL}/shop/colors`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des couleurs:', error);
      throw error;
    }
  },

  async getSimilarProducts(productId: string, category?: string, limit: number = 6): Promise<ProductTypes[]> {
    try {
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }
      // Demander un produit de plus au cas où le produit actuel serait retourné
      params.append('limit', (limit + 1).toString()); 

      const response = await axios.get(`${API_URL}/shop?${params.toString()}`);
      // La structure de la réponse de l'API peut être { products: [] } ou directement []
      let products: ProductTypes[] = response.data.products || response.data || [];
      
      // Filtrer le produit actuel de la liste et limiter au nombre désiré
      products = products.filter(p => p._id !== productId).slice(0, limit);
      
      return products;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits similaires:', error);
      return []; // Retourner un tableau vide en cas d'erreur pour éviter de casser le rendu
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
