
import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Award, Calendar, Mail, CheckCircle2, ExternalLink, Loader2, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import universityData from '../universities';
import AdUnit from './AdUnit';

const SidePanel: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const isSubbed = localStorage.getItem('campusai_subscriber');
    if (isSubbed) setSubscribed(true);
    const config = localStorage.getItem('campusai_firebase');
    if (config && config.includes('apiKey')) setIsLive(true);
  }, []);

  const trending = useMemo(() => {
    const shuffled = [...universityData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map(uni => ({ name: uni.name, status: '2026 Updates', url: uni.url }));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    localStorage.setItem('campusai_subscriber', 'true');
    setSubscribed(true);
    setIsSubmitting(false);
    setEmail('');
  };

  return (
    <div className="space-y-8">
      {/* Newsletter */}
      <div className="bg-blue-600 dark:bg-blue-800 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-4 right-6 z-20">
          {isLive ? (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-[8px] font-black uppercase tracking-widest text-emerald-300">
              <Wifi size={8} /> Live Cloud
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-blue-200">
              <WifiOff size={8} /> Simulation
            </div>
          )}
        </div>
        <AnimatePresence mode="wait">
          {subscribed ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={32} className="text-emerald-300" /></div>
              <h3 className="text-xl font-black mb-2">Subscribed!</h3>
              <p className="text-blue-100 text-sm">We'll send you 2026 admission alerts.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Mail size={20} /> Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <input type="email" required placeholder="name@example.com" className="w-full bg-blue-700/50 border border-blue-400/30 rounded-2xl p-4 text-white outline-none font-bold" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button disabled={isSubmitting} className="w-full bg-white text-blue-700 font-black py-4 rounded-2xl shadow-xl uppercase text-xs tracking-widest">Join 50k+ Students</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trending Portals */}
      <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6"><TrendingUp className="text-blue-600 dark:text-cyan-400" /><h3 className="text-lg font-bold">Active Portals</h3></div>
        <div className="space-y-4">
          {trending.map((uni, i) => (
            <a key={i} href={uni.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-2 -mx-2 rounded-xl transition-colors">
              <span className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-1">{uni.name}</span>
              <ExternalLink size={12} className="text-gray-300 group-hover:text-blue-500" />
            </a>
          ))}
        </div>
      </div>

      {/* Sidebar Google Ad Unit */}
      <AdUnit type="sidebar" />

      {/* Top Topics */}
      <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6"><Award className="text-emerald-600" /><h3 className="text-lg font-bold">Top JAMB Topics</h3></div>
        <div className="flex flex-wrap gap-2">
          {['Subject Combos', 'Cut-off Marks', 'Registration'].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-800 cursor-pointer">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
