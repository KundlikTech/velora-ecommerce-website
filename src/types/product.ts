export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags?: string[];
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  productCount: number;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean;
}
