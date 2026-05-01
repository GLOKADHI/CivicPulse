import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  Briefcase,
  Terminal,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

interface VolunteerAssignmentSimProps {
  onComplete: (data: any) => void;
  volunteerData?: any;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

export default function VolunteerAssignmentSim({ onComplete, volunteerData, addAssistantMessage }: VolunteerAssignmentSimProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [approved, setApproved] = useState<boolean | null>(null);

  const results = volunteerData?.quizResults;
  const isEligible = results?.eligibility === 'Eligible';
  const needsTraining = results?.eligibility === 'Needs Training';

  const handleProcess = () => {
    setIsProcessing(true);
    if (addAssistantMessage) {
        addAssistantMessage("Running deployment readiness audit. I'm cross-referencing your certification ID with regional station requirements.");
    }
    setTimeout(() => {
      setIsProcessing(false);
      setApproved(isEligible);
      
      if (addAssistantMessage) {
        if (isEligible) {
            addAssistantMessage("Audit finalized: Access Granted. You've been assigned to the Neural Audit Node based on your high accuracy score.", 'success');
        } else {
            addAssistantMessage("Audit finalized: Access Deferred. Your performance profile requires additional training before node deployment.", 'alert');
        }
      }
    }, 2500);
  };

  const handleStartDuty = () => {
    onComplete({ 
        stationId: 'ST-AI-01', 
        stationName: 'Neural Audit Node', 
        shift: 'Current Cycle',
        shiftTime: 'Real-time',
        role: results?.percentage >= 90 ? 'Election Lead' : 'Booth Assistant'
    });
    if (addAssistantMessage) {
        addAssistantMessage("Opening Polling Console. You are now authorized to begin live voter verification and queue management.", 'success');
    }
  };

  return (
    <div className="w-full max-w-[40rem] mx-auto space-y-[2rem]">
      {/* Header ID Card */}
      <div className="glass rounded-[2rem] p-[2rem] border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-[3.5rem] h-[3.5rem] rounded-[1.25rem] bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
               <Shield size={24} />
            </div>
            <div>
               <p className="text-[0.5rem] text-slate-500 font-black uppercase tracking-[0.4em]">Official Delegate</p>
               <h3 className="text-[1.125rem] font-black text-white uppercase tracking-tighter">
                  ID: {volunteerData?.volunteerId || 'PENDING'}
               </h3>
            </div>
         </div>
         <div className={cn(
           "px-4 py-1.5 rounded-full border text-[0.5625rem] font-black uppercase tracking-widest",
           isEligible ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
           needsTraining ? "bg-gold/10 border-gold/20 text-gold" : "bg-red-500/10 border-red-500/20 text-red-400"
         )}>
            {results?.eligibility || 'Awaiting Review'}
         </div>
      </div>

      {!isProcessing && approved === null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] p-[3rem] border-white/5 text-center space-y-6"
        >
           <div className="w-[4rem] h-[4rem] rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto border border-blue-500/20">
              <Cpu size={24} className="animate-spin-slow" />
           </div>
           <div className="space-y-2">
              <h3 className="text-[1.25rem] font-black text-white uppercase tracking-tighter">Initiate AI Readiness Audit</h3>
              <p className="text-[0.75rem] text-slate-500 font-medium max-w-[20rem] mx-auto">
                The Central Election Authority must now audit your training metadata to determine operational clearance.
              </p>
           </div>
           <button 
             onClick={handleProcess}
             className="w-full py-4 rounded-[1.5rem] bg-white text-black text-[0.75rem] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
           >
              Run Eligibility Protocol
           </button>
        </motion.div>
      )}

