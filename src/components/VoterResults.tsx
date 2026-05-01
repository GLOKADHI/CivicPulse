import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Terminal, 
  Database, 
  CheckCircle2, 
  Hash, 
  Clock, 
  RefreshCw,
  Trophy,
  History
} from 'lucide-react';
import { cn } from '../lib/utils';
import SummaryReport from './SummaryReport';

interface VoterResultsProps {
  registrationData: any;
  electionId: string;
  trackingId: string;
  onComplete?: () => void;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

export default function VoterResults({ registrationData, electionId, trackingId, onComplete, addAssistantMessage }: VoterResultsProps) {
  const [status, setStatus] = useState<'recorded' | 'syncing' | 'counted'>('recorded');
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const startSync = () => {
    setStatus('syncing');
    setProgress(0);
    if (addAssistantMessage) {
        addAssistantMessage("Broadcasting your encrypted ballot to the global synchronization layer. Final verification in progress.");
    }
    
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
            setStatus('counted');
            if (addAssistantMessage) {
                addAssistantMessage("Verification complete. Your vote has been officially recorded in the 2026 Simulation ledger.", 'success');
            }
        }, 500);
      }
      setProgress(p);
    }, 200);
  };

  const handleRestart = () => {
    if (onComplete) onComplete();
    else window.location.reload();
  };

  const handleFinishAttempt = () => {
    if (status !== 'counted') {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      if (addAssistantMessage) {
        addAssistantMessage("Wait. Synchronization is still in progress. Do not terminate the session yet.", 'alert');
      }
      return;
    }
    setIsFinished(true);
    if (addAssistantMessage) {
        addAssistantMessage("Your journey is complete. Thank you for participating in the decentralized democratic process.");
    }
  };

  return (
    <div className="glass rounded-[2rem] border-white/5 bg-white/2 p-[2rem] space-y-[2rem] relative overflow-hidden">
      {/* Header */}
      {!isFinished && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[1rem]">
            <div className="w-[2.5rem] h-[2.5rem] rounded-[1rem] bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Terminal size={20} />
            </div>
            <div>
              <h4 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-widest">Election Verification Hub</h4>
              <p className="text-[0.5625rem] text-slate-500 font-bold uppercase tracking-widest mt-[0.125rem]">Vote Confirmation Sequence</p>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div 
            key="finish"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-[2rem] py-[1rem]"
          >
             <div className="w-[5rem] h-[5rem] rounded-[2.5rem] active-step text-white flex items-center justify-center shadow-[0_0_3rem_rgba(212,175,55,0.3)]">
                <ShieldCheck size={40} />
             </div>
             
             <div>
                <h3 className="text-[1.5rem] font-black text-slate-100 uppercase tracking-tighter mb-2">Simulation Complete</h3>
                <p className="text-[0.75rem] text-slate-400 leading-relaxed font-medium">
                  Your participation in the digital election demo is recorded. <br />
                  Your vote has been securely verified for the 2026 simulation.
                </p>
             </div>

             <div className="w-full space-y-[4rem]">
                <div className="grid gap-4 w-full">
                   <h4 className="text-[0.625rem] font-black text-slate-500 uppercase tracking-widest text-left ml-2">Regional Simulation Stats</h4>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Voters', val: '1.2M', sub: '+12% vs 2021', icon: History },
                        { label: 'Digital Turnout', val: '84.2%', sub: 'High Engagement', icon: Trophy },
                        { label: 'Integrity Audit', val: '99.9%', sub: 'Verified Nodes', icon: ShieldCheck },
                        { label: 'Processing Time', val: '0.4s', sub: 'Avg per vote', icon: Clock }
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-[1.5rem] bg-white/5 border border-white/10 flex flex-col items-center text-center gap-2">
                           <stat.icon size={16} className="text-gold opacity-40" />
                           <div>
                              <p className="text-[0.875rem] font-black text-slate-100">{stat.val}</p>
                              <p className="text-[0.4rem] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">{stat.label}</p>
                           </div>
                           <p className="text-[0.35rem] font-bold text-emerald-400 uppercase tracking-widest">{stat.sub}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="w-full space-y-[0.75rem] max-w-[20rem] mx-auto">
                   <h4 className="text-[0.625rem] font-black text-slate-500 uppercase tracking-widest">Protocol Audit Checklist</h4>
                   {[
                     { label: 'Registration', status: 'COMPLETED' },
                     { label: 'Verification', status: 'VERIFIED' },
                     { label: 'Voting', status: 'SUBMITTED' },
                     { label: 'Results', status: 'RECORDED' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-[1.25rem] rounded-[1.25rem] bg-white/5 border border-white/10">
                        <span className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                        <div className="flex items-center gap-2">
                           <CheckCircle2 size={10} className="text-emerald-500" />
                           <span className="text-[0.5625rem] font-black text-emerald-400 uppercase tracking-widest">{item.status}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <SummaryReport 
                role="voter"
                title="Voter Participation Audit"
                subtitle="Journal Index: 2026-ALPHA"
                data={{
                  voterName: registrationData?.fullName,
                  electionId,
                  trackingId,
                  timestamp: new Date().toISOString()
                }}
             />

             <div className="flex gap-4 w-full">
                <button 
                  onClick={() => {
                    if (addAssistantMessage) addAssistantMessage("Generating secure Audit PDF...", 'guidance');
                    setTimeout(() => {
                      alert("Audit Report downloaded. Contains cryptographically signed voting intent.");
                      if (addAssistantMessage) addAssistantMessage("Report exported successfully.", 'success');
                    }, 1500);
                  }}
                  className="flex-1 py-[1.25rem] rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[0.75rem] font-black uppercase tracking-[0.3em] hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Database size={16} />
                  Export Audit
                </button>
                <button 
                  onClick={handleRestart}
                  className="flex-1 py-[1.25rem] rounded-[1.5rem] border border-white/10 text-slate-500 text-[0.75rem] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                >
                  Reset Demo
                </button>
             </div>
          </motion.div>
        ) : (
          <div className="space-y-[2rem]">
            <div className="min-h-[200px] flex items-center justify-center">
                {status === 'recorded' && (
                  <motion.div 
                    key="recorded"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full space-y-[1.5rem]"
                  >
                     <div className="p-[2rem] rounded-[2.5rem] border border-white/5 bg-white/2 flex flex-col items-center text-center gap-[1.25rem]">
                        <div className="w-[4rem] h-[4rem] rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <Database size={32} />
                        </div>
                        <div>
                            <h5 className="text-[1rem] font-black text-slate-100 uppercase tracking-widest">Vote Ready to Send</h5>
                            <p className="text-[0.625rem] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Status: Encrypted Locally</p>
                        </div>
                     </div>
                     <button 
                       onClick={startSync}
                       className="w-full py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] gold-glow transition-all"
                     >
                        Verify & Submit Vote
                     </button>
                  </motion.div>
                )}

                {status === 'syncing' && (
                   <motion.div 
                    key="syncing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-[2rem] gap-[2rem] w-full"
                   >
                     <div className="relative">
                        <RefreshCw size={48} className="text-gold animate-spin" />
                        <div className="absolute inset-0 w-[4rem] h-[4rem] border-2 border-gold/20 border-t-gold rounded-full animate-pulse -translate-x-1.5 -translate-y-1.5" />
                     </div>
                     <div className="text-center space-y-[1.5rem] w-full max-w-[20rem]">
                        <h5 className="text-[0.75rem] font-black text-slate-200 uppercase tracking-widest">Submitting Encrypted Ballot...</h5>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gold"
                            />
                        </div>
                        <p className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest animate-pulse">Establishing Secure Connection...</p>
                     </div>
                   </motion.div>
                )}

                {status === 'counted' && (
                   <motion.div 
                    key="counted"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-[1.5rem] w-full"
                   >
                      <div className="p-[2.5rem] rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center gap-[1.5rem]">
                          <div className="w-[3.5rem] h-[3.5rem] rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                              <CheckCircle2 size={24} />
                          </div>
                          <div>
                              <h5 className="text-[1.25rem] font-black text-emerald-400 uppercase tracking-widest mb-1">Receipt Verified</h5>
                              <p className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Your ballot has been successfully recorded</p>
                          </div>
                      </div>
                   </motion.div>
                )}
            </div>

            <div className="space-y-[1.25rem] pt-[1.5rem] border-t border-white/5">
                <div className="flex items-center justify-between opacity-60">
                   <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Election Token</span>
                   <span className="text-[0.625rem] font-mono text-slate-300">{electionId}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Auth Tracking ID</span>
                   <span className="text-[0.625rem] font-mono text-gold">{trackingId}</span>
                </div>
                
                <div className="relative">
                   <button 
                     onClick={handleFinishAttempt}
                     className="w-full py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] gold-glow transition-all"
                   >
                     Complete Journey
                   </button>
                   
                   <AnimatePresence>
                     {showMessage && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="absolute -top-[3.5rem] left-0 right-0 p-[0.75rem] bg-black/80 backdrop-blur-xl border border-white/10 rounded-[1rem] text-center"
                       >
                          <p className="text-[0.625rem] font-black text-gold uppercase tracking-widest flex items-center justify-center gap-2">
                             <Clock size={12} className="animate-spin" />
                             Wait for server verification...
                          </p>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {!isFinished && (
        <div className="pt-[1rem] border-t border-white/5 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-slate-600" />
              <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Encrypted Local Persistence active</span>
            </div>
        </div>
      )}
    </div>
  );
}
