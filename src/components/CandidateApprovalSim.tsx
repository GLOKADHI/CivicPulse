import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Zap, Trophy, Globe } from 'lucide-react';

interface CandidateApprovalSimProps {
  onComplete: () => void;
  candidateData?: any;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

export default function CandidateApprovalSim({ onComplete, candidateData, addAssistantMessage }: CandidateApprovalSimProps) {
  React.useEffect(() => {
    if (addAssistantMessage) {
      addAssistantMessage(`Congratulations ${candidateData?.fullName || 'Candidate'}! You've passed the judicial screening. Your candidacy is official. To complete the simulation, you must now register as a voter.`, 'success');
    }
  }, [addAssistantMessage, candidateData?.fullName]);

  return (
    <div className="w-full max-w-[40rem] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[2.5rem] p-[3rem] border-gold/20 shadow-2xl space-y-[2.5rem] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[0.25rem] bg-gold" />
        
        <div className="text-center space-y-[1.5rem]">
          <div className="w-[5rem] h-[5rem] rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto border border-gold/20 shadow-[0_0_2rem_rgba(212,175,55,0.2)]">
            <Trophy size={32} />
          </div>
          <div className="space-y-[0.5rem]">
            <h3 className="text-[1.5rem] font-black text-white uppercase tracking-tighter">Candidacy Certified</h3>
            <p className="text-[0.625rem] text-gold font-bold uppercase tracking-[0.3em]">Candidacy Approval Protocol Locked</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-[2rem] border border-white/5 p-[2rem] space-y-[1.5rem]">
           <p className="text-[0.75rem] text-slate-400 leading-relaxed text-center font-medium">
             Congratulations, <span className="text-white font-black">{candidateData?.fullName || 'Citizen'}</span>. Your background audit, financial disclosures, and public record screenings have been successfully verified. You are now officially certified to appear on the municipal ballot.
           </p>
           
           <div className="grid grid-cols-2 gap-[1rem]">
              <div className="p-[1rem] bg-black/40 rounded-[1.25rem] border border-white/5 flex flex-col items-center">
                 <Globe size={16} className="text-gold mb-[0.5rem]" />
                 <span className="text-[0.5rem] text-slate-500 uppercase tracking-widest font-black">Region</span>
                 <span className="text-[0.625rem] text-white font-bold uppercase">Ward 7</span>
              </div>
              <div className="p-[1rem] bg-black/40 rounded-[1.25rem] border border-white/5 flex flex-col items-center">
                 <ShieldCheck size={16} className="text-gold mb-[0.5rem]" />
                 <span className="text-[0.5rem] text-slate-500 uppercase tracking-widest font-black">Integrity</span>
                 <span className="text-[0.625rem] text-white font-bold uppercase">100% Core</span>
              </div>
           </div>
        </div>

        <div className="space-y-[1rem]">
           <div className="flex items-center gap-[1rem] p-[1rem] rounded-[1.25rem] bg-blue-500/5 border border-blue-500/10">
              <Zap size={16} className="text-blue-400 shrink-0" />
              <p className="text-[0.5625rem] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Next Requirement: All candidates must be registered voters in their district.
              </p>
           </div>
           
           <button 
             onClick={onComplete}
             className="w-full py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.2em] shadow-[0_1rem_2.5rem_rgba(212,175,55,0.2)] flex items-center justify-center gap-[1rem] hover:scale-[1.02] transition-all"
           >
             Completion: Transition to Voter Journey <ArrowRight size={18} />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