      {isProcessing && (
        <div className="glass rounded-[2rem] p-[3rem] border-white/5 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Terminal size={20} className="animate-pulse" />
                 </div>
                 <div>
                    <h4 className="text-[0.75rem] font-black text-white uppercase tracking-widest">Auditing Identity Tiers</h4>
                    <p className="text-[0.5rem] text-slate-500 font-bold uppercase tracking-[0.3em]">Processing Metadata...</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[0.625rem] font-black text-blue-400 uppercase tracking-widest">Active</span>
              </div>
           </div>

           <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                 {[1, 2, 3].map(i => (
                   <motion.div 
                     key={i}
                     animate={{ opacity: [0.2, 1, 0.2] }}
                     transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                     className="h-1 rounded-full bg-blue-500/30"
                   />
                 ))}
              </div>
              <p className="text-[0.5rem] text-slate-700 font-mono text-center uppercase tracking-[0.5em]">Evaluating integrity metrics</p>
           </div>
        </div>
      )}

      {approved === true && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
           <div className="glass rounded-[2rem] p-8 border-emerald-500/30 space-y-6">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_2rem_rgba(16,185,129,0.1)]">
                    <CheckCircle2 size={40} />
                 </div>
                 <div>
                    <span className="text-[0.5rem] font-black text-emerald-500/60 uppercase tracking-[0.4em]">Audit Status</span>
                    <h3 className="text-[1.5rem] font-black text-white uppercase tracking-tighter">Approved</h3>
                    <p className="text-[0.625rem] text-slate-400 font-medium">Ready for node deployment in the 2026 cycle.</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-[1.25rem] bg-white/2 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-slate-500">
                       <Briefcase size={14} />
                       <span className="text-[0.5rem] font-black uppercase tracking-widest">Assigned Role</span>
                    </div>
                    <p className="text-[0.75rem] font-black text-white uppercase">{results?.percentage >= 90 ? 'Election Lead' : 'Booth Assistant'}</p>
                 </div>
                 <div className="p-4 rounded-[1.25rem] bg-white/2 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-slate-500">
                       <Zap size={14} />
                       <span className="text-[0.5rem] font-black uppercase tracking-widest">Trust Rating</span>
                    </div>
                    <p className="text-[0.75rem] font-black text-emerald-400 uppercase">Tier 1 Elite</p>
                 </div>
              </div>

              <div className="p-5 rounded-[1.25rem] bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                 <Zap size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                 <p className="text-[0.625rem] text-slate-300 font-medium italic leading-relaxed">
                   "Voter integrity scores indicate high operational reliability. Candidate is cleared for all regional polling modules."
                 </p>
              </div>
           </div>

           <button
             onClick={handleStartDuty}
             className="w-full py-5 rounded-[2rem] bg-white text-black text-[0.75rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
           >
              Open Polling Console
              <ArrowRight size={18} />
           </button>
        </motion.div>
      )}

      {approved === false && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[2rem] p-8 border-red-500/30 text-center space-y-6"
        >
           <div className="w-[4rem] h-[4rem] rounded-[1.5rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
              <XCircle size={24} />
           </div>
           <div className="space-y-2">
              <h3 className="text-[1.25rem] font-black text-white uppercase tracking-tighter">Audit Failed</h3>
              <p className="text-[0.75rem] text-slate-500 font-medium max-w-[20rem] mx-auto">
                 {needsTraining 
                  ? "Your training score (60-79%) requires a mandatory review cycle before station deployment."
                  : "Security clearance denied due to critical knowledge gaps in electoral ethics."}
              </p>
           </div>
           
           <div className="p-5 rounded-[1.25rem] bg-red-500/5 border border-red-500/10 flex items-start gap-4 text-left">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[0.625rem] text-slate-300 font-medium italic leading-relaxed">
                 {needsTraining 
                  ? "AI Recommendation: Re-run Ethics and Decision-making modules to reach the 80% threshold."
                  : "Access Terminated. Please contact regional supervisors for manual verification."}
              </p>
           </div>

           {needsTraining && (
             <button
               onClick={() => window.location.reload()}
               className="w-full py-4 rounded-[1.5rem] bg-white text-black text-[0.75rem] font-black uppercase tracking-[0.2em]"
             >
                Return to Training
             </button>
           )}
        </motion.div>
      )}
    </div>
  );
}
