
import { NewsItem } from '../types';
import { MOCK_NEWS } from '../constants';

/**
 * CampusAI Database Service
 * Handles persistence for news updates.
 * In a real-world scenario, this would interface with Firebase Firestore/Realtime DB.
 * Currently simulates the behavior using localStorage to ensure persistence within the session.
 */

const NEWS_KEY = 'campusai_published_news';

export const getPublishedNews = (): NewsItem[] => {
  const stored = localStorage.getItem(NEWS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return MOCK_NEWS;
};

export const publishNewsUpdate = async (news: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newItem: NewsItem = {
    ...news,
    id: Date.now().toString(),
    isLive: true
  };

  const currentNews = getPublishedNews();
  const updatedNews = [newItem, ...currentNews];
  
  localStorage.setItem(NEWS_KEY, JSON.stringify(updatedNews));
  
  // Trigger a custom event so components can listen for updates
  window.dispatchEvent(new Event('campusai_news_updated'));
  
  return newItem;
};

export const deleteNewsUpdate = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const currentNews = getPublishedNews();
  const updatedNews = currentNews.filter(n => n.id !== id);
  localStorage.setItem(NEWS_KEY, JSON.stringify(updatedNews));
  window.dispatchEvent(new Event('campusai_news_updated'));
};
