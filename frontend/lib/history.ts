import type { LinkResponse } from "./types";

const STORAGE_KEY = "snip-link-history";
const MAX_HISTORY = 10;

export interface HistoryItem {
  code: string;
  short_url: string;
  original_url: string;
  created_at: string;
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(link: LinkResponse): void {
  const history = getHistory();
  const item: HistoryItem = {
    code: link.code,
    short_url: link.short_url,
    original_url: link.original_url,
    created_at: link.created_at,
  };
  // Prepend new item, remove duplicates, limit to MAX_HISTORY
  const updated = [item, ...history.filter((h) => h.code !== link.code)].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
