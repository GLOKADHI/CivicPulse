import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  Database, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  BarChart 
} from 'lucide-react';
import SummaryReport from './SummaryReport';

interface VolunteerClosingSimProps {
  onComplete: (data?: any) => void;
  onReset?: () => void;
  volunteerData?: any;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

export default function VolunteerClosingSim({ onComplete, onReset, volunteerData, addAssistantMessage }: VolunteerClosingSimProps) {
  const [stage, setStage] = useState<'idle' | 'sealing' | 'transmitting' | 'final'>('idle');

  const runClosing = () => {
    setStage('sealing');
    if (addAssistantMessage) {
        addAssistantMessage("Polls are officially closed. Initiating the cryptographic sealing of all physical and digital ballots at your station.");
    }
    setTimeout(() => {
        setStage('transmitting');
        if (addAssistantMessage) {
            addAssistantMessage("Sealing complete. Now transmitting the distributed ledger update to the regional tally node. This ensures zero data tampering.");
        }
        setTimeout(() => {
            setStage('final');
            if (addAssistantMessage) {
                addAssistantMessage("Transmissions verified. Your station is now officially shut down. Thank you for maintaining electoral integrity!", 'success');
            }
        }, 3000);
    }, 2500);
  };

  return (
    <div className="w-full max-w-[40rem] mx-auto">
      {stage === 'idle' && (
        <div className="glass rounded-[2rem] p-[3rem] border-white/5 text-center space-y-6">
           <div className="w-[5rem] h-[5rem] rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
              <Lock size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-[1.25rem] font-black text-white uppercase tracking-tighter">Initialize Shutdown</h3>
              <p className="text-[0.75rem] text-slate-500 font-medium max-w-[20rem] mx-auto">
                Voting hours have ended. Initiate the secure closing sequence to seal the physical and digital tally.
              </p>
           </div>
           <button 
             onClick={runClosing}
             className="w-full py-4 rounded-[1.5rem] bg-red-500 text-white text-[0.75rem] font-black uppercase tracking-[0.2em] shadow-[0_1rem_2rem_rgba(239,44,44,0.2)] hover:scale-105 transition-all"
           >
              Seal Node & Transmit Tally
           </button>
        </div>
      )}

      {(stage === 'sealing' || stage === 'transmitting') && (
        <div className="glass rounded-[2rem] p-[3rem] border-white/5 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 {stage === 'sealing' ? (
                   <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <Lock size={20} className="animate-pulse" />
                   </div>
                 ) : (
                   <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Database size={20} className="animate-pulse" />
                   </div>
                 )}
                 <div>
                    <h4 className="text-[0.75rem] font-black text-white uppercase tracking-widest">
                       {stage === 'sealing' ? 'Sealing Ballot Bins' : 'Syncing Distributed Ledger'}
                    </h4>
                    <p className="text-[0.5rem] text-slate-500 font-bold uppercase tracking-[0.3em]">Integrity Protocol 2.4.9</p>
                 </div>
              </div>
              <span className="text-[0.625rem] font-black text-gold animate-pulse uppercase">Active</span>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">
                 <span>Progress</span>
                 <span>{stage === 'sealing' ? '45%' : '88%'}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: stage === 'sealing' ? '45%' : '88%' }}
                   className={stage === 'sealing' ? "h-full bg-gold shadow-[0_0_1rem_rgba(212,175,55,0.4)]" : "h-full bg-blue-500 shadow-[0_0_1rem_rgba(59,130,246,0.4)]"}
                 />
              </div>
           </div>

           <div className="p-4 bg-white/2 rounded-[1rem] border border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Hash Verification</span>
              </div>
              <p className="text-[0.5625rem] text-slate-700 font-mono break-all opacity-50">
                0x7f4a2d8b1c9e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9
              </p>
           </div>
        </div>
      )}

      {stage === 'final' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[2rem] p-[3rem] border-gold/30 space-y-8 text-center"
        >
           <div className="w-[5rem] h-[5rem] rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20">
              <CheckCircle2 size={32} />
           </div>
           <div className="space-y-4">
              <h3 className="text-[1.5rem] font-black text-white uppercase tracking-tighter leading-none">Mission Accomplished</h3>
              <div className="flex items-center justify-center gap-2">
                 <div className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[0.5rem] font-black uppercase tracking-widest border border-gold/20">
                   {volunteerData?.stationId || 'NODE_A'}
                 </div>
                 <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[0.5rem] font-black uppercase tracking-widest border border-blue-500/20">
                   {volunteerData?.totalProcessed || 0} Voters Processed
                 </div>
              </div>
           </div>

           <div className="bg-white/5 border border-white/5 rounded-[1.5rem] p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="text-left space-y-1">
                    <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Chain Parity</span>
                    <p className="text-[0.75rem] font-black text-emerald-400">100.0% Exact</p>
                 </div>
                 <div className="text-left space-y-1">
                    <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Audit ID</span>
                    <p className="text-[0.75rem] font-black text-slate-100 uppercase">TX-990-21</p>
                 </div>
              </div>
              <div className="h-[1px] bg-white/5" />
              <div className="flex items-center gap-4 text-left">
                 <div className="w-10 h-10 rounded-[1rem] bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <BarChart size={20} />
                 </div>
                 <div>
                    <h5 className="text-[0.625rem] font-black text-white uppercase tracking-widest">Final Ledger Sync</h5>
                    <p className="text-[0.5625rem] text-slate-500 font-medium leading-relaxed">All ballots have been cryptographically sealed and transmitted to the Regional Audit Center.</p>
                 </div>
              </div>
           </div>

           <div className="bg-gold/5 border border-gold/10 p-4 rounded-[1.25rem] flex items-center gap-3 text-left">
              <Zap size={16} className="text-gold" />
              <p className="text-[0.5625rem] text-slate-300 font-medium">
                Thank you for your service. Your contributions have ensured a transparent democratic process.
              </p>
           </div>

           <SummaryReport 
              role="volunteer"
              title="Poll Worker Service Audit"
              subtitle="Station ID: NODE_A_2026"
              data={{
                processedVoters: volunteerData?.totalProcessed || 0,
                stationId: volunteerData?.stationId || 'NODE_A',
                timestamp: new Date().toISOString()
              }}
           />

           <button 
             onClick={() => {
               if (onReset) onReset();
               else onComplete();
             }}
             className="w-full py-4 rounded-[1.5rem] bg-white text-black text-[0.75rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 relative z-[70]"
           >
              Exit Console <ArrowRight size={14} />
           </button>
        </motion.div>
      )}
    </div>
  );
}
