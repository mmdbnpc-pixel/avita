export type Category = 'women' | 'men' | 'sport';

export type ProductBadge = 'new' | 'bestseller' | 'special' | 'discount';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  gender: 'women' | 'men' | 'unisex';
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  images: string[];
  description: string;
  specifications: { label: string; value: string }[];
  material: string;
  color: string;
  size?: string;
  stock: number;
  sku: string;
  tags: string[];
  badge?: ProductBadge;
  featured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  userId?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface SpecialCollectionItem {
  id: string;
  productId: string;
  image?: string;
  title?: string;
  text?: string;
  order: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  category: string;
  author: string;
  date: string;
  readingTime: number;
  tags: string[];
  published: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  trackingCode?: string;
  paymentRefCode?: string;
  createdAt: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  email?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
}
