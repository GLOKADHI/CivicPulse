import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, User, Bot, Loader2, Info, Sparkles, ArrowUpRight, ChevronRight, Zap, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAssistant } from '../services/gemini';
import { analyzeSentiment } from '../services/nlp';
import { logElectionQuery } from '../services/firestore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { UserRole } from '../constants/election';
import { Message } from '../types';
import { useSettings } from '../context/SettingsContext';

interface AIChatProps {
  role?: UserRole;
  messages: Message[];
  onSendMessage: (content: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function AIChat({ role = 'voter', messages, onSendMessage, setMessages }: AIChatProps) {
  const { t } = useSettings();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingNotice, setProcessingNotice] = useState(false);

  const suggestions = useMemo(() => {
    const defaultSuggestions = {
      voter: [
        "How do I verify registration?",
        "Where is my nearest polling site?",
        "How to research candidates?",
        "Timeline for results"
      ],
      candidate: [
        "Filing deadline information",
        "Campaign integrity rules",
        "Community mobilization",
        "Financial transparency guidelines"
      ],
      volunteer: [
        "Training certification",
        "Polling equipment support",
        "Volunteer scheduling",
        "Assistance and support"
      ]
    };
    return defaultSuggestions[role] || defaultSuggestions.voter;
  }, [role]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || loading) return;

    // Prevent duplicate user messages if they happen rapidly
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage && lastUserMessage.content === textToSend && !messageText) return;

    if (!messageText) setInput('');
    onSendMessage(textToSend);
    setLoading(true);
    setProcessingNotice(false);

