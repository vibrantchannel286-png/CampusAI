
import React, { useState, useEffect } from 'react';
import { X, Save, Database, Layout, CheckCircle2, Moon, Sun, Lock, LogOut, Plus, Trash2, ShieldCheck, Globe, Megaphone, DollarSign, MessageCircle, Share2, Facebook, Instagram, Linkedin, Twitter, Youtube, Newspaper, Send, Loader2, Link as LinkIcon, Calendar, ShoppingBag, Tag, Key, Info as InfoIcon, ExternalLink, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialLink, AdminState, BillboardAd, NewsItem, UniversityCategory } from '../types';
import { getPublishedNews, publishNewsUpdate, deleteNewsUpdate } from '../services/dbService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  admin: AdminState;
  onAdminLogin: (email: string) => void;
  onAdminLogout: () => void;
  socialLinks: SocialLink[];
  onUpdateSocialLinks: (links: SocialLink[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  onThemeChange, 
  admin, 
  onAdminLogin, 
  onAdminLogout,
  socialLinks,
  onUpdateSocialLinks
}) => {
  const [firebaseConfig, setFirebaseConfig] = useState('');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [loginEmail, setLoginEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [googleAdsEnabled, setGoogleAdsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'monetization' | 'admin'>('general');
  const [saved, setSaved] = useState(false);
  const [editingLinks, setEditingLinks] = useState<SocialLink[]>([]);
  
  // News Management State
  const [showPostForm, setShowPostForm] = useState(false);
  const [publishedNews, setPublishedNews] = useState<NewsItem[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newPost, setNewPost] = useState<Partial<NewsItem>>({
    category: 'Federal',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  });

  // Billboard Ads Management State
  const [billboardAds, setBillboardAds] = useState<BillboardAd[]>([]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [isPublishingAd, setIsPublishingAd] = useState(false);
  const [newAd, setNewAd] = useState<Partial<BillboardAd>>({
    category: 'Services',
    isVerified: true,
    isSponsored: true
  });

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('campusai_firebase');
      if (stored) setFirebaseConfig(stored);
      
      const storedWhatsapp = localStorage.getItem('campusai_whatsapp');
      if (storedWhatsapp) setWhatsappNumber(storedWhatsapp);

      const storedAdsStatus = localStorage.getItem('campusai_google_ads') === 'true';
      setGoogleAdsEnabled(storedAdsStatus);
      
      const savedAds = localStorage.getItem('campusai_billboard_ads');
      if (savedAds) setBillboardAds(JSON.parse(savedAds));
      
      setPublishedNews(getPublishedNews());
      setEditingLinks(socialLinks);
    }
  }, [isOpen, socialLinks]);

  const validateFirebase = () => {
    setValidationStatus('validating');
    
    setTimeout(() => {
      try {
        let configStr = firebaseConfig.trim();
        
        // Handle common JS snippet format: const firebaseConfig = { ... };
        if (configStr.includes('{') && configStr.includes('}')) {
          const start = configStr.indexOf('{');
          const end = configStr.lastIndexOf('}') + 1;
          const jsonContent = configStr.substring(start, end)
            .replace(/(\w+):/g, '"$1":') // add quotes to keys
            .replace(/'/g, '"') // replace single quotes
            .replace(/,\s*}/g, '}'); // remove trailing commas
          
          const config = JSON.parse(jsonContent);
          const required = ['apiKey', 'projectId', 'appId'];
          const hasAll = required.every(key => key in config && config[key]);
          setValidationStatus(hasAll ? 'valid' : 'invalid');
        } else {
          setValidationStatus('invalid');
        }
      } catch (e) {
        console.error("Firebase Config Parsing Error:", e);
        setValidationStatus('invalid');
      }
    }, 1200);
  };

  const handleSave = () => {
    localStorage.setItem('campusai_firebase', firebaseConfig);
    localStorage.setItem('campusai_whatsapp', whatsappNumber);
    localStorage.setItem('campusai_google_ads', googleAdsEnabled ? 'true' : 'false');
    localStorage.setItem('campusai_billboard_ads', JSON.stringify(billboardAds));
    onUpdateSocialLinks(editingLinks);
    setSaved(true);
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  const handlePublishPost = async () => {
    if (!newPost.title || !newPost.excerpt) return;
    setIsPublishing(true);
    try {
      await publishNewsUpdate({
        title: newPost.title,
        category: newPost.category as UniversityCategory,
        excerpt: newPost.excerpt,
        date: newPost.date || '',
        sourceUrl: newPost.sourceUrl,
        image: ''
      });
      setPublishedNews(getPublishedNews());
      setNewPost({ 
        category: 'Federal', 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) 
      });
      setShowPostForm(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishAd = () => {
    if (!newAd.title || !newAd.description) return;
    setIsPublishingAd(true);
    
    const adToSave: BillboardAd = {
      id: Date.now().toString(),
      title: newAd.title!,
      description: newAd.description!,
      category: (newAd.category as any) || 'Services',
      price: newAd.price || 'Contact for price',
      link: newAd.link || '#',
      whatsapp: newAd.whatsapp,
      isVerified: !!newAd.isVerified,
      isSponsored: true
    };

    const updatedAds = [adToSave, ...billboardAds];
    setBillboardAds(updatedAds);
    localStorage.setItem('campusai_billboard_ads', JSON.stringify(updatedAds));
    window.dispatchEvent(new Event('storage'));
    
    setNewAd({ category: 'Services', isVerified: true, isSponsored: true });
    setShowAdForm(false);
    setIsPublishingAd(false);
  };

  const handleDeleteAd = (id: string) => {
    if (window.confirm('Remove this advertisement?')) {
      const updated = billboardAds.filter(a => a.id !== id);
      setBillboardAds(updated);
      localStorage.setItem('campusai_billboard_ads', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === '5ej852963@gmail.com') {
      onAdminLogin(loginEmail);
      setLoginEmail('');
    }
  };

  const updateLinkUrl = (platform: string, url: string) => {
    setEditingLinks(prev => {
      const existing = prev.find(l => l.platform === platform);
      if (existing) return prev.map(l => l.platform === platform ? { ...l, url } : l);
      return [...prev, { platform: platform as any, url }];
    });
  };

  if (!isOpen) return null;

  const platforms = [
    { name: 'Facebook', icon: <Facebook size={18} /> },
    { name: 'Instagram', icon: <Instagram size={18} /> },
    { name: 'Linkedin', icon: <Linkedin size={18} /> },
    { name: 'Twitter', icon: <Twitter size={18} /> },
    { name: 'Youtube', icon: <Youtube size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 bg-blue-600 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3"><Layout size={24} /><h2 className="text-2xl font-bold">System Console</h2></div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="flex border-b border-gray-100 dark:border-gray-800 shrink-0">
          {(['general', 'monetization', 'admin'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>
              {tab === 'admin' && admin.isLoggedIn ? "Admin Dashboard" : tab}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-grow custom-scrollbar">
          {activeTab === 'general' ? (
            <div className="space-y-8">
              <div>
                <label className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-6"><Layout size={18} className="text-blue-600" /> Interface Customization</label>
                <div 
                  className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group" 
                  onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'light' ? 'bg-orange-50 text-orange-500' : 'bg-blue-900/30 text-blue-400'}`}>
                      {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
                    </div>
                    <div>
                      <span className="block font-black text-gray-900 dark:text-white capitalize">{theme} Mode Active</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Toggle UI visual style</span>
                    </div>
                  </div>
                  <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200' : 'bg-blue-600'}`}>
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${theme === 'light' ? 'left-1' : 'left-7'}`}></div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 leading-relaxed italic">
                  AI services and real-time portal syncing function automatically using CampusAI's secure cloud keys.
                </p>
              </div>
            </div>
          ) : activeTab === 'monetization' ? (
            <div className="space-y-8">
              <div className="text-center"><div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600"><DollarSign size={32} /></div><h3 className="text-lg font-bold">Advert Revenue Settings</h3></div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2 pl-1"><MessageCircle size={14} className="text-emerald-500" /> Admin Contact (For Sales)</label>
                  <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="e.g. 2348123456789" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 dark:text-white outline-none font-bold" />
                </div>
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Globe size={20} /></div><div><h4 className="font-bold text-sm text-gray-900 dark:text-white">Google Ad Network</h4><p className="text-[10px] font-bold text-gray-500 uppercase">Toggle Platform Ad Slots</p></div></div>
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${googleAdsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`} onClick={() => setGoogleAdsEnabled(!googleAdsEnabled)}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${googleAdsEnabled ? 'left-7' : 'left-1'}`}></div></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!admin.isLoggedIn ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="text-center mb-6"><div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600"><Lock size={32} /></div><h3 className="text-lg font-bold">Identity Verification</h3></div>
                  <input 
                    type="text" 
                    autoComplete="off"
                    spellCheck={false}
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                    placeholder="Enter Admin Credentials" 
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 dark:text-white outline-none border border-transparent focus:border-blue-500" 
                  />
                  <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-colors">Enter Secure Portal</button>
                </form>
              ) : (
                <div className="space-y-12">
                  {/* Firebase Bridge */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-gray-500"><Database size={14} className="text-blue-600" /> Firebase Core Sync</label>
                      <button 
                        onClick={validateFirebase} 
                        disabled={!firebaseConfig || validationStatus === 'validating'} 
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                          validationStatus === 'valid' ? 'bg-emerald-500 text-white border-emerald-500' : 
                          validationStatus === 'invalid' ? 'bg-red-500 text-white border-red-500' :
                          'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {validationStatus === 'validating' && <Loader2 size={12} className="animate-spin" />}
                        {validationStatus === 'valid' ? 'Synced ✓' : 
                         validationStatus === 'invalid' ? 'Invalid Config !' : 
                         validationStatus === 'validating' ? 'Syncing...' : 'Test Sync'}
                      </button>
                    </div>
                    <textarea 
                      className="w-full h-32 bg-white dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl p-3 font-mono text-[10px] dark:text-white outline-none transition-all shadow-inner" 
                      value={firebaseConfig} 
                      onChange={(e) => { setFirebaseConfig(e.target.value); setValidationStatus('idle'); }} 
                      placeholder='Paste your Firebase config snippet or JSON...' 
                    />
                    {validationStatus === 'invalid' && (
                      <p className="mt-2 text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <AlertCircle size={10} /> Configuration is missing required fields (apiKey, projectId, appId).
                      </p>
                    )}
                  </div>

                  {/* News Post Management */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <label className="flex items-center gap-2 font-bold text-gray-900 dark:text-white"><Newspaper size={18} className="text-blue-600" /> News Manager</label>
                      <button 
                        onClick={() => { setShowPostForm(!showPostForm); setShowAdForm(false); }} 
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${showPostForm ? 'bg-red-50 text-red-500' : 'bg-blue-600 text-white'}`}
                      >
                        {showPostForm ? <X size={14} /> : <Plus size={14} />} Post News
                      </button>
                    </div>

                    <AnimatePresence>
                      {showPostForm && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[24px] mb-8 space-y-4 border border-gray-100 dark:border-gray-800 shadow-inner overflow-hidden">
                          <input placeholder="Update Title (e.g. JAMB 2026 Starting)" className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl text-sm outline-none border border-transparent focus:border-blue-500 font-bold" value={newPost.title || ''} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                          <div className="grid grid-cols-2 gap-3">
                            <select className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl text-sm outline-none border border-transparent focus:border-blue-500" value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value as any})}>
                              <option>Federal</option><option>State</option><option>Private</option><option>JAMB</option>
                            </select>
                            <input placeholder="Date (Jan 02, 2026)" className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl text-sm outline-none border border-transparent focus:border-blue-500" value={newPost.date || ''} onChange={e => setNewPost({...newPost, date: e.target.value})} />
                          </div>
                          <textarea placeholder="Excerpt..." className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl text-sm outline-none h-24 border border-transparent focus:border-blue-500" value={newPost.excerpt || ''} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} />
                          <input placeholder="Source URL" className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl text-sm outline-none border border-transparent focus:border-blue-500" value={newPost.sourceUrl || ''} onChange={e => setNewPost({...newPost, sourceUrl: e.target.value})} />
                          <button onClick={handlePublishPost} disabled={isPublishing || !newPost.title} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                            {isPublishing ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Deploy Post</>}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Billboard Ad Management */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <label className="flex items-center gap-2 font-bold text-gray-900 dark:text-white"><Megaphone size={18} className="text-emerald-500" /> Billboard Ads Manager</label>
                      <button 
                        onClick={() => { setShowAdForm(!showAdForm); setShowPostForm(false); }} 
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${showAdForm ? 'bg-red-50 text-red-500' : 'bg-emerald-600 text-white'}`}
                      >
                        {showAdForm ? <X size={14} /> : <Plus size={14} />} Create Ad
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAdForm && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[24px] mb-8 space-y-4 border border-emerald-100 dark:border-emerald-900/30 shadow-inner overflow-hidden">
                          <input placeholder="Business/Product Title" className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl text-sm outline-none border border-transparent focus:border-emerald-500 font-bold" value={newAd.title || ''} onChange={e => setNewAd({...newAd, title: e.target.value})} />
                          <div className="grid grid-cols-2 gap-3">
                            <select className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl text-sm outline-none border border-transparent focus:border-emerald-500" value={newAd.category} onChange={e => setNewAd({...newAd, category: e.target.value as any})}>
                              <option>Hostels</option><option>Gadgets</option><option>Services</option><option>Tutorials</option>
                            </select>
                            <div className="relative">
                              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                              <input placeholder="Price (e.g. ₦50k/yr)" className="w-full bg-white dark:bg-gray-900 p-4 pl-10 rounded-xl text-sm outline-none border border-transparent focus:border-emerald-500" value={newAd.price || ''} onChange={e => setNewAd({...newAd, price: e.target.value})} />
                            </div>
                          </div>
                          <textarea placeholder="Ad Description..." className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl text-sm outline-none h-24 border border-transparent focus:border-emerald-500" value={newAd.description || ''} onChange={e => setNewAd({...newAd, description: e.target.value})} />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                              <input placeholder="External Web Link" className="w-full bg-white dark:bg-gray-900 p-4 pl-10 rounded-xl text-sm outline-none border border-transparent focus:border-emerald-500" value={newAd.link || ''} onChange={e => setNewAd({...newAd, link: e.target.value})} />
                            </div>
                            <div className="relative">
                              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                              <input placeholder="WhatsApp (234...)" className="w-full bg-white dark:bg-gray-900 p-4 pl-10 rounded-xl text-sm outline-none border border-transparent focus:border-emerald-500" value={newAd.whatsapp || ''} onChange={e => setNewAd({...newAd, whatsapp: e.target.value})} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-transparent">
                             <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Display Verified Badge</span>
                             </div>
                             <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${newAd.isVerified ? 'bg-emerald-500' : 'bg-gray-300'}`} onClick={() => setNewAd({...newAd, isVerified: !newAd.isVerified})}>
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${newAd.isVerified ? 'left-5.5' : 'left-0.5'}`}></div>
                             </div>
                          </div>
                          <button onClick={handlePublishAd} disabled={isPublishingAd || !newAd.title} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-colors hover:bg-emerald-700">
                            {isPublishingAd ? <Loader2 className="animate-spin" size={14} /> : <><ShoppingBag size={14} /> Launch Billboard Ad</>}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-3">
                      {billboardAds.map(ad => (
                        <div key={ad.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-emerald-50 dark:border-emerald-900/20 shadow-sm">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 shrink-0"><Tag size={18} /></div>
                            <div className="overflow-hidden">
                              <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{ad.title}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">{ad.category} • {ad.price}</p>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteAd(ad.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      {billboardAds.length === 0 && (
                        <p className="text-center py-4 text-xs font-bold text-gray-400 italic">No custom ads currently running.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                    <label className="flex items-center gap-2 font-bold mb-6 text-gray-900 dark:text-white"><Share2 size={18} className="text-blue-600" /> Platform Connections</label>
                    <div className="space-y-4">
                      {platforms.map(p => (
                        <div key={p.name} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">{p.icon}</div>
                          <input type="url" value={editingLinks.find(l => l.platform === p.name)?.url || ''} onChange={(e) => updateLinkUrl(p.name, e.target.value)} placeholder={`${p.name} URL`} className="flex-grow bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 rounded-xl p-3 text-sm outline-none dark:text-white" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={onAdminLogout} className="flex items-center gap-2 text-red-500 font-bold text-sm pt-4 border-t w-full justify-center hover:text-red-600"><LogOut size={18} /> Exit Dashboard</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-8 border-t shrink-0">
          <button onClick={handleSave} disabled={saved} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${saved ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {saved ? <CheckCircle2 /> : <Save size={20} />} {saved ? "Session Deployed!" : "Commit Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
