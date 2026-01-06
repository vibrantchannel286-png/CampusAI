
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Calculator, BookOpen, Star, AlertCircle, RefreshCw, ChevronRight, Zap, Target, Search, Check, Info, GraduationCap, Loader2, Sparkles, MessageSquare, Send, X, User, Brain, History as HistoryIcon, Trash2, Save as SaveIcon, ShieldCheck, ExternalLink, HelpCircle, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OLevelGrade } from '../types';
import universityData from '../universities';
import { getCourseCutoffInfo, getUniversityCourses, sendMessageToGemini } from '../services/geminiService';

const GRADE_POINTS: Record<OLevelGrade, number> = {
  'A1': 10, 'B2': 9, 'B3': 8, 'C4': 7, 'C5': 6, 'C6': 5, 'D7': 0, 'E8': 0, 'F9': 0
};

const POPULAR_COURSES_FALLBACK = [
  "Medicine and Surgery", "Nursing Science", "Pharmacy", "Law", "Computer Science", 
  "Metallurgical and Materials Engineering", "Mechanical Engineering", "Civil Engineering", 
  "Accounting", "Business Administration", "Economics", "Mass Communication"
];

const SCHOOL_MODELS: Record<string, 'Standard' | 'Unilag' | 'PostUtmeHeavy'> = {
  'unilag': 'Unilag',
  'futa': 'Unilag',
  'ui': 'PostUtmeHeavy',
  'oau': 'PostUtmeHeavy',
  'uniben': 'PostUtmeHeavy',
  'lasu': 'Standard',
};

interface CalculationHistoryItem {
  id: string;
  uniName: string;
  course: string;
  aggregate: string;
  status: string;
  date: string;
}

interface AICutoffResult {
  cutoff: string;
  subjectCombination: string;
  recommendation: string;
  reliability: string;
}

