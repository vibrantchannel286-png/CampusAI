
import React from 'react';
import { Globe, Shield, Heart, Sparkles, CheckCircle, Quote, Mail, Linkedin, User } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:items-start">
            {/* Portrait Column - Replaced image with a premium stylized avatar */}
            <div className="lg:w-2/5 relative">
              <div className="relative group">
                {/* Decorative Background Glows */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 dark:bg-cyan-400/5 rounded-full blur-3xl"></div>
                
                {/* Main Card Container - Vertical Portrait Card */}
                <div className="relative z-10 aspect-[3/4] w-full max-w-[380px] mx-auto rounded-[48px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-4 border-white dark:border-gray-900 group-hover:scale-[1.02] transition-transform duration-700 bg-gradient-to-br from-gray-900 to-black">
                  
                  {/* Stylized Avatar Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                      <User size={120} className="text-gray-700 dark:text-gray-800 relative z-10 opacity-50" strokeWidth={1} />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-8xl font-black text-white/10 select-none">EI</span>
                      </div>
                    </div>
                  </div>

                  {/* Tech Grid Overlay */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  
                  {/* Verified & Brand Overlays */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                    <CheckCircle size={14} className="text-cyan-400" fill="currentColor" />
                    Verified Architect
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity"></div>
                  
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-white tracking-tight">Emmanuel Iweh</span>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        Founder & CEO
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Social Links */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                  <a href="#" className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:-translate-x-2 border border-gray-100 dark:border-gray-700">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-950 hover:text-white transition-all hover:-translate-x-2 border border-gray-100 dark:border-gray-700">
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Text Content Column */}
            <div className="lg:w-3/5">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800">
                <Sparkles size={12} />
                The Visionary Behind CampusAI
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                Empowering the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Nigerian Students</span>
              </h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-medium">
                <p>
                  <strong>Emmanuel Iweh</strong> is a tech enthusiast and education advocate dedicated to empowering Nigerian students. As the mind behind <strong>CampusAI.ng</strong>, he leverages state-of-the-art AI technology to provide accurate updates, smart insights, and guidance tailored to students’ academic journeys.
                </p>
                <p>
                  Emmanuel believes that technology should illuminate the path through the complexities of the Nigerian educational system, helping every student make informed decisions and reach their full potential.
                </p>
              </div>
              
              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-12">
                <div className="group p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[32px] border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700 transition-all">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                    <Globe size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Verified Accuracy</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">Direct synchronization with 150+ institutional portals for real-time academic reliability.</p>
                </div>
                <div className="group p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[32px] border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <Shield size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Smart Insights</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">AI-driven guidance tailored specifically to the goals of Nigerian admission seekers.</p>
                </div>
              </div>

              {/* Founder's Quote Card */}
              <div className="relative p-10 bg-gray-900 dark:bg-black rounded-[48px] text-white shadow-2xl overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                  <Quote size={120} />
                </div>
                
                <div className="relative z-10 flex flex-col gap-6">
                  <Heart size={32} className="text-red-500" fill="currentColor" />
                  <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight italic">
                    "Technology should be the light that guides students through the complexities of the Nigerian educational system. That's why CampusAI exists."
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">The Architect's Vision</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
