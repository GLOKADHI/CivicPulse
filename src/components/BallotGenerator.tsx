import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileDown, 
  CheckCircle2, 
  ShieldCheck, 
  Ticket, 
  AlertCircle,
  FileCheck,
  Layout
} from 'lucide-react';
import { cn } from '../lib/utils';

interface BallotGeneratorProps {
  registrationData?: {
    fullName: string;
    dob: string;
    address: string;
    idNumber: string;
  } | null;
  onComplete?: (data?: any) => void;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

export default function BallotGenerator({ registrationData, onComplete, addAssistantMessage }: BallotGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [electionId, setElectionId] = useState('');

  useEffect(() => {
    // Generate a unique election ID
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const id = `BALLOT-${randomSuffix}`;
    setElectionId(id);
    if (addAssistantMessage) {
        addAssistantMessage(`Identity confirmed. Your unique election session ID is ${id}. I'm ready to activate your digital polling pass.`);
    }
  }, [addAssistantMessage]);

  const handlePreparation = async () => {
    if (!registrationData) return;
    setIsGenerating(true);
    if (addAssistantMessage) addAssistantMessage("Activating your participant node. This links your encrypted identity to the election ledger.");

    // Artificial delay for realism (simulating node synchronization)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    setIsGenerated(true);
    if (addAssistantMessage) addAssistantMessage("Polling pass activated! You are now cleared to participate in the local election simulation.", 'success');

    // Pass election meta to parent flow
    setTimeout(() => {
      if (onComplete) {
        onComplete({
          electionId,
          ballotReady: true
        });
      }
    }, 2000);
  };

  if (!registrationData) {
    return (
      <div className="glass rounded-[2rem] border-white/5 bg-white/2 p-[2rem] flex flex-col items-center text-center gap-[1.5rem]">
         <div className="w-[3rem] h-[3rem] rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertCircle size={24} />
         </div>
         <div>
            <h5 className="text-[0.875rem] font-black text-slate-100 uppercase tracking-widest mb-2">No Registration Found</h5>
            <p className="text-[0.625rem] text-slate-500 font-medium">Please complete Voter Registration and Identity Verification first.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-[2rem] border-white/5 bg-white/2 p-[2rem] space-y-[2rem]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1rem]">
          <div className="w-[2.5rem] h-[2.5rem] rounded-[1rem] bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Ticket size={20} />
          </div>
          <div>
            <h4 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-widest">Polling Pass Activator</h4>
            <p className="text-[0.5625rem] text-slate-500 font-bold uppercase tracking-widest mt-[0.125rem]">Final Readiness Phase</p>
          </div>
        </div>
        <div className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-full bg-emerald-500/5 border border-emerald-500/20">
           <span className="text-[0.5rem] font-black text-emerald-500 uppercase tracking-widest">{electionId}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isGenerated ? (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-[1.75rem]"
          >
            <div className="p-[1.5rem] rounded-[2rem] bg-white/5 border border-white/10 space-y-[1rem]">
               <h5 className="text-[0.625rem] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" /> Security Clearance Granted
               </h5>
               <p className="text-[0.6875rem] text-slate-400 leading-relaxed font-medium italic">
                 "Your node has been fully authenticated. We are now ready to activate your digital polling pass for election day."
               </p>
            </div>

            <div className="grid grid-cols-2 gap-[1rem]">
               <div className="p-[1.25rem] rounded-[1.5rem] bg-white/2 border border-white/5 space-y-[0.5rem]">
                  <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Verified Owner</span>
                  <p className="text-[0.75rem] font-bold text-slate-200">{registrationData.fullName}</p>
               </div>
               <div className="p-[1.25rem] rounded-[1.5rem] bg-white/2 border border-white/5 space-y-[0.5rem]">
                  <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Election Token</span>
                  <p className="text-[0.75rem] font-mono text-gold">{electionId}</p>
               </div>
            </div>

            <button 
              onClick={handlePreparation}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-[1rem] py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] gold-glow transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                 <>
                   <div className="w-[1rem] h-[1rem] border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   Activating Node...
                 </>
              ) : (
                 <>
                   <Layout size={18} />
                   Activate Polling Pass
                 </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-[2.5rem] rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center gap-[1.5rem]"
          >
             <div className="w-[4rem] h-[4rem] rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-[0_0_2rem_rgba(16,185,129,0.1)]">
                <FileCheck size={32} />
             </div>
             
             <div>
                <h5 className="text-[1rem] font-black text-emerald-400 uppercase tracking-[0.2em] mb-[0.5rem]">Polling Node Active</h5>
                <p className="text-[0.6875rem] text-slate-400 leading-relaxed font-medium">
                  Your official digital presence is now synchronized with the district hub. <br />
                  <span className="text-gold font-bold">Prepare for Ballot Injection in the next phase.</span>
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