const CutoffCalculator: React.FC = () => {
  const [jambScore, setJambScore] = useState<string>('');
  const [postUtmeScore, setPostUtmeScore] = useState<string>('');
  const [targetUni, setTargetUni] = useState<typeof universityData[0] | null>(null);
  const [targetCourse, setTargetCourse] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingCourse, setIsSearchingCourse] = useState(false);
  const [uniSearch, setUniSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  
  // History State
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // AI Course & Cutoff State
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [isFetchingCourses, setIsFetchingCourses] = useState(false);
  const [aiCutoffData, setAiCutoffData] = useState<AICutoffResult | null>(null);
  const [isFetchingCutoff, setIsFetchingCutoff] = useState(false);
  const [showCutoffOverlay, setShowCutoffOverlay] = useState(false);

  // Mini Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [subjects, setSubjects] = useState<{name: string, grade: OLevelGrade}[]>([
    { name: 'English Language', grade: 'C6' },
    { name: 'Mathematics', grade: 'C6' },
    { name: 'Core Subject 1', grade: 'C6' },
    { name: 'Core Subject 2', grade: 'C6' },
    { name: 'Core Subject 3', grade: 'C6' },
  ]);

  // Load History
  useEffect(() => {
    const savedHistory = localStorage.getItem('campusai_calc_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Fetch courses when university changes
  useEffect(() => {
    if (targetUni) {
      const fetchCourses = async () => {
        setIsFetchingCourses(true);
        setAvailableCourses([]);
        setTargetCourse('');
        setCourseSearch('');
        try {
          const courses = await getUniversityCourses(targetUni.name);
          if (courses && courses.length > 0) {
            setAvailableCourses(courses);
          } else {
            setAvailableCourses(POPULAR_COURSES_FALLBACK);
          }
        } catch (e) {
          setAvailableCourses(POPULAR_COURSES_FALLBACK);
        } finally {
          setIsFetchingCourses(false);
        }
      };
      fetchCourses();
    }
  }, [targetUni]);

  const filteredUnis = useMemo(() => {
    if (!uniSearch) return universityData.slice(0, 5);
    return universityData.filter(u => 
      u.name.toLowerCase().includes(uniSearch.toLowerCase()) || 
      u.slug?.toLowerCase().includes(uniSearch.toLowerCase())
    ).slice(0, 5);
  }, [uniSearch]);

  const filteredCourses = useMemo(() => {
    const combined = Array.from(new Set([...availableCourses, ...POPULAR_COURSES_FALLBACK]));
    if (!courseSearch) return combined.slice(0, 15);
    return combined.filter(c => c.toLowerCase().includes(courseSearch.toLowerCase())).slice(0, 15);
  }, [courseSearch, availableCourses]);

  const updateGrade = (index: number, grade: OLevelGrade) => {
    const newSubjects = [...subjects];
    newSubjects[index].grade = grade;
    setSubjects(newSubjects);
  };

  const results = useMemo(() => {
    const jScore = parseFloat(jambScore) || 0;
    const pScore = parseFloat(postUtmeScore) || 0;
    const model = targetUni ? (SCHOOL_MODELS[targetUni.slug || ''] || 'Standard') : 'Standard';

    let jambComponent = 0;
    let oLevelComponent = 0;
    let postUtmeComponent = 0;
    let methodDesc = "";

    if (model === 'Unilag') {
      jambComponent = (jScore / 400) * 50;
      oLevelComponent = (subjects.reduce((sum, s) => sum + GRADE_POINTS[s.grade], 0) / 50) * 20;
      postUtmeComponent = (pScore / 100) * 30;
      methodDesc = "UNILAG/FUTA Model (50:20:30)";
    } else if (model === 'PostUtmeHeavy') {
      jambComponent = (jScore / 400) * 50;
      oLevelComponent = 0; 
      postUtmeComponent = (pScore / 100) * 50;
      methodDesc = "UI/OAU Model (50:50)";
    } else {
      jambComponent = (jScore / 400) * 50;
      oLevelComponent = subjects.reduce((sum, s) => sum + GRADE_POINTS[s.grade], 0);
      postUtmeComponent = 0;
      methodDesc = "Standard Model (50:50)";
    }
    
    const total = jambComponent + oLevelComponent + postUtmeComponent;
    
    let status = 'Not Eligible';
    let color = 'text-red-500';
    let bgColor = 'bg-red-500';
    
    if (total >= 80) { status = 'Exceptional'; color = 'text-emerald-500'; bgColor = 'bg-emerald-500'; }
    else if (total >= 70) { status = 'Highly Competitive'; color = 'text-cyan-500'; bgColor = 'bg-cyan-500'; }
    else if (total >= 60) { status = 'Good Standing'; color = 'text-blue-500'; bgColor = 'bg-blue-500'; }
    else if (total >= 50) { status = 'Average'; color = 'text-yellow-500'; bgColor = 'bg-yellow-500'; }
    
    return { jambComponent, oLevelComponent, postUtmeComponent, total: total.toFixed(2), status, color, bgColor, methodDesc, model };
  }, [jambScore, postUtmeScore, subjects, targetUni]);

  const saveToHistory = () => {
    if (!targetUni || (!targetCourse && !courseSearch) || parseFloat(results.total) === 0) return;
    
    const newItem: CalculationHistoryItem = {
      id: Date.now().toString(),
      uniName: targetUni.name,
      course: targetCourse || courseSearch,
      aggregate: results.total,
      status: results.status,
      date: new Date().toLocaleDateString()
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('campusai_calc_history', JSON.stringify(updatedHistory));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('campusai_calc_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('campusai_calc_history');
  };

  const handleFetchCutoff = async () => {
    const courseToFetch = targetCourse || courseSearch;
    if (!targetUni || !courseToFetch) return;
    
    setIsFetchingCutoff(true);
    setAiCutoffData(null);
    try {
      const data = await getCourseCutoffInfo(targetUni.name, courseToFetch);
      if (data) {
        setAiCutoffData(data);
        setShowCutoffOverlay(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingCutoff(false);
    }
  };

  const handleStartChat = (initialText?: string) => {
    setShowChat(true);
    setShowCutoffOverlay(false);
    
    let baseText = `Hi! I see your aggregate for ${targetCourse || 'your course'} at ${targetUni?.name || 'this school'} is ${results.total}%.`;
    if (aiCutoffData) {
      baseText += ` The merit cutoff is ${aiCutoffData.cutoff}. How can I help you analyze your chances?`;
    } else {
      baseText += ` What would you like to know about your chances?`;
    }

    if (chatMessages.length === 0) {
      setChatMessages([{ role: 'model', text: baseText }]);
    }

    if (initialText) {
      handleChatSend(initialText);
    }
  };

  const handleChatSend = async (textOverride?: string) => {
    const textToSend = textOverride || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg = { role: 'user' as const, text: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setQuickInput('');
    setIsChatLoading(true);

    const context = `Calculation Context:
    University: ${targetUni?.name || 'General'}
    Course: ${targetCourse || courseSearch}
    Aggregate Score: ${results.total}%
    JAMB: ${jambScore}, Post-UTME: ${postUtmeScore}
    Probability Status: ${results.status}
    ${aiCutoffData ? `Known Merit Cutoff: ${aiCutoffData.cutoff}` : ''}`;

    try {
      const result = await sendMessageToGemini(`${context}\n\nUser Question: ${userMsg.text}`, chatMessages);
      setChatMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my database. Please try again in a moment." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <section id="calculator" className="py-24 bg-white dark:bg-gray-950 transition-colors border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Input Column */}
            <div className="lg:w-1/2 space-y-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 dark:border-blue-800">
                  <Calculator size={12} />
                  Admissions Intelligence
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                  Aggregate <span className="text-blue-600 dark:text-cyan-400">Calculator</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
                  Calculate your precise composite score and identify required JAMB subjects.
                </p>
              </div>

              {/* School & Course Selector Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="space-y-3 relative">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-2">
                    <Search size={14} className="text-blue-500" /> Target University
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search school..."
                      className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 font-bold outline-none transition-all dark:text-white"
                      value={uniSearch}
                      onFocus={() => setIsSearching(true)}
                      onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                      onChange={(e) => setUniSearch(e.target.value)}
                    />
                    <AnimatePresence>
                      {isSearching && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-30 top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                          {filteredUnis.map(uni => (
                            <button key={uni.name} onMouseDown={() => { setTargetUni(uni); setUniSearch(uni.name); setIsSearching(false); }} className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between border-b border-gray-50 dark:border-gray-800 last:border-0">
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{uni.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{uni.category}</p>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-3 relative">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-2">
                    <GraduationCap size={14} className="text-cyan-500" /> {isFetchingCourses ? 'Syncing Catalog...' : 'Target Course'}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={targetUni ? (isFetchingCourses ? "Accessing data..." : "Search departments...") : "Select school first"}
                      disabled={!targetUni || isFetchingCourses}
                      className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-cyan-500 rounded-2xl p-4 font-bold outline-none transition-all dark:text-white disabled:opacity-50"
                      value={courseSearch}
                      onFocus={() => setIsSearchingCourse(true)}
                      onBlur={() => setTimeout(() => setIsSearchingCourse(false), 200)}
                      onChange={(e) => { setCourseSearch(e.target.value); setTargetCourse(e.target.value); }}
                    />
                    {isFetchingCourses && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 size={16} className="animate-spin text-cyan-500" />
                      </div>
                    )}
                    <AnimatePresence>
                      {isSearchingCourse && targetUni && !isFetchingCourses && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-30 top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                          {filteredCourses.map(course => (
                            <button key={course} onMouseDown={() => { setTargetCourse(course); setCourseSearch(course); setIsSearchingCourse(false); }} className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 last:border-0">
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{course}</p>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-500" /> UTME Score
                  </label>
                  <input type="number" max="400" placeholder="e.g. 280" className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 text-xl font-bold outline-none transition-all dark:text-white" value={jambScore} onChange={(e) => setJambScore(e.target.value)} />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-2">
                    <Target size={14} className="text-red-500" /> {targetUni?.slug === 'unilag' ? 'Post-UTME (30%)' : 'Post-UTME Score'}
                  </label>
                  <input type="number" placeholder="e.g. 70" className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-xl font-bold outline-none transition-all dark:text-white" value={postUtmeScore} onChange={(e) => setPostUtmeScore(e.target.value)} />
                </div>
              </div>

              {results.model !== 'PostUtmeHeavy' && (
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-2">
                    <BookOpen size={14} className="text-blue-500" /> O-Level Points (Top 5 Subjects)
                  </label>
                  <div className="space-y-3">
                    {subjects.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border border-transparent focus-within:border-blue-200 transition-all">
                        <div className="flex-grow font-bold text-sm text-gray-700 dark:text-gray-300 pl-3 truncate">{sub.name}</div>
                        <select value={sub.grade} onChange={(e) => updateGrade(idx, e.target.value as OLevelGrade)} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2 font-black text-xs text-blue-600 dark:text-cyan-400 outline-none cursor-pointer focus:border-blue-500">
                          {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Column */}
            <div className="lg:w-1/2 w-full sticky top-28">
              <div className="bg-gray-900 dark:bg-black rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group min-h-[550px] flex flex-col">
                <div className={`absolute top-0 right-0 w-64 h-64 ${results.bgColor} opacity-10 blur-[100px] transition-all`}></div>
                
                <AnimatePresence mode="wait">
                  {showCutoffOverlay && aiCutoffData ? (
                    <motion.div key="cutoff-result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute inset-0 z-40 bg-gray-900/95 backdrop-blur-xl p-10 flex flex-col overflow-y-auto no-scrollbar">
                      <div className="flex justify-between items-center mb-8 shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg"><Target size={20} className="text-white" /></div>
                          <div>
                            <h4 className="font-black text-sm text-white">Merit Analytics</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">2026 Cycle Forecast</p>
                          </div>
                        </div>
                        <button onClick={() => setShowCutoffOverlay(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={20} /></button>
                      </div>

                      <div className="flex flex-col items-center text-center mb-8 shrink-0">
                        <h3 className="text-6xl font-black text-white mb-2">{aiCutoffData.cutoff}</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Merit Score</p>
                      </div>

                      {/* NEW: Subject Combination Block */}
                      <div className="bg-blue-600/10 rounded-[24px] p-6 border border-blue-500/20 mb-6 shrink-0">
                        <div className="flex items-center gap-2 mb-4">
                          <ListChecks size={16} className="text-cyan-400" />
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">JAMB Subject Combination</h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {aiCutoffData.subjectCombination.split(',').map((subj, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white whitespace-nowrap">
                              {subj.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-[24px] p-6 border border-white/5 mb-8 grow">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles size={14} className="text-blue-400" />
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-400">AI Counselor Review</h5>
                        </div>
                        <p className="text-sm font-medium text-gray-200 leading-relaxed italic">"{aiCutoffData.recommendation}"</p>
                      </div>

                      <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-white/5 shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${aiCutoffData.reliability === 'High' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reliability: {aiCutoffData.reliability}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setShowCutoffOverlay(false)} className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Dismiss</button>
                          <button onClick={() => handleStartChat()} className="py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            <Brain size={14} /> Discuss with AI
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : showHistory ? (
                    <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="relative z-10 flex flex-col flex-1 h-full">
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg"><HistoryIcon size={20} className="text-white" /></div>
                          <div>
                            <h4 className="font-black text-sm text-white">Recent Calcs</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Local Session Cache</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={clearHistory} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                          <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={20} /></button>
                        </div>
                      </div>

                      <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {history.length === 0 ? (
                          <div className="text-center py-20 text-gray-500">
                            <HistoryIcon size={32} className="mx-auto mb-4 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No history yet</p>
                          </div>
                        ) : (
                          history.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                              <div className="flex-grow">
                                <h5 className="font-bold text-sm text-white">{item.course}</h5>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.uniName}</p>
                              </div>
                              <div className="text-right flex items-center gap-4">
                                <p className="font-black text-blue-400 text-lg">{item.aggregate}%</p>
                                <button onClick={() => deleteHistoryItem(item.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <button onClick={() => setShowHistory(false)} className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Back to Calculator</button>
                    </motion.div>
                  ) : !showChat ? (
                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="relative z-10 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-12">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Aggregate Score</span>
                            <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-md text-[8px] font-black uppercase tracking-widest">{results.methodDesc}</div>
                          </div>
                          <h3 className="text-7xl font-black tracking-tighter text-white">{results.total}<span className="text-2xl text-gray-600">%</span></h3>
                        </div>
                        <button onClick={() => setShowHistory(true)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"><HistoryIcon size={20} className="text-gray-400" /></button>
                      </div>

                      <div className="space-y-6 mb-12 flex-grow">
                        <div className="flex justify-between items-end"><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">JAMB</span><span className="font-black text-lg">{results.jambComponent.toFixed(1)}%</span></div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${results.jambComponent * 2}%` }} className="h-full bg-blue-500" /></div>
                        
                        {results.model !== 'PostUtmeHeavy' && (
                          <>
                            <div className="flex justify-between items-end pt-4"><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">O-Level</span><span className="font-black text-lg">{results.oLevelComponent.toFixed(1)}%</span></div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${results.oLevelComponent * (results.model === 'Unilag' ? 5 : 2)}%` }} className="h-full bg-emerald-500" /></div>
                          </>
                        )}

                        {results.postUtmeComponent > 0 && (
                          <>
                            <div className="flex justify-between items-end pt-4"><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Post-UTME</span><span className="font-black text-lg">{results.postUtmeComponent.toFixed(1)}%</span></div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${results.postUtmeComponent * (results.model === 'Unilag' ? 3.33 : 2)}%` }} className="h-full bg-red-500" /></div>
                          </>
                        )}
                        
                        <div className={`mt-8 p-5 rounded-3xl border ${results.color.replace('text', 'border')}/20 bg-white/5`}>
                          <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className={results.color} size={18} />
                            <span className={`text-xs font-black uppercase tracking-widest ${results.color}`}>{results.status} Chances</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{targetUni ? `Institutional model: ${targetUni.name}` : "General academic standard calculation."}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 mt-auto">
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={saveToHistory} disabled={isSaved || !targetUni || (!targetCourse && !courseSearch) || parseFloat(results.total) === 0} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'} disabled:opacity-50`}>{isSaved ? <><Check size={14} /> Saved</> : <><SaveIcon size={14} /> Save Results</>}</button>
                          <button onClick={handleFetchCutoff} disabled={isFetchingCutoff || !targetUni || (!targetCourse && !courseSearch)} className="flex items-center justify-center gap-2 py-4 bg-white text-gray-900 disabled:opacity-50 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">{isFetchingCutoff ? <Loader2 size={14} className="animate-spin" /> : <><Target size={14} /> Merit & Combo</>}</button>
                        </div>
                        <div className="relative pt-4 group">
                          <div className="relative">
                            <input type="text" value={quickInput} onChange={(e) => setQuickInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleStartChat(quickInput)} placeholder="Ask AI: What if my score is lower?" className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-2xl p-4 pr-12 text-xs text-white outline-none transition-all placeholder-gray-500" />
                            <button onClick={() => handleStartChat(quickInput)} className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all"><Send size={16} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="mini-chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="relative z-10 flex flex-col flex-1 h-full">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg"><Brain size={20} className="text-white" /></div>
                          <div><h4 className="font-black text-sm text-white">CampusAI Expert</h4><p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Analyzing Entry Requirements</p></div>
                        </div>
                        <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={20} /></button>
                      </div>
                      <div className="flex-grow overflow-y-auto mb-6 pr-2 custom-scrollbar space-y-4 max-h-[350px]">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'}`}>{msg.text}</div>
                            </div>
                          </div>
                        ))}
                        {isChatLoading && <div className="flex justify-start"><div className="flex gap-2 items-center bg-white/5 p-3 rounded-2xl border border-white/5"><Loader2 size={12} className="animate-spin text-blue-400" /><span className="text-[10px] text-gray-400 italic">Processing...</span></div></div>}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="relative mt-auto">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Ask for subject advice..." className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl p-4 pr-12 text-sm text-white outline-none transition-all" />
                        <button onClick={() => handleChatSend()} disabled={!chatInput.trim() || isChatLoading} className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 rounded-lg transition-all"><Send size={16} /></button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CutoffCalculator;
