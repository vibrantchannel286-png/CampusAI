
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import NewsGrid from './NewsGrid';
import ChatPreview from './ChatPreview';
import SidePanel from './SidePanel';
import AboutSection from './AboutSection';
import SettingsModal from './SettingsModal';
import ChatInterface from './ChatInterface';
import UniversityDirectory from './UniversityDirectory';
import TopRankings from './TopRankings';
import CutoffCalculator from './CutoffCalculator';
import StudentFeedback from './StudentFeedback';
import BillboardBanner from './BillboardBanner';
import AdUnit from './AdUnit';
import NotFound from './NotFound';
import { ArrowUp, Facebook, Instagram, Linkedin, Twitter, Youtube, Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialLink, AdminState, NewsItem } from '../types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [highlightedUni, setHighlightedUni] = useState<string | null>(null);
  const [pendingAiPrompt, setPendingAiPrompt] = useState<string | null>(null);
  
  const VALID_PAGES = ['home', 'ai', 'federal', 'state', 'private', 'jamb', 'about', 'settings'];

  const [admin, setAdmin] = useState<AdminState>({
    isLoggedIn: false,
    email: null
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('campusai_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    const savedSocials = localStorage.getItem('campusai_socials');
    if (savedSocials) {
      setSocialLinks(JSON.parse(savedSocials));
    } else {
      setSocialLinks([
        { platform: 'Facebook', url: '#' },
        { platform: 'Instagram', url: '#' },
        { platform: 'Linkedin', url: '#' },
      ]);
    }

    const savedAdmin = localStorage.getItem('campusai_admin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
    localStorage.setItem('campusai_theme', theme);
  }, [theme]);

  const handleAdminLogin = (email: string) => {
    const newState = { isLoggedIn: true, email };
    setAdmin(newState);
    localStorage.setItem('campusai_admin', JSON.stringify(newState));
  };

  const handleAdminLogout = () => {
    const newState = { isLoggedIn: false, email: null };
    setAdmin(newState);
    localStorage.removeItem('campusai_admin');
  };

  const handleUpdateSocialLinks = (links: SocialLink[]) => {
    setSocialLinks(links);
    localStorage.setItem('campusai_socials', JSON.stringify(links));
  };

  const handleSelectUniFromRankings = (slug: string) => {
    setHighlightedUni(slug);
    const element = document.getElementById('directory');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDiscussNews = (news: NewsItem) => {
    setPendingAiPrompt(`I just read the news: "${news.title}" (${news.category}, ${news.date}). Can you explain what this means for my 2026 admission and what steps I should take next?`);
    setCurrentPage('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = (id: string) => {
    if (id === 'settings') {
      setIsSettingsOpen(true);
      return;
    }
    
    setCurrentPage(id);
    
    if (['federal', 'state', 'private', 'jamb'].includes(id)) {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById('news');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (id === 'about') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById('about');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook': return <Facebook size={22} />;
      case 'Instagram': return <Instagram size={22} />;
      case 'Linkedin': return <Linkedin size={22} />;
      case 'Twitter': return <Twitter size={22} />;
      case 'Youtube': return <Youtube size={22} />;
      default: return null;
    }
  };

  const is404 = !VALID_PAGES.includes(currentPage);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-gray-950">
      <Navbar onNavigate={navigate} currentPage={currentPage} />
      
      <main className="flex-grow">
        {is404 ? (
          <NotFound onGoHome={() => navigate('home')} />
        ) : (
          <>
            {currentPage === 'home' && (
              <>
                <Hero 
                  onSearch={() => navigate('federal')} 
                  onAskAI={() => navigate('ai')} 
                />

                <TopRankings onSelectUni={handleSelectUniFromRankings} />
                
                <div className="container mx-auto px-4 md:px-8 mb-16">
                   <AdUnit type="billboard" />
                </div>

                <CutoffCalculator />

                <BillboardBanner />

                <div className="container mx-auto px-4 md:px-8 my-16">
                   <AdUnit type="billboard" />
                </div>

                <UniversityDirectory 
                  externalHighlight={highlightedUni} 
                  onClearHighlight={() => setHighlightedUni(null)} 
                />

                <StudentFeedback />

                <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12 py-12">
                  <div className="lg:w-2/3">
                    <NewsGrid onDiscussAi={handleDiscussNews} />
                  </div>
                  <aside className="lg:w-1/3">
                    <SidePanel />
                  </aside>
                </div>
                <ChatPreview onFullAccess={() => navigate('ai')} />
                <AboutSection />
              </>
            )}

            {currentPage === 'ai' && (
              <div className="pt-28 pb-10 min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
                <div className="container mx-auto px-4 h-full flex flex-col">
                  <div className="mb-6 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Admissions Hub</h1>
                    <p className="text-gray-600 dark:text-gray-400">Get instant answers to your complex campus questions.</p>
                  </div>
                  <ChatInterface 
                    onBack={() => navigate('home')} 
                    initialPrompt={pendingAiPrompt || undefined}
                    onClearPrompt={() => setPendingAiPrompt(null)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {!is404 && (
        <footer className="bg-gray-950 text-white py-20 border-t border-white/5 transition-colors">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
              <div className="col-span-1 md:col-span-2">
                <div 
                  className="flex items-center space-x-3 mb-8 cursor-pointer group"
                  onClick={scrollToTop}
                >
                  <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <path d="M10 40 L50 20 L90 40 L50 60 Z" fill="white" />
                    <path d="M25 47 L25 70 C25 70 50 80 75 70 L75 47" fill="none" stroke="white" strokeWidth="6" />
                    <path d="M35 35 L45 30 M55 30 L65 35 M40 40 L50 45 L60 40" stroke="cyan" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="90" cy="40" r="3" fill="cyan" />
                  </svg>
                  <div className="flex flex-col -space-y-1">
                    <span className="text-3xl font-black tracking-tighter">
                      Campus<span className="text-cyan-400">AI</span><span className="opacity-50">.ng</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                      Your Campus, Smarter
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-10">
                  Building the future of Nigerian education by providing verified, AI-driven updates for every student.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {socialLinks.filter(l => l.url && l.url !== '#').length > 0 ? (
                    socialLinks.filter(l => l.url && l.url !== '#').map((link) => (
                      <a 
                        key={link.platform} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/5 hover:bg-cyan-600 rounded-2xl flex items-center justify-center transition-all group"
                        title={link.platform}
                      >
                        <span className="group-hover:scale-110 transition-transform">
                          {getSocialIcon(link.platform)}
                        </span>
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-600 text-xs italic">Social links coming soon...</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-8">Navigation</h4>
                <ul className="space-y-5 text-gray-400 font-bold text-sm">
                  <li><button onClick={() => navigate('home')} className="hover:text-cyan-400 transition-colors">Home Portal</button></li>
                  <li><button onClick={() => navigate('federal')} className="hover:text-cyan-400 transition-colors">Federal Institutions</button></li>
                  <li><button onClick={() => navigate('jamb')} className="hover:text-cyan-400 transition-colors">JAMB 2026</button></li>
                  <li><button onClick={() => navigate('about')} className="hover:text-cyan-400 transition-colors">The Creator</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-8">Support</h4>
                <ul className="space-y-5 text-gray-400 font-bold text-sm">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Charter</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Use</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">API Docs</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Verify News</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-500 text-xs font-medium">
                © 2026 CampusAI.ng • Hand-crafted with <Heart size={12} className="inline text-red-500 mb-0.5 mx-1" fill="currentColor" /> by <span className="text-white font-bold">Emmanuel Iweh</span>
              </p>
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                <span>Verified Service</span>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme}
        onThemeChange={setTheme}
        admin={admin}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        socialLinks={socialLinks}
        onUpdateSocialLinks={handleUpdateSocialLinks}
      />

      {showScrollTop && !is404 && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-cyan-500 text-white rounded-2xl shadow-2xl hover:scale-110 hover:bg-cyan-600 transition-all z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default App;
