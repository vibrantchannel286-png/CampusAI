
import React, { useState, useEffect } from 'react';
import { Megaphone, Home, Laptop, Zap, CheckCircle, ExternalLink, PlusCircle, Sparkles, X, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BillboardAd, AdPackage } from '../types';

const DEFAULT_ADS: BillboardAd[] = [
  {
    id: 'def1',
    title: 'Your Business Here',
    description: 'Reach 50,000+ Nigerian students. Click "Place An Ad" to get started.',
    category: 'Services',
    price: '₦2,500/wk',
    link: '#',
    isVerified: true,
    isSponsored: true
  }
];

const AD_PACKAGES: AdPackage[] = [
  {
    name: "Student Basic",
    price: "₦2,500",
    duration: "7 Days",
    features: ["Standard Grid Slot", "Direct Link to WhatsApp", "Category Tag"],
    color: "bg-blue-500"
  },
  {
    name: "Premium Billboard",
    price: "₦15,000",
    duration: "30 Days",
    features: ["Priority Top Placement", "Verified Badge", "Highlighted Border", "30 Days Constant Display", "Best for Serious Brands"],
    color: "bg-gradient-to-r from-emerald-500 to-teal-600"
  },
  {
    name: "Campus Partner",
    price: "Custom",
    duration: "Full Semester",
    features: ["Hero Section Banner", "Social Media Spotlight", "Email Newsletter Inclusion"],
    color: "bg-purple-600"
  }
];

const BillboardBanner: React.FC = () => {
  const [showPricing, setShowPricing] = useState(false);
  const [ads, setAds] = useState<BillboardAd[]>([]);
  const adminWhatsapp = localStorage.getItem('campusai_whatsapp') || '2348000000000';

  useEffect(() => {
    const loadAds = () => {
      const savedAds = localStorage.getItem('campusai_billboard_ads');
      if (savedAds) {
        const parsed = JSON.parse(savedAds);
        setAds(parsed.length > 0 ? parsed : DEFAULT_ADS);
      } else {
        setAds(DEFAULT_ADS);
      }
    };

    loadAds();
    window.addEventListener('storage', loadAds);
    return () => window.removeEventListener('storage', loadAds);
  }, []);

  const handleBookAd = (packageName: string, price: string) => {
    const text = `Hello CampusAI Admin, I want to book the "${packageName}" Ad package (${price}) for my business. Please provide payment details and next steps.`;
    window.open(`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCheckOffer = (ad: BillboardAd) => {
    if (ad.whatsapp) {
      const text = `Hello, I saw your ad for "${ad.title}" on CampusAI.ng and I'm interested. Could you provide more details?`;
      window.open(`https://wa.me/${ad.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    } else if (ad.link && ad.link !== '#') {
      window.open(ad.link.startsWith('http') ? ad.link : `https://${ad.link}`, '_blank');
    } else {
      setShowPricing(true);
    }
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Hostels': return <Home size={18} />;
      case 'Gadgets': return <Laptop size={18} />;
      case 'Tutorials': return <Zap size={18} />;
      default: return <Megaphone size={18} />;
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-gray-900 dark:bg-blue-950 rounded-[56px] p-8 md:p-16 relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            <div className="lg:w-1/3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-cyan-500/20">
                <Sparkles size={12} />
                Promoted Marketplace
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1]">
                Launch Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Campaign</span>
              </h2>
              <p className="text-gray-400 font-medium mb-10 text-lg leading-relaxed">
                Reach admission seekers and current students across Nigeria. Start from just ₦2,500/week.
              </p>
              
              <button 
                onClick={() => setShowPricing(true)}
                className="flex items-center justify-center gap-2 px-10 py-5 bg-white text-gray-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 shadow-2xl shadow-cyan-500/20"
              >
                <PlusCircle size={20} />
                Get Advert Space
              </button>
            </div>

            <div className="lg:w-2/3 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.map((ad, idx) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] group hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between h-full min-h-[260px]"
                    onClick={() => handleCheckOffer(ad)}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-white/10 rounded-2xl text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                          {getIcon(ad.category)}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {ad.isSponsored && <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400/60 bg-cyan-400/5 px-2 py-1 rounded-md border border-cyan-400/10">Paid Ad</span>}
                          {ad.isVerified && <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20"><ShieldCheck size={10} /> Verified</div>}
                        </div>
                      </div>
                      <h4 className="text-white font-bold text-xl mb-3 group-hover:text-cyan-400 transition-colors">{ad.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">{ad.description}</p>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-lg">{ad.price}</span>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{ad.category}</span>
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white hover:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Check Offer <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {ads.length < 4 && (
                  <button 
                    onClick={() => setShowPricing(false)}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[40px] p-8 text-center hover:border-cyan-500/50 hover:bg-white/5 transition-all group"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-600 group-hover:text-cyan-400 group-hover:scale-110 transition-all mb-4">
                      <PlusCircle size={32} />
                    </div>
                    <h5 className="text-white font-bold mb-2">Slot Available</h5>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Book Instantly</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPricing && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPricing(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white dark:bg-gray-900 w-full max-w-4xl rounded-[48px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Select Your Package</h3>
                    <p className="text-gray-500 text-sm font-medium">Click to initiate payment via WhatsApp with the CampusAI Admin.</p>
                  </div>
                  <button onClick={() => setShowPricing(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {AD_PACKAGES.map((pkg) => (
                    <div 
                      key={pkg.name} 
                      className={`flex flex-col rounded-[32px] p-8 border transition-all group relative overflow-hidden ${
                        pkg.name === 'Premium Billboard' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 scale-105 shadow-xl shadow-emerald-500/10 z-10' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      {pkg.name === 'Premium Billboard' && (
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Most Popular</div>
                      )}
                      <div className={`w-12 h-12 ${pkg.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}><DollarSign size={24} /></div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1">{pkg.name}</h4>
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-3xl font-black text-gray-900 dark:text-white">{pkg.price}</span>
                        <span className="text-xs font-bold text-gray-400">/ {pkg.duration}</span>
                      </div>
                      <div className="space-y-4 mb-10 flex-grow">
                        {pkg.features.map(f => (
                          <div key={f} className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-400"><CheckCircle size={14} className="text-emerald-500 shrink-0" />{f}</div>
                        ))}
                      </div>
                      <button 
                        onClick={() => handleBookAd(pkg.name, pkg.price)} 
                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          pkg.name === 'Premium Billboard' 
                          ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' 
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        Book Now & Pay
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BillboardBanner;
