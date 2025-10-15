export interface TranslationResult {
  id: string;
  originalImageUrl: string;
  translatedImageUrl: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  previewImageUrl: string;
  imageCount: number;
  results: TranslationResult[];
}
