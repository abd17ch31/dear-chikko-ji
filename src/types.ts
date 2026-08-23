export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
  tag?: string;
  date?: string;
}

export interface ScrapbookElement {
  id: string;
  type: 'photo' | 'text' | 'sticker' | 'tape' | 'quote';
  content: string; // image URL or text string
  x: number; // percentage or px offset
  y: number;
  rotation?: number;
  scale?: number;
  caption?: string;
  subType?: 'camera' | 'flower' | 'vinyl' | 'moon' | 'bow' | 'star' | 'kitten' | 'heart';
}

export interface ScrapbookPage {
  id: number;
  leftPageElements: ScrapbookElement[];
  rightPageElements: ScrapbookElement[];
}

export interface AnniversarySettings {
  partnerName: string;
  senderName: string;
  yearsCount: number;
  anniversaryDate: string;
  heroQuote: string;
  audioEnabled: boolean;
  activeScene: number; // 1 to 5
}
