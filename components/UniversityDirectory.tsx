
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, School, Building2, Landmark, X, Filter, Sparkles, Command, Info, History, MapPin, Award, Loader2, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import universityData from '../universities';
import { getUniversityDetailedInfo, getUniversityCourses } from '../services/geminiService';

interface UniBio {
  bio: string;
  founded: string;
  motto: string;
  bestKnownFor: string;
  campusVibe: string;
}

interface UniversityDirectoryProps {
  externalHighlight?: string | null;
  onClearHighlight?: () => void;
}

const UniversityDirectory: React.FC<UniversityDirectoryProps> = ({ externalHighlight, onClearHighlight }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Federal' | 'State' | 'Private'>('All');
  const [selectedUni, setSelectedUni] = useState<{ name: string; category: string; url: string; slug?: string } | null>(null);
  
  // AI State
  const [uniBio, setUniBio] = useState<UniBio | null>(null);
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);
  
  const filteredUniversities = useMemo(() => {
    let results = universityData;
    
    if (activeCategory !== 'All') {
      results = results.filter(uni => uni.category === activeCategory);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(uni => 
        uni.name.toLowerCase().includes(term) || 
        uni.slug?.toLowerCase().includes(term)
      );
    }
    
    return results;
  }, [searchTerm, activeCategory]);

  const displayedUniversities = filteredUniversities.slice(0, 10);

  // External highlight logic (from rankings)
  useEffect(() => {
    if (externalHighlight) {
      const uni = universityData.find(u => u.slug === externalHighlight);
      if (uni) {
        handleShowInfo(uni);
        if (onClearHighlight) onClearHighlight();
      }
    }
  }, [externalHighlight]);

  // Auto-spotlight logic: If search perfectly matches one result, spotlight it.
  useEffect(() => {
    if (searchTerm.length > 2 && filteredUniversities.length === 1 && !selectedUni) {
      handleShowInfo(filteredUniversities[0]);
    }
  }, [filteredUniversities, searchTerm]);

  const handleShowInfo = async (uni: any) => {
    setSelectedUni(uni);
    setIsBioLoading(true);
    setIsCoursesLoading(true);
    setUniBio(null);
    setAvailableCourses([]);

    // Fetch bio and courses in parallel
    Promise.all([
      getUniversityDetailedInfo(uni.name).then(data => {
        setUniBio(data);
        setIsBioLoading(false);
      }),
      getUniversityCourses(uni.name).then(courses => {
        setAvailableCourses(courses);
        setIsCoursesLoading(false);
      })
    ]).catch(e => {
      console.error(e);
      setIsBioLoading(false);
      setIsCoursesLoading(false);
    });
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Federal': return { 
        bg: 'bg-blue-50 dark:bg-blue-900/40', 
        text: 'text-blue-600 dark:text-blue-300', 
        border: 'border-blue-100 dark:border-blue-800',
        icon: <Landmark size={14} />
      };
      case 'State': return { 
        bg: 'bg-emerald-50 dark:bg-emerald-900/40', 
        text: 'text-emerald-600 dark:text-emerald-300', 
        border: 'border-emerald-100 dark:border-emerald-800',
        icon: <Building2 size={14} />
      };
      case 'Private': return { 
        bg: 'bg-purple-50 dark:bg-purple-900/40', 
        text: 'text-purple-600 dark:text-purple-300', 
        border: 'border-purple-100 dark:border-purple-800',
        icon: <School size={14} />
      };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: <School size={14} /> };
    }
  };

  return (
    <section id="directory" className="py-12 md:py-24 bg-white dark:bg-gray-950 transition-colors border-b border-gray-100 dark:border-gray-800 scroll-mt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 dark:border-blue-800">
              <Command size={12} />
              Portal Directory
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight">
              Institutional <span className="text-blue-600 dark:text-cyan-400">Gateways</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto">
              Secure, direct access to verified admission portals for over 150 institutions.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-8 md:mb-12 space-y-6 md:space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[28px] md:rounded-[32px] blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
              
              <div className="relative flex items-center">
                <Search className="absolute left-5 md:left-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search 150+ portals (e.g., UNILAG...)"
                  className="w-full pl-12 md:pl-16 pr-12 py-5 md:py-7 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[24px] md:rounded-[32px] text-base md:text-xl font-bold outline-none focus:border-blue-500 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (selectedUni) setSelectedUni(null);
                  }}
                />
                {searchTerm && (
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedUni(null); }}
                    className="absolute right-5 md:right-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar scroll-smooth px-1">
                {(['All', 'Federal', 'State', 'Private'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setSelectedUni(null);
                    }}
                    className={`px-5 py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap shrink-0 ${
                      activeCategory === cat 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/25' 
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800 whitespace-nowrap">
                Found <span className="text-blue-600 dark:text-cyan-400">{filteredUniversities.length}</span> Portals
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {selectedUni ? (
                /* Spotlight View */
                <motion.div 
                  key="spotlight"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-gray-50 dark:bg-gray-900 rounded-[32px] md:rounded-[48px] p-6 md:p-12 border border-gray-100 dark:border-gray-800 shadow-inner relative overflow-hidden"
                >
                  <button 
                    onClick={() => setSelectedUni(null)}
                    className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-lg transition-all active:scale-95 z-20"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start relative z-10">
                    {/* Header Info */}
                    <div className="w-full lg:w-1/4 flex flex-col items-center lg:items-start text-center lg:text-left">
                      <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] ${getCategoryTheme(selectedUni.category).bg} flex items-center justify-center font-black text-4xl md:text-5xl ${getCategoryTheme(selectedUni.category).text} border-4 ${getCategoryTheme(selectedUni.category).border} mb-6 md:mb-8 shadow-2xl shrink-0`}>
                        {selectedUni.slug ? selectedUni.slug.substring(0, 2).toUpperCase() : selectedUni.name.substring(0, 2).toUpperCase()}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                        {selectedUni.name}
                      </h3>
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 ${getCategoryTheme(selectedUni.category).bg} ${getCategoryTheme(selectedUni.category).text} border ${getCategoryTheme(selectedUni.category).border}`}>
                        {getCategoryTheme(selectedUni.category).icon}
                        {selectedUni.category}
                      </div>
                      
                      <div className="w-full">
                        <a 
                          href={selectedUni.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 w-full py-4 md:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[20px] md:rounded-[24px] font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                        >
                          Visit Official Portal
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>

                    {/* AI Bio & Courses Area */}
                    <div className="w-full lg:w-3/4 space-y-8 md:space-y-10">
                      {isBioLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse rounded-full"></div>
                            <Loader2 size={40} className="animate-spin text-blue-600 dark:text-cyan-400 relative z-10" />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold italic">CampusAI is retrieving institutional bio...</p>
                        </div>
                      ) : uniBio ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6 md:space-y-8"
                        >
                          <div className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-4">
                              <History size={14} className="text-blue-500" />
                              At A Glance
                            </h4>
                            <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-medium italic">
                              "{uniBio.bio}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-[24px] md:rounded-[28px] border border-gray-100 dark:border-gray-800">
                              <h5 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                <Award size={14} className="text-yellow-500" />
                                Institutional Motto
                              </h5>
                              <p className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-sm md:text-base">
                                {uniBio.motto}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-[24px] md:rounded-[28px] border border-gray-100 dark:border-gray-800">
                              <h5 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                <MapPin size={14} className="text-red-500" />
                                Heritage
                              </h5>
                              <p className="font-black text-gray-900 dark:text-white text-sm md:text-base">
                                Est. {uniBio.founded}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="p-5 md:p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-[24px] md:rounded-[32px] border border-blue-100 dark:border-blue-800/50">
                               <h5 className="font-black text-[10px] uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Campus Reputation</h5>
                               <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{uniBio.bestKnownFor}</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}

                      {/* Course Explorer Section */}
                      <div className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                          <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                            <GraduationCap size={16} className="text-emerald-500" />
                            Academic Programs
                          </h4>
                          {isCoursesLoading && (
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 animate-pulse">
                              <Loader2 size={12} className="animate-spin" />
                              Syncing...
                            </span>
                          )}
                        </div>

                        {isCoursesLoading ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Array(4).fill(0).map((_, i) => (
                              <div key={i} className="h-12 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-xl"></div>
                            ))}
                          </div>
                        ) : availableCourses.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                            {availableCourses.map((course, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.02 }}
                                className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-xl md:rounded-2xl hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-default"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></div>
                                  <span className="text-[10px] md:text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate group-hover:text-emerald-600 transition-colors">
                                    {course}
                                  </span>
                                </div>
                                <ChevronRight size={10} className="text-gray-300 dark:text-gray-700 shrink-0" />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <BookOpen size={20} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-[10px] text-gray-400 font-medium">Full course list available on portal.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : displayedUniversities.length > 0 ? (
                /* Grid View */
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                >
                  {displayedUniversities.map((uni, idx) => {
                    const theme = getCategoryTheme(uni.category);
                    const initials = uni.slug ? uni.slug.substring(0, 2).toUpperCase() : uni.name.substring(0, 2).toUpperCase();
                    
                    return (
                      <motion.div
                        key={uni.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] md:rounded-[32px] hover:border-blue-500 dark:hover:border-cyan-500 hover:shadow-xl transition-all group overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex items-center gap-4 md:gap-5 relative z-10 overflow-hidden">
                          <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-[16px] md:rounded-[20px] ${theme.bg} flex items-center justify-center font-black text-xl md:text-2xl ${theme.text} border ${theme.border} transition-all duration-500 shadow-sm`}>
                            {initials}
                          </div>
                          
                          <div className="flex flex-col gap-1 overflow-hidden">
                            <div className={`flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest ${theme.text}`}>
                              {theme.icon}
                              {uni.category}
                            </div>
                            <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate max-w-[150px] sm:max-w-none">
                              {uni.name}
                            </h4>
                            <div className="flex gap-4 mt-1">
                              <a href={uni.url} target="_blank" rel="noopener noreferrer" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors">
                                Portal <ExternalLink size={10} />
                              </a>
                              <button onClick={() => handleShowInfo(uni)} className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 items-center gap-1 transition-colors">
                                Info <Info size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleShowInfo(uni)}
                          className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 dark:group-hover:bg-cyan-600 group-hover:text-white transition-all relative z-10"
                        >
                          <Info size={18} />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                /* Empty View */
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 md:py-24 bg-gray-50/50 dark:bg-gray-900/50 rounded-[32px] md:rounded-[48px] border-2 border-dashed border-gray-200 dark:border-gray-800"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-sm">
                    <School size={40} className="text-gray-300 dark:text-gray-700" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3">No Institutional Match</h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xs md:max-w-md mx-auto font-medium px-4">
                    We couldn't find a portal for "{searchTerm}". Try common acronyms like UNILAG, UI, or OAU.
                  </p>
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveCategory('All'); setSelectedUni(null); }}
                    className="mt-6 md:mt-8 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full text-xs font-black text-blue-600 dark:text-cyan-400 hover:border-blue-500 transition-all hover:shadow-xl active:scale-95"
                  >
                    Reset Explorer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Featured Shortcuts */}
          {!searchTerm && !selectedUni && (
            <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 mb-6 md:mb-8 flex items-center justify-center gap-3">
                <Sparkles size={14} className="text-yellow-500" />
                Featured Portals
                <Sparkles size={14} className="text-yellow-500" />
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {['UNILAG', 'ABU', 'UNN', 'LASU', 'FUTA', 'UI', 'OAU', 'COVENANT'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-5 py-3 md:px-8 md:py-4 bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black tracking-widest transition-all border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg active:scale-95"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UniversityDirectory;
