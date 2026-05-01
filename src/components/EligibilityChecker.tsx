import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, XCircle, CheckCircle2, User, MapPin, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export default function EligibilityChecker() {
  const [age, setAge] = useState<string>('');
  const [citizenship, setCitizenship] = useState<boolean | null>(null);
  const [result, setResult] = useState<'eligible' | 'not-eligible' | null>(null);

  const checkEligibility = () => {
    const ageNum = parseInt(age);
    if (ageNum >= 18 && citizenship === true) {
      setResult('eligible');
    } else {
      setResult('not-eligible');
    }
  };

  return (
    <div className="glass rounded-[2rem] border-white/5 bg-white/2 p-[2rem] space-y-[2rem]">
      <div className="flex items-center gap-[1rem]">
        <div className="w-[2.5rem] h-[2.5rem] rounded-[1rem] bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-widest">Eligibility Engine</h4>
          <p className="text-[0.5625rem] text-slate-500 font-bold uppercase tracking-widest mt-[0.125rem]">Real-time Validation Simulator</p>
        </div>
      </div>

      <div className="space-y-[1.5rem]">
        <div className="space-y-[0.75rem]">
          <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem]">Your Age</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-[1.25rem] top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Min. 18 years"
              className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] py-[1rem] pl-[3rem] pr-[1.25rem] text-[0.875rem] text-slate-100 focus:border-gold/40 outline-none transition-all placeholder:text-slate-700"
            />
          </div>
        </div>

        <div className="space-y-[0.75rem]">
          <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem]">Citizenship Status</label>
          <div className="grid grid-cols-2 gap-[1rem]">
            <button 
              onClick={() => setCitizenship(true)}
              className={cn(
                "py-[1rem] rounded-[1.25rem] text-[0.6875rem] font-black uppercase tracking-widest border transition-all",
                citizenship === true ? "active-step border-gold/40 text-black shadow-lg" : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
              )}
            >
              Citizen
            </button>
            <button 
              onClick={() => setCitizenship(false)}
              className={cn(
                "py-[1rem] rounded-[1.25rem] text-[0.6875rem] font-black uppercase tracking-widest border transition-all",
                citizenship === false ? "bg-red-500/20 border-red-500/40 text-red-400 shadow-lg" : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
              )}
            >
              Non-Citizen
            </button>
          </div>
        </div>

        <button 
          onClick={checkEligibility}
          disabled={!age || citizenship === null}
          className="w-full py-[1.25rem] rounded-[1.5rem] bg-gold/10 border border-gold/20 text-gold text-[0.75rem] font-black uppercase tracking-[0.3em] hover:bg-gold/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-[1rem]"
        >
          Check Eligibility
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-[1.5rem] rounded-[1.5rem] border flex items-center gap-[1.25rem]",
              result === 'eligible' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
            )}
          >
            {result === 'eligible' ? (
              <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
            ) : (
              <XCircle size={24} className="text-red-500 shrink-0" />
            )}
            <div>
              <h5 className={cn(
                "text-[0.75rem] font-black uppercase tracking-widest",
                result === 'eligible' ? "text-emerald-400" : "text-red-400"
              )}>
                {result === 'eligible' ? 'Eligible to Register' : 'Ineligible'}
              </h5>
              <p className="text-[0.625rem] text-slate-400 font-medium mt-[0.25rem]">
                {result === 'eligible' 
                  ? 'Your parameters meet the national baseline. Proceed to next step.' 
                  : 'You must be a citizen and 18+ to participate in this operational cycle.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
