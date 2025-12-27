
export enum Platform {
  SHOPEE = 'Shopee',
  LAZADA = 'Lazada',
  AMAZON = 'Amazon',
  TIKI = 'Tiki',
  OTHER = 'Other'
}

export type Language = 'en' | 'vi' | 'zh';

export interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
  platform: Platform;
  description?: string;
  category?: string;
  createdAt: number;
}

export interface BioProfile {
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  socials: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
    facebook_page?: string;
  };
  tracking?: {
    facebookPixelId?: string;
    googlePixelId?: string;
  };
}

export interface AdminCredentials {
  username: string;
  password?: string;
  isSetup: boolean;
}

export interface ClickLog {
  id: string;
  productId: string;
  platform: Platform;
  timestamp: number;
}

export interface AppState {
  profile: BioProfile;
  products: Product[];
  clickLogs: ClickLog[];
  cart: string[];
  theme: 'light' | 'dark';
  language: Language;
  isAuthenticated: boolean;
  adminCredentials: AdminCredentials;
}
