export interface ProductTypes {
  _id: string;
  imgCollection: string[];
  titleProduct: string;
  categoryProduct?: string;
  descriptionProduct?: string;
  size_fit?: string;
  method?: string;
  priceProduct: number;
  sizeProduct?: Array<{ name: string; quantity: number }>;
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
  comments?: Array<string>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFiltersTypes {
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

export interface CategoryTypes {
  id: string;
  name: string;
}

export interface MatterTypes {
  id: string;
  name: string;
}

export interface ColorTypes {
  id: string;
  name: string;
}