    const slowTimer = setTimeout(() => {
      setProcessingNotice(true);
    }, 3000);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setProcessingNotice(false);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(),
        role: 'model', 
        content: "Neural link slow. Please refine your query or try again.",
        timestamp: Date.now(),
        type: 'alert'
      }]);
    }, 15000); // 15s timeout

    try {
      // Analyze Sentiment (Google Cloud NLP)
      const sentiment = await analyzeSentiment(textToSend);
      
      // Log to Firestore
      logElectionQuery(user?.uid, textToSend, sentiment);

      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const response = await chatWithAssistant(textToSend, history);
      clearTimeout(timeoutId);
      clearTimeout(slowTimer);
      setProcessingNotice(false);
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'model' && lastMsg.content === response) return prev;
        
        return [...prev, { 
          id: Date.now().toString() + Math.random(),
          role: 'model', 
          content: response || "I've processed your request, but I'm having trouble formulating a specific response. How else can I assist?",
          timestamp: Date.now(),
          type: 'standard'
        }];
      });
    } catch (err) {
      clearTimeout(timeoutId);
      clearTimeout(slowTimer);
      setProcessingNotice(false);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(),
        role: 'model', 
        content: "Identity node connection issue. Please check your network and try again.",
        timestamp: Date.now(),
        type: 'alert'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black/20 selection:bg-gold/30">
      <div className="p-[2rem] border-b border-white/5 bg-white/5 flex items-center justify-between backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-[1.25rem]">
          <div className="w-[3.5rem] h-[3.5rem] rounded-[1rem] active-step flex items-center justify-center text-white shadow-[0_0_1.875rem_rgba(212,175,55,0.3)] border border-gold/30">
            <Sparkles size={28} className="fill-current" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[0.6875rem] font-black text-gold uppercase tracking-[0.4em] truncate">{t('civicPulseIntel')}</h2>
            <p className="text-[0.5625rem] text-slate-500 font-black uppercase tracking-[0.3em] mt-[0.375rem] opacity-60 truncate">
               {t('guidanceMode')}: <span className="text-gold/80">{role.toUpperCase()} CONTEXT</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex items-center gap-[0.75rem] px-[1.25rem] py-[0.5rem] glass text-emerald-400 rounded-full text-[0.625rem] font-black tracking-[0.3em] border border-emerald-500/20 uppercase shadow-lg shadow-emerald-500/5 shrink-0">
              <Activity size={12} className="animate-pulse" />
              {t('realTimeSync')}
           </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-[2rem] space-y-[2rem] scroll-smooth"
      >
        {messages.map((m, idx) => (
          <motion.div
            key={m.id || idx}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn(
              "flex gap-[1.25rem] max-w-[90%] min-w-0",
              m.role === 'user' ? "ml-auto flex-row-reverse text-right" : "mr-auto text-left"
            )}
          >
            <div className={cn(
              "w-[2.5rem] h-[2.5rem] rounded-[1rem] flex items-center justify-center shrink-0 shadow-2xl border transition-all",
              m.role === 'user' ? "active-step border-gold/40 text-white" : 
              m.type === 'guidance' ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
              m.type === 'alert' ? "bg-red-500/10 border-red-500/30 text-red-400" :
              "gold-glass text-gold border-gold/20"
            )}>
              {m.role === 'user' ? <User size={18} /> : m.type === 'guidance' ? <Target size={18} /> : <Bot size={18} />}
            </div>
            <div className="flex flex-col gap-[0.5rem] min-w-0">
              <div className={cn(
                "p-[1.5rem] rounded-[2rem] text-[0.875rem] font-medium leading-relaxed shadow-2xl transition-all break-words",
                m.role === 'user' 
                  ? "bg-gold/10 text-slate-100 rounded-tr-none border border-gold/20" 
                  : "glass text-slate-300 border border-white/10 rounded-tl-none backdrop-blur-md",
                m.type === 'guidance' && "border-blue-500/20 bg-blue-500/5",
                m.type === 'alert' && "border-red-500/20 bg-red-500/5"
              )}>
                {m.content}
              </div>
              <div className="flex items-center gap-2">
                 <p className="text-[0.5rem] font-black text-slate-700 uppercase tracking-widest truncate">
                    {m.role === 'user' ? t('directInput') : m.type === 'guidance' ? t('sysInstruction') : t('aiAnalysis')}
                 </p>
                 <div className="w-1 h-1 rounded-full bg-slate-800" />
                 <p className="text-[0.5rem] font-bold text-slate-800 uppercase tabular-nums">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-[1.25rem] mr-auto max-w-[80%] animate-pulse">
            <div className="w-[2.5rem] h-[2.5rem] rounded-[1rem] gold-glass border border-gold/20 flex items-center justify-center text-gold shrink-0">
              <Loader2 size={18} className="animate-spin text-gold" />
            </div>
            <div className="p-[1.5rem] rounded-[2rem] rounded-tl-none text-[0.7rem] font-black glass border border-white/10 text-gold flex items-center gap-[0.75rem] tracking-[0.2em] shadow-2xl">
              {processingNotice ? t('processing') : t('synthesizing')}
            </div>
          </div>
        )}
      </div>

      <div className="p-[2rem] bg-black/40 border-t border-white/5 backdrop-blur-3xl shrink-0">
        {/* Suggested Queries - Like YouTube Related Suggestions */}
        {!loading && (
          <div className="mb-[1.5rem] min-w-0">
            <div className="flex items-center gap-[0.75rem] mb-[1rem] opacity-50">
               <ArrowUpRight size={12} className="text-gold" />
               <span className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.4em]">{t('suggestedQuestions')}</span>
            </div>
            <div className="flex flex-wrap gap-[0.75rem]">
               {suggestions.map((q, i) => (
                 <button
                   key={i}
                   onClick={() => handleSend(q)}
                   className="px-[1rem] py-[0.625rem] rounded-full gold-glass border border-gold/10 text-[0.6875rem] font-bold text-slate-300 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all flex items-center gap-[0.625rem] group"
                 >
                   {q}
                   <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gold" />
                 </button>
               ))}
            </div>
          </div>
        )}

        <form 
          aria-label="Election Assistant Chat"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="relative group"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('askQuestion')}
            className="w-full glass border border-white/10 rounded-[1.75rem] pl-[2rem] pr-[4rem] py-[1.5rem] text-[0.875rem] font-medium text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold/40 focus:gold-glow transition-all shadow-inner"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 w-[3.5rem] h-[3.5rem] flex items-center justify-center active-step text-white rounded-[1rem] hover:scale-110 disabled:opacity-30 transition-all shadow-2xl border border-gold/30 gold-glow"
          >
            <Send size={24} />
          </button>
        </form>
        <div className="mt-[1.5rem] flex items-center justify-center gap-[0.75rem] opacity-30">
          <div className="text-gold">
            <Info size={12} />
          </div>
          <p className="text-[0.5625rem] text-slate-500 text-center uppercase tracking-[0.4em] font-black leading-none">
            {t('secureSession')}
          </p>
        </div>
      </div>
    </div>
  );
}
