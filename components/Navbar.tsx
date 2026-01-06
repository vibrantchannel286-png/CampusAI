
import React, { useState, useEffect } from 'react';
import { Home, School, Building2, Brain, Newspaper, Info, Settings, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', icon: <Home size={18} />, id: 'home' },
    { name: 'Federal', icon: <School size={18} />, id: 'federal' },
    { name: 'State', icon: <Building2 size={18} />, id: 'state' },
    { name: 'Private', icon: <School size={18} />, id: 'private' },
    { name: 'AI Assistant', icon: <Brain size={18} />, id: 'ai' },
    { name: 'JAMB', icon: <Newspaper size={18} />, id: 'jamb' },
    { name: 'About', icon: <Info size={18} />, id: 'about' },
  ];

  const LogoIcon = () => (
    <svg viewBox="0 0 100 100" className="w-10 h-10 transition-transform group-hover:scale-110">
      <path 
        d="M10 40 L50 20 L90 40 L50 60 Z" 
        fill="currentColor" 
        className={isScrolled ? "text-gray-700 dark:text-gray-100" : "text-white"} 
      />
      <path 
        d="M25 47 L25 70 C25 70 50 80 75 70 L75 47" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="6" 
        className={isScrolled ? "text-gray-700 dark:text-gray-100" : "text-white"} 
      />
      <path 
        d="M35 35 L45 30 M55 30 L65 35 M40 40 L50 45 L60 40" 
        stroke="cyan" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <circle cx="90" cy="40" r="3" fill="cyan" />
      <path d="M15 45 L15 65" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" className="opacity-50" />
    </svg>
  );

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4 text-white'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <LogoIcon />
          <div className="flex flex-col -space-y-1">
            <span className={`text-2xl font-black tracking-tighter ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
              Campus<span className="text-cyan-400">AI</span><span className="opacity-70">.ng</span>
            </span>
            <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${isScrolled ? 'text-gray-400 dark:text-gray-500' : 'text-white/60'}`}>
              Your Campus, Smarter
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center space-x-1.5 font-bold text-sm hover:text-cyan-400 transition-colors ${
                currentPage === item.id 
                  ? 'text-cyan-400' 
                  : (isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90')
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
          <button 
            onClick={() => onNavigate('settings')}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-cyan-500 transition-all ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('settings')}
            className={`p-2 ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`}
          >
            <Settings size={22} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 fixed inset-0 top-[60px] z-40 p-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 p-4 rounded-xl text-lg font-semibold ${
                  currentPage === item.id ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300 active:bg-gray-50 dark:active:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
