
export type UniversityCategory = 'All' | 'Federal' | 'State' | 'Private' | 'JAMB';

export type OLevelGrade = 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';

export interface NewsItem {
  id: string;
  title: string;
  category: UniversityCategory;
  date: string;
  image: string;
  excerpt: string;
  sourceUrl?: string;
  isLive?: boolean;
}

export interface BillboardAd {
  id: string;
  title: string;
  description: string;
  category: 'Hostels' | 'Gadgets' | 'Services' | 'Tutorials';
  price?: string;
  imageUrl?: string;
  link: string;
  whatsapp?: string; // Specific vendor WhatsApp number
  isVerified: boolean;
  isSponsored?: boolean;
}

export interface AdPackage {
  name: string;
  price: string;
  duration: string;
  features: string[];
  color: string;
}

export interface SocialLink {
  platform: 'Facebook' | 'Instagram' | 'Linkedin' | 'Twitter' | 'Youtube';
  url: string;
}

export interface AdminState {
  isLoggedIn: boolean;
  email: string | null;
  whatsapp?: string;
}

export interface Settings {
  firebaseConfig: string;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
  googleAdsEnabled: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 image data for user messages
  groundingChunks?: GroundingChunk[];
}
