
export type PizzaSize = 'Média' | 'Grande' | 'Gigante' | 'Família (12)' | 'Maracanã (24)';

export interface Product {
  id: string;
  name: string;
  description: string;
  priceM?: number;
  priceG?: number;
  priceGG?: number;
  priceFA?: number; // 12 slices
  priceMA?: number; // 24 slices
  priceFixed?: number; // For drinks
  category: 'Pizza' | 'Bebida';
  image: string;
  available: boolean;
  enabledSizes?: PizzaSize[]; // Explicit control over which sizes are shown
}

export interface CartItem {
  id: string;
  product1: Product;
  product2?: Product; // For half-and-half
  size?: PizzaSize;
  quantity: number;
  totalPrice: number;
  isPromotion?: boolean;
}

export interface Neighborhood {
  name: string;
  fee: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  neighborhood: Neighborhood;
  items: CartItem[];
  paymentMethod: string;
  changeFor?: string;
  total: number;
  status: 'Pendente' | 'Preparando' | 'Saiu para Entrega' | 'Finalizado';
  createdAt: number;
  // Added optional properties to support address details and order types
  orderType?: 'Entrega' | 'Retirada';
  number?: string;
  cep?: string;
  complement?: string;
  observation?: string;
}

export interface Promotion {
  active: boolean;
  title: string;
  image: string;
  price: number;
  freeDelivery: boolean;
  description: string;
}

export interface AppSettings {
  isOpen: boolean;
  closedMode: 'hide-menu' | 'show-menu-readonly';
  closeMessage: string;
  neighborhoods: Neighborhood[];
  blockedNeighborhoods: string; // Comma separated names
  defaultDeliveryFee: number;
  allowedCity: string;
  bannerText: string;
  bannerSubtext: string;
  bannerImage: string;
  bannerScale?: number; // Height of the banner in pixels
  logoImage?: string;
  logoScale?: number; // Size in pixels
  whatsappIcon?: string;
  instagramIcon?: string;
  promotion: Promotion;
}
