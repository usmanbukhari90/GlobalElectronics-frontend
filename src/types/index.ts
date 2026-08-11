export type Category =
  | "accessories"
  | "buds"
  | "laptop"
  | "led-signage"
  | "mobile"
  | "monitors"
  | "projectors"
  | "sound-devices"
  | "tablets"
  | "tv-av"
  | "watches"
  | "discounted";

  export interface ProductSize {
    label: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
  }
  
  export interface ColorSwatch {
    name: string;
    hex: string;
  }

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images?: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  specs: Record<string, string>;
  sizes?: ProductSize[];
  colors?: string[];
  colorSwatches?: ColorSwatch[];
  isDailyHighlight?: boolean;
  highlightExpiresAt?: string;
  isPopularPick?: boolean;
  isPopularPickBanner?: boolean;
  isBigSavings?: boolean;
  discountPercent?: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered";

export interface Order {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    emirate: string;
  };
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  count?: number;
}

export interface BrandInfo {
  id: string;
  name: string;
  logo: string;
  count?: number;
}

export interface HeroBanner {
  slot: 1 | 2;
  heading: string;
  subheading?: string;
  buttonText: string;
  linkHref: string;
  imageUrl: string;
}

export interface AnnouncementMessage {
  id: string;
  text: string;
  displayOrder: number;
}