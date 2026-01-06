
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Brain, ArrowLeft, Sparkles, Loader2, ExternalLink, MapPin, Globe, Camera, ImagePlus, X, Key, AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini, analyzeMultimodalMessage } from '../services/geminiService';
import { ChatMessage, GroundingChunk } from '../types';

interface ChatInterfaceProps {
  onBack: () => void;
  initialPrompt?: string;
  onClearPrompt?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack, initialPrompt, onClearPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Welcome to the 2026 Pro Admissions Hub! I am CampusAI Pro. I can analyze documents, search for real-time merit data, and explain university news. How can I help you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialTriggered = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle Automatic News Discussion
  useEffect(() => {
    if (initialPrompt && !initialTriggered.current) {
      initialTriggered.current = true;
      handleAutoSend(initialPrompt);
      if (onClearPrompt) onClearPrompt();
    }
  }, [initialPrompt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoSend = async (text: string) => {
    const userMessage: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await sendMessageToGemini(text, messages.map(m => ({ role: m.role, text: m.text })));
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text || "I'm processing that news update for you now.",
        groundingChunks: result.groundingChunks
      }]);
    } catch (error: any) {
      const errorMsg = error.message === 'API_KEY_MISSING' 
        ? "CampusAI Pro is offline. Your API Key is not configured correctly in the environment."
        : "Connection error while analyzing news. Please check your internet and try again.";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: ChatMessage = { 
      role: 'user', 
      text: input || (selectedImage ? "Analyze this document for me." : ""),
      image: selectedImage ? `data:${selectedImage.mimeType};base64,${selectedImage.data}` : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const historyForService = messages.map(m => ({ role: m.role, text: m.text }));
      
      let result;
      if (currentImage) {
        result = await analyzeMultimodalMessage(
          currentInput || "Analyze this document for me.", 
          currentImage, 
          historyForService
        );
      } else {
        result = await sendMessageToGemini(currentInput, historyForService);
      }
      
      const aiMessage: ChatMessage = { 
        role: 'model', 
        text: result.text || "I'm sorry, I couldn't process that. Please try again.",
        groundingChunks: result.groundingChunks
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      let friendlyError = "Service error. Please ensure your cloud connection is active.";
      
      if (error.message === 'API_KEY_MISSING') {
        friendlyError = "Critical Error: Gemini API Key is missing. Ensure you set the API_KEY environment variable when running the app.";
      } else if (error.toString().includes('401') || error.toString().includes('403')) {
        friendlyError = "Authentication failed. The provided API Key is invalid or expired.";
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: friendlyError 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSources = (chunks?: GroundingChunk[]) => {
    if (!chunks || chunks.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
          <Sparkles size={10} className="text-blue-500" />
          Verified Sources
        </p>
        <div className="flex flex-wrap gap-2">
          {chunks.map((chunk, i) => {
            const isMap = !!chunk.maps;
            const data = chunk.maps || chunk.web;
            if (!data) return null;

            return (
              <a 
                key={i}
                href={data.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-200 transition-all group"
              >
                {isMap ? <MapPin size={12} className="text-red-500" /> : <Globe size={12} className="text-blue-500" />}
                <span className="max-w-[150px] truncate">{data.title || (isMap ? "View on Maps" : "Visit Website")}</span>
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
      {/* Header */}
      <div className="px-6 py-4 bg-blue-600 dark:bg-blue-800 text-white flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Brain size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">CampusAI Pro</h2>
              <div className="flex items-center text-[10px] font-bold text-cyan-300 dark:text-cyan-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-1.5 animate-pulse"></span>
                Intelligent Assistant Active
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-tighter">
          <Camera size={12} className="text-yellow-400" />
          <span>News & Document Analysis</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-cyan-400'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Brain size={16} />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                }`}>
                  {msg.image && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-white/20">
                      <img src={msg.image} alt="User document" className="w-full max-h-60 object-cover" />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  {msg.role === 'model' && renderSources(msg.groundingChunks)}
                  
                  {msg.role === 'model' && msg.text.includes("Critical Error") && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-[10px] font-black uppercase text-red-500 mb-2">Troubleshooting Hint:</p>
                      <p className="text-[10px] text-gray-500 italic">If you are running locally via CMD, use: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">set API_KEY=your_key</code> before <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm run dev</code>.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 items-center ml-11 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <Loader2 size={16} className="animate-spin text-blue-600 dark:text-cyan-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 italic">
                  {messages[messages.length-1]?.text?.includes('news') ? "Analyzing portal update..." : "CampusAI Pro is thinking..."}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 relative"
            >
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-xl">
                <img 
                  src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Document Ready for Scanner</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative group flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 w-14 h-14 bg-gray-50 dark:bg-gray-900 border-2 border-transparent hover:border-blue-500 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all shadow-inner"
            title="Upload Document Photo"
          >
            <ImagePlus size={24} />
          </button>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedImage ? "Add a caption or ask a question..." : "Ask or upload a result slip..."}
            className="flex-grow bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-900 p-4 pr-16 rounded-2xl outline-none transition-all shadow-inner text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600"
          />
          
          <button 
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="shrink-0 bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white w-14 h-14 rounded-2xl transition-all flex items-center justify-center shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            <Send size={24} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-4 font-medium uppercase tracking-widest">
          Always-On AI Hub • Instant Institutional Updates
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
