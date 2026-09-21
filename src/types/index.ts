// --- USER TYPES ---
export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

// --- CATEGORY & COMMENT TYPES ---
export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  targetType: 'Article' | 'Battle';
  targetId: string;
  createdAt: string;
}

// --- ARTICLE TYPES ---
export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: Category;
  author: string;
  comments?: Comment[];
  createdAt: string;
}

// --- BATTLE TYPES ---
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TacticalPhase {
  _id?: string;
  phaseName: string;
  details: string;
}

export type TheaterOption = 'Pacific' | 'European' | 'Eastern Front' | 'North Africa' | 'Other';

export interface Battle {
  _id: string;
  name?: string;               // Backend & Front-end fallback support
  title: string;
  slug: string;
  year: string;                // Front-end filters aur UI display ke liye
  location: string;
  theater: TheaterOption | string;
  description: string;         // Backend mandatory field
  summary?: string;            // Secondary overview field
  coordinates?: Coordinates;   // Leaflet map integration ke liye
  tacticalPhases?: TacticalPhase[];
  mapImageUrl?: string;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

// Helper Type for Creating Battles (Omits Auto-generated Mongo fields)
export type CreateBattleInput = Omit<Battle, '_id' | 'createdAt' | 'updatedAt'>;

// --- NEWS TYPES ---
export interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  url?: string;
  createdAt: string;
}