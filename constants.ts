
import { Platform, BioProfile, Product } from './types';

export const INITIAL_PROFILE: BioProfile = {
  name: "Alex Johnson",
  username: "@alex_finds",
  bio: "Curating the best tech deals and home office aesthetic 🚀 ✨",
  avatarUrl: "https://picsum.photos/200/200?random=1",
  socials: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com"
  },
  tracking: {
    facebookPixelId: "",
    googlePixelId: ""
  }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Mechanical Keyboard - NuPhy Air75 V2',
    price: '$129.00',
    imageUrl: 'https://picsum.photos/400/300?random=10',
    affiliateUrl: 'https://amazon.com/example-keyboard',
    platform: Platform.AMAZON,
    category: 'Tech',
    createdAt: Date.now() - 1000000
  },
  {
    id: '2',
    title: 'Minimalist Desk Mat (Grey)',
    price: '$25.00',
    imageUrl: 'https://picsum.photos/400/300?random=11',
    affiliateUrl: 'https://shopee.com/example-mat',
    platform: Platform.SHOPEE,
    category: 'Home Office',
    createdAt: Date.now() - 2000000
  },
  {
    id: '3',
    title: 'Logitech MX Master 3S Mouse',
    price: '$99.00',
    imageUrl: 'https://picsum.photos/400/300?random=12',
    affiliateUrl: 'https://lazada.com/example-mouse',
    platform: Platform.LAZADA,
    category: 'Tech',
    createdAt: Date.now() - 3000000
  }
];

export const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.SHOPEE]: 'bg-orange-500',
  [Platform.LAZADA]: 'bg-blue-600',
  [Platform.AMAZON]: 'bg-yellow-500',
  [Platform.TIKI]: 'bg-sky-400',
  [Platform.OTHER]: 'bg-gray-500'
};

export const STATUS_COLORS = {
  HOT: 'from-rose-500 to-orange-500',
  TOP_CLICK: 'from-indigo-500 to-blue-500',
  CONVERSION: 'from-emerald-500 to-teal-500'
};
