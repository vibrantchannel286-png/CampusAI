
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ExternalLink, RefreshCw, Link as LinkIcon, ChevronDown, ChevronUp, Clock, Sparkles, ChevronRight, Newspaper, School, Brain, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_NEWS } from '../constants';
import { UniversityCategory, NewsItem } from '../types';
import universityData from '../universities';
import { fetchLiveNews } from '../services/geminiService';
import { getPublishedNews } from '../services/dbService';
import AdUnit from './AdUnit';

const ensureExternalUrl = (url?: string) => {
  if (!url) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const getInitials = (title: string) => {
  const commonWords = ['The', 'University', 'of', 'and', 'for', 'Federal', 'State', 'Technology'];
  const words = title.split(' ').filter(word => !commonWords.includes(word)).filter(word => word.length > 1);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return "CU";
};

const UniversityAvatar: React.FC<{ title: string; category: string; schoolUrl?: string }> = ({ title, category, schoolUrl }) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(title);
  
  const logoUrl = schoolUrl ? `https://logo.clearbit.com/${new URL(ensureExternalUrl(schoolUrl)).hostname.replace('www.', '')}?size=256` : null;
  
  const getGradient = () => {
    switch (category) {
      case 'Federal': return 'from-blue-600 to-indigo-900';
      case 'State': return 'from-emerald-500 to-teal-800';
      case 'Private': return 'from-purple-600 to-fuchsia-900';
      case 'JAMB': return 'from-red-500 to-orange-700';
      default: return 'from-gray-700 to-gray-900';
    }
  };

  return (
    <motion.div className={`relative w-full h-full bg-gradient-to-br ${getGradient()} flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <AnimatePresence mode="wait">
        {logoUrl && !imgError ? (
          <motion.div key="logo" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="z-10 bg-white/10 backdrop-blur-md p-6 rounded-[32px] border border-white/20 shadow-2xl">
            <img src={logoUrl} alt={`${title} logo`} className="w-24 h-24 object-contain" onError={() => setImgError(true)} />
          </motion.div>
        ) : (
          <motion.div key="initials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[28px] border border-white/20 flex items-center justify-center mb-2 shadow-inner">
               <School className="text-white/40" size={32} />
            </div>
            <span className="text-5xl font-black text-white/90 tracking-tighter drop-shadow-2xl">{initials}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NewsCard: React.FC<{ news: NewsItem; schoolInfo: any; onDiscuss?: () => void }> = ({ news, schoolInfo, onDiscuss }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const primaryLink = ensureExternalUrl(news.sourceUrl || schoolInfo.url);

  return (
    <motion.div layout className="bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full border border-gray-100 dark:border-gray-700">
      <div className="relative h-56 overflow-hidden">
        <UniversityAvatar title={news.title} category={news.category} schoolUrl={schoolInfo.url} />
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20 shadow-xl">{news.category}</div>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center text-blue-600/50 dark:text-cyan-400/50 text-[10px] font-bold uppercase tracking-widest mb-4">
          <Calendar size={12} className="mr-2" />
          {news.date}
        </div>
        
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">
          {news.title}
        </h3>
        
        <div className="relative mb-6">
          <motion.div 
            layout
            initial={false}
            animate={{ height: isExpanded ? 'auto' : '4.5rem' }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {news.excerpt}
            </p>
          </motion.div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
          >
            {isExpanded ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show Summary</>}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-700 space-y-3">
          <button 
            onClick={onDiscuss}
            className="flex items-center justify-between w-full p-4 bg-emerald-500/10 dark:bg-cyan-500/10 border border-emerald-500/20 dark:border-cyan-500/20 rounded-2xl text-emerald-600 dark:text-cyan-400 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white dark:hover:bg-cyan-600 dark:hover:text-white transition-all group/ai relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-white/20 to-emerald-500/0 -translate-x-full group-hover/ai:translate-x-full transition-transform duration-1000"></div>
            <span className="flex items-center gap-2 relative z-10">
              <Brain size={14} className="animate-pulse" /> Discuss with AI Hub
            </span>
            <Sparkles size={14} className="relative z-10" />
          </button>

          <a 
            href={primaryLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between p-4 bg-blue-600 dark:bg-blue-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <span className="flex items-center gap-2"><ExternalLink size={14} /> Read Full Article</span>
            <ChevronRight size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

interface NewsGridProps {
  onDiscussAi?: (news: NewsItem) => void;
}

const NewsGrid: React.FC<NewsGridProps> = ({ onDiscussAi }) => {
  const [filter, setFilter] = useState<UniversityCategory>('All');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const loadLocalNews = useCallback(() => {
    setNewsList(getPublishedNews());
  }, []);

  const handleSyncLiveNews = useCallback(async (isSilent: boolean = false) => {
    if (isLoading) return;
    if (!isSilent) setIsLoading(true);
    
    try {
      const liveData = await fetchLiveNews();
      if (liveData && liveData.length > 0) {
        const local = getPublishedNews();
        const merged = [...local, ...liveData.filter(aiItem => !local.some(locItem => locItem.title === aiItem.title))];
        setNewsList(merged);
        
        const now = new Date();
        const syncTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSync(syncTime);
        localStorage.setItem('campusai_live_news', JSON.stringify(liveData));
        localStorage.setItem('campusai_last_sync_time', syncTime);
      }
    } catch (error) {
      console.error("News sync failed:", error);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    loadLocalNews();
    
    const cached = localStorage.getItem('campusai_live_news');
    const cachedTime = localStorage.getItem('campusai_last_sync_time');
    
    if (cached) {
      const liveData = JSON.parse(cached);
      const local = getPublishedNews();
      const merged = [...local, ...liveData.filter((aiItem: any) => !local.some(locItem => locItem.title === aiItem.title))];
      setNewsList(merged);
      setLastSync(cachedTime);
    }

    // AI Discovery triggers automatically on load
    handleSyncLiveNews(true);

    window.addEventListener('campusai_news_updated', loadLocalNews);
    return () => window.removeEventListener('campusai_news_updated', loadLocalNews);
  }, []);

  const categories: UniversityCategory[] = ['All', 'Federal', 'State', 'Private', 'JAMB'];
  const filteredNews = filter === 'All' ? newsList : newsList.filter(item => item.category === filter);
  
  const getSchoolInfo = (title: string, category: string, manualUrl?: string) => {
    if (manualUrl) return { url: manualUrl };
    if (category === 'JAMB') return { url: "https://www.jamb.gov.ng" };
    const lowerTitle = title.toLowerCase();
    const school = universityData.find(u => lowerTitle.includes(u.name.toLowerCase()) || (u.slug && lowerTitle.includes(u.slug.toLowerCase())));
    return school || { url: "https://www.jamb.gov.ng" };
  };

  return (
    <section id="news" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Academic Pulse</h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                Official Portals Sync
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Verified news from institutional portals updated in real-time.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setFilter(cat)} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handleSyncLiveNews()}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-cyan-400 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 group shrink-0"
            >
              {isLoading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              )}
              {isLoading ? 'Searching...' : 'Sync AI Discovery'}
            </button>
          </div>
        </div>

        {lastSync && (
          <div className="flex items-center gap-2 mb-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] justify-center lg:justify-start">
            <Clock size={12} />
            Portal Connectivity: <span className="text-emerald-500">Online</span> • Last Sync: <span className="text-blue-500">{lastSync}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news) => (
            <NewsCard 
              key={news.id} 
              news={news} 
              schoolInfo={getSchoolInfo(news.title, news.category, news.sourceUrl)} 
              onDiscuss={onDiscussAi ? () => onDiscussAi(news) : undefined}
            />
          ))}
          {filteredNews.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-[32px] border border-dashed border-gray-200 dark:border-gray-700">
               <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="font-bold text-gray-500">No updates found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
