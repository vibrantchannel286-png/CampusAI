
import React, { useState, useEffect } from 'react';
import { Search, Brain, Clock, Zap } from 'lucide-react';
import { TICKER_HEADLINES, ADMISSION_DATES } from '../constants';

interface HeroProps {
  onSearch: () => void;
  onAskAI: () => void;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const target = new Date(ADMISSION_DATES.JAMB_REG_START).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-2">
        <span className="text-xl md:text-2xl font-black text-white tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">{label}</span>
    </div>
  );

  return (
    <div className="inline-flex flex-col items-center p-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl animate-in zoom-in duration-1000">
      <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">
        <Clock size={12} className="animate-pulse" />
        JAMB 2026 Countdown
      </div>
      <div className="flex gap-3 md:gap-4">
        <TimeUnit label="Days" value={timeLeft.days} />
        <div className="text-white/20 pt-4 font-black">:</div>
        <TimeUnit label="Hrs" value={timeLeft.hours} />
        <div className="text-white/20 pt-4 font-black">:</div>
        <TimeUnit label="Min" value={timeLeft.minutes} />
        <div className="text-white/20 pt-4 font-black">:</div>
        <TimeUnit label="Sec" value={timeLeft.seconds} />
      </div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ onSearch, onAskAI }) => {
  const scrollToDirectory = () => {
    const element = document.getElementById('directory');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="absolute inset-0 gradient-bg z-[-1] opacity-90"></div>
      
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-bounce duration-[10s]"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center text-white">
          <div className="max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Stay Ahead of Every <br />
              <span className="text-emerald-400">University Update</span>
            </h1>
            <p className="text-lg md:text-2xl text-blue-100 mb-10 font-medium">
              Powered by Artificial Intelligence to keep students and candidates informed in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                onClick={scrollToDirectory}
                className="w-full sm:w-auto px-10 py-5 bg-white text-blue-700 rounded-3xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <Search size={18} />
                Find Your Portal
              </button>
              <button 
                onClick={onAskAI}
                className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:scale-105 transition-all border-2 border-emerald-400/50 flex items-center justify-center gap-3"
              >
                <Brain size={18} />
                Ask CampusAI
              </button>
            </div>

            {/* Live Countdown Integrated Here */}
            <CountdownTimer />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-black/30 backdrop-blur-md py-3 text-white">
        <div className="container mx-auto px-4 flex items-center overflow-hidden">
          <div className="bg-red-500 text-[10px] font-black px-2 py-1 rounded mr-4 shrink-0 uppercase tracking-widest">
            Live
          </div>
          <div className="ticker-wrap flex-1">
            <div className="ticker-content flex items-center gap-8">
              {TICKER_HEADLINES.map((headline, i) => (
                <div key={i} className="flex items-center gap-2 text-xs md:text-sm font-bold whitespace-nowrap">
                  <span className="text-emerald-400">•</span> {headline}
                </div>
              ))}
              {TICKER_HEADLINES.map((headline, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-2 text-xs md:text-sm font-bold whitespace-nowrap">
                  <span className="text-emerald-400">•</span> {headline}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
