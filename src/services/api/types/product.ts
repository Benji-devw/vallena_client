export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  rating?: number;
  reviewCount?: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
} 