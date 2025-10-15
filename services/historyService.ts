import { HistoryItem } from '../types';

const HISTORY_KEY = 'webtoon-translator-history';

export function getHistory(): HistoryItem[] {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
  }
  return [];
}

export function saveToHistory(item: HistoryItem): void {
  try {
    const history = getHistory();
    // Keep history to a reasonable size, e.g., 20 items
    const newHistory = [item, ...history].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
}

export function clearHistory(): void {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear history from localStorage", error);
    }
}
