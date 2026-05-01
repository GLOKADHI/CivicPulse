import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  Scan, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  XCircle, 
  MessageSquare,
  History,
  Zap,
  MoreVertical,
  Activity,
  UserPlus,
  Cpu,
  Terminal
} from 'lucide-react';
import { cn } from '../lib/utils';

import { generateIndianName } from '../lib/names';

interface VolunteerLiveBoothSimProps {
  onComplete: (data: any) => void;
  volunteerData?: any;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

interface VoterSession {
  id: string;
  name: string;
  type: 'standard' | 'issue-mismatch' | 'issue-duplicate' | 'issue-notfound';
  voterId: string;
  riskMetadata: {
    faceMatch: number; // 0-100
    registrySync: boolean;
    previousAttempts: number;
    flagged?: string;
  };
}

const MOCK_VOTERS: VoterSession[] = [
  { 
    id: '1', name: generateIndianName(), type: 'standard', voterId: 'ID-8821',
    riskMetadata: { faceMatch: 98, registrySync: true, previousAttempts: 0 }
  },
  { 
    id: '2', name: generateIndianName(), type: 'issue-mismatch', voterId: 'ID-9002',
    riskMetadata: { faceMatch: 42, registrySync: true, previousAttempts: 0, flagged: 'Facial Geometry Mismatch' }
  },
  { 
    id: '3', name: generateIndianName(), type: 'standard', voterId: 'ID-3312',
    riskMetadata: { faceMatch: 95, registrySync: true, previousAttempts: 0 }
  },
  { 
    id: '4', name: generateIndianName(), type: 'issue-notfound', voterId: 'N/A',
    riskMetadata: { faceMatch: 0, registrySync: false, previousAttempts: 1, flagged: 'Node Disconnect' }
  },
  { 
    id: '5', name: generateIndianName(), type: 'issue-duplicate', voterId: 'ID-1105',
    riskMetadata: { faceMatch: 99, registrySync: true, previousAttempts: 2, flagged: 'Double-Entry Alert' }
  }
];

interface AIRecommendation {
  suggestion: 'allow' | 'deny' | 'escalate';
  confidence: number;
  riskScore: number;
  reason: string;
}

export default function VolunteerLiveBoothSim({ onComplete, volunteerData, addAssistantMessage }: VolunteerLiveBoothSimProps) {
  const [processedCount, setProcessedCount] = useState(0);
  const [currentVoter, setCurrentVoter] = useState<VoterSession | null>(null);
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [logs, setLogs] = useState<{ msg: string; time: string; type: 'success' | 'alert' | 'audit' }[]>([]);
  const [resolution, setResolution] = useState<'pending' | 'resolved' | 'escalated' | 'denied'>('pending');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [queueSize, setQueueSize] = useState(12);

  const calculateAIRecommendation = (voter: VoterSession): AIRecommendation => {
    let riskScore = 0;
    let confidence = 95;

    if (voter.riskMetadata.faceMatch < 50) riskScore += 60;
    if (!voter.riskMetadata.registrySync) riskScore += 40;
    if (voter.riskMetadata.previousAttempts > 0) riskScore += 30;

    riskScore = Math.min(100, riskScore + (100 - voter.riskMetadata.faceMatch) * 0.2);

    if (riskScore < 20) {
      return { suggestion: 'allow', confidence: 99, riskScore, reason: "Biometric and registry parity confirmed." };
    } else if (riskScore < 50) {
      return { suggestion: 'escalate', confidence: 82, riskScore, reason: "Moderate biometric variance. Manual audit recommended." };
    } else {
      return { suggestion: 'deny', confidence: 91, riskScore, reason: voter.riskMetadata.flagged || "Critical integrity breach detected." };
    }
  };

  const callNextVoter = () => {
    const next = MOCK_VOTERS[processedCount % MOCK_VOTERS.length];
    setCurrentVoter(next);
    setAiThinking(true);
    setAiRec(null);
    setResolution('pending');
    setAiFeedback(null);
    setQueueSize(prev => Math.max(0, prev - 1));
    addLog(`Voter arriving: ${next.name}`, 'success');

    setTimeout(() => {
      const rec = calculateAIRecommendation(next);
      setAiRec(rec);
      setAiThinking(false);

      if (addAssistantMessage) {
        if (rec.suggestion === 'allow') {
          addAssistantMessage(`Identity verification complete for ${next.name}. System suggests ACCEPT with ${rec.confidence}% confidence. Risk score is negligible (${Math.round(rec.riskScore)}/100).`);
        } else {
          addAssistantMessage(`Caution: Potential risk detected for ${next.name}. System suggests ${rec.suggestion.toUpperCase()} due to ${rec.reason}. Score: ${Math.round(rec.riskScore)}/100.`, 'alert');
        }
      }
    }, 1200);
  };

  const addLog = (msg: string, type: 'success' | 'alert' | 'audit' = 'success') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ msg, time, type }, ...prev].slice(0, 5));
  };

  const handleAction = (action: 'allow' | 'deny' | 'escalate') => {
    if (!currentVoter || !aiRec) return;

    const conflict = action !== aiRec.suggestion;
    if (conflict) {
      addLog(`AUDIT: User overruled AI recommendation (${aiRec.suggestion.toUpperCase()})`, 'audit');
      if (addAssistantMessage) {
        addAssistantMessage(`Protocol conflict detected. You chose ${action.toUpperCase()} instead of the suggested ${aiRec.suggestion.toUpperCase()}. Reason: ${aiRec.reason}. Tracking for supervisor review.`, 'guidance');
      }
    } else {
      if (addAssistantMessage) {
        addAssistantMessage(`Correct. Your choice aligns with system integrity and AI confidence.`, 'success');
      }
    }

    if (action === 'allow') {
      if (currentVoter.type === 'standard') {
        setResolution('resolved');
        setProcessedCount(prev => prev + 1);
        addLog(`Voter ${currentVoter.name} cleared. Ballot issued.`, 'success');
        setAiFeedback("Correct action. Voter credentials match regional node records.");
      } else {
        setResolution('denied');
        addLog(`ERROR: Unauthorized entry allowed. Integrity breach logged!`, 'alert');
        setAiFeedback(`Incorrect action. This was a ${currentVoter.type.replace('issue-', '')} case. This compromises audit parity.`);
      }
    } else if (action === 'deny') {
      if (currentVoter.type !== 'standard') {
        setResolution('resolved');
        setProcessedCount(prev => prev + 1);
        addLog(`Denied invalid access for ${currentVoter.name}.`, 'success');
        setAiFeedback("Correct action. Integrity preserved by blocking non-compliant ID.");
      } else {
        setResolution('denied');
        addLog(`Warning: Valid voter denied access. Civil rights alert!`, 'alert');
        setAiFeedback("Error. This voter was valid. Unjust denial leads to legal friction.");
      }
    } else if (action === 'escalate') {
      setResolution('escalated');
      setProcessedCount(prev => prev + 1);
      addLog(`Case for ${currentVoter.name} sent to Regional Supervisor.`, 'success');
      setAiFeedback("Safe action for complex edge cases. Supervisor oversight initiated.");
    }
  };

  const finishSession = () => {
     if (processedCount >= 5) {
        onComplete({ totalProcessed: processedCount });
     } else {
        setCurrentVoter(null);
     }
  };

  return (
    <div className="w-full max-w-[48rem] mx-auto space-y-6">
      {/* Simulation Header */}
      <div className="grid grid-cols-3 gap-4">
         <div className="glass p-4 rounded-[1.5rem] border-white/5 space-y-1">
            <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Processed</span>
            <div className="flex items-center gap-2">
               <span className="text-[1.25rem] font-black text-white">{processedCount}</span>
               <UserCheck size={14} className="text-emerald-500" />
            </div>
         </div>
         <div className="glass p-4 rounded-[1.5rem] border-white/5 space-y-1">
            <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Queue</span>
            <div className="flex items-center gap-2">
               <span className="text-[1.25rem] font-black text-gold">{queueSize}</span>
               <Users size={14} className="text-gold" />
            </div>
         </div>
         <div className="glass p-4 rounded-[1.5rem] border-white/5 justify-between flex flex-col">
            <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Status</span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[0.625rem] font-black text-white uppercase tracking-widest">Active Hub</span>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
         {/* Main Terminal */}
         <div className="glass rounded-[2rem] border-white/5 min-h-[30rem] flex flex-col overflow-hidden bg-black/40 shadow-2xl interaction-ready">
            <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-gold" />
                  <span className="text-[0.625rem] font-black text-slate-300 uppercase tracking-[0.2em]">Booth Console</span>
               </div>
               <div className="flex items-center gap-3">
                 <span className="text-[0.5rem] font-bold text-slate-600 uppercase font-mono">NODE_{volunteerData?.stationId || 'A1'}</span>
                 <button 
                   onClick={() => onComplete({ totalProcessed: processedCount })}
                   className="p-1 hover:text-red-400 transition-colors"
                   title="Emergency Exit"
                 >
                   <XCircle size={14} />
                 </button>
               </div>
            </div>

            <div className="flex-1 p-[2rem] flex flex-col items-center justify-center text-center">
               <AnimatePresence mode="wait">
                  {!currentVoter ? (
                    <motion.div 
                      key="no-voter"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                       <div className="w-[5rem] h-[5rem] rounded-full bg-white/2 border border-white/5 flex items-center justify-center text-slate-700 mx-auto">
                          <UserPlus size={32} />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-[0.875rem] font-black text-slate-400 uppercase tracking-widest">Awaiting Next Voter</h4>
                          <p className="text-[0.625rem] text-slate-600 uppercase tracking-widest">Ready for decentralized identity validation</p>
                       </div>
                       <button 
                         onClick={callNextVoter}
                         className="px-[2rem] py-[1rem] rounded-full bg-white text-black text-[0.625rem] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:scale-105 transition-all"
                       >
                          Call Next <Scan size={14} />
                       </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="active-voter"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="w-full space-y-6"
                    >
                       <div className="flex items-center justify-between mb-8">
                          <div className="text-left">
                             <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-[0.4em]">Current Subject</span>
                             <h4 className="text-[1.25rem] font-black text-white uppercase">{currentVoter.name}</h4>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[0.5rem] font-black uppercase border",
                            currentVoter.type === 'standard' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                          )}>
                            ID: {currentVoter.voterId}
                          </div>
                       </div>

                       <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Scan size={14} className="text-gold" />
                                <span className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest">Scanning Bio-Signal...</span>
                             </div>
                             <span className="text-[0.5rem] font-black text-emerald-400 uppercase">Parity Found</span>
                          </div>
                          {currentVoter.type !== 'standard' && (
                             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-[1rem] flex items-start gap-3 text-left">
                                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                <p className="text-[0.625rem] text-red-100/70 font-medium leading-relaxed uppercase tracking-wider">
                                   Alert: {currentVoter.type === 'issue-mismatch' ? 'Visual ID mismatch detected' : 
                                           currentVoter.type === 'issue-duplicate' ? 'Already processed in Sector B' : 
                                           'Record not found in distributed ledger'}
                                </p>
                             </div>
                          )}
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <button 
                            disabled={resolution !== 'pending' || aiThinking}
                            onClick={() => handleAction('allow')}
                            className="py-4 rounded-[1.5rem] bg-emerald-500 text-black text-[0.5625rem] font-black uppercase tracking-[0.2em] shadow-[0_4px_12px_rgba(16,185,129,0.2)] disabled:opacity-20"
                          >
                             Accept Access
                          </button>
                          <button 
                            disabled={resolution !== 'pending' || aiThinking}
                            onClick={() => handleAction('deny')}
                            className="py-4 rounded-[1.5rem] bg-red-500 text-white text-[0.5625rem] font-black uppercase tracking-[0.2em] shadow-[0_4px_12px_rgba(239,44,44,0.2)] disabled:opacity-20"
                          >
                             Reject Access
                          </button>
                          <button 
                            disabled={resolution !== 'pending' || aiThinking}
                            onClick={() => handleAction('escalate')}
                            className="col-span-2 py-3 rounded-[1.5rem] bg-white/10 text-white text-[0.5625rem] font-black uppercase tracking-[0.2em] border border-white/5 disabled:opacity-20 translate-y-2"
                          >
                             Escalate Case
                          </button>
                       </div>

                       {resolution !== 'pending' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="pt-8"
                          >
                             <button
                               onClick={finishSession}
                               className="w-full py-4 rounded-[1.5rem] bg-gold text-black text-[0.625rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                             >
                               {processedCount >= 5 ? 'Finalize Shift' : 'Next Entry'} <ArrowRight size={14} />
                             </button>
                          </motion.div>
                       )}
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>

         {/* Side Info & Logs */}
         <div className="space-y-6">
            <AnimatePresence mode="wait">
               {currentVoter && aiThinking ? (
                 <motion.div
                   key="thinking"
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                   className="glass p-6 rounded-[2rem] border-gold/30 bg-gold/5 flex flex-col items-center justify-center gap-4 min-h-[15rem]"
                 >
                    <div className="w-[3rem] h-[3rem] rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
                    <p className="text-[0.625rem] font-black text-gold uppercase tracking-widest animate-pulse">Running Neural Audit...</p>
                 </motion.div>
               ) : currentVoter && aiRec && resolution === 'pending' ? (
                 <motion.div 
                   key="ai-assistant"
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                   className="glass p-6 rounded-[2rem] border-blue-500/30 bg-blue-500/5 space-y-6"
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Cpu size={16} className="text-blue-400 animate-pulse" />
                          <span className="text-[0.625rem] font-black text-blue-100 uppercase tracking-widest">AI Decision Support</span>
                       </div>
                       <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                          <span className="text-[0.5rem] font-black text-blue-400 uppercase tracking-widest">{aiRec.confidence}% Confidence</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Aggregated Risk Score</span>
                          <span className={cn(
                            "text-[0.625rem] font-black uppercase",
                            aiRec.riskScore < 30 ? "text-emerald-400" : aiRec.riskScore < 60 ? "text-gold" : "text-red-400"
                          )}>{Math.round(aiRec.riskScore)}/100</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${aiRec.riskScore}%` }}
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              aiRec.riskScore < 30 ? "bg-emerald-500" : aiRec.riskScore < 60 ? "bg-gold" : "bg-red-500"
                            )}
                          />
                       </div>
                    </div>

                    <div className="p-4 rounded-[1.5rem] bg-black/20 border border-white/5 space-y-2">
                       <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className={aiRec.suggestion === 'allow' ? "text-emerald-400" : aiRec.suggestion === 'deny' ? "text-red-400" : "text-gold"} />
                          <span className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest">Recommendation</span>
                       </div>
                       <p className="text-[0.75rem] font-black text-white uppercase tracking-tight">
                         Suggested Action: {aiRec.suggestion}
                       </p>
                    </div>

                    <div className="flex items-start gap-3">
                       <Terminal size={14} className="text-blue-400 shrink-0 mt-0.5" />
                       <p className="text-[0.625rem] text-slate-300 font-medium italic leading-relaxed uppercase tracking-wider">
                          "{aiRec.reason}"
                       </p>
                    </div>
                 </motion.div>
               ) : aiFeedback ? (
                 <motion.div 
                   key="ai-feedback"
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                   className="p-6 rounded-[2rem] bg-gold/5 border border-gold/20 space-y-3"
                 >
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-gold" />
                       <span className="text-[0.625rem] font-black text-slate-100 uppercase tracking-widest">Protocol Intelligence</span>
                    </div>
                    <p className="text-[0.6875rem] text-slate-400 font-medium italic leading-relaxed">
                       "{aiFeedback}"
                    </p>
                 </motion.div>
               ) : null}
            </AnimatePresence>

            <div className="glass rounded-[2rem] border-white/5 overflow-hidden flex flex-col">
               <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History size={14} className="text-slate-600" />
                    <span className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-widest">Audit Logs</span>
                  </div>
                  <MoreVertical size={12} className="text-slate-700" />
               </div>
               <div className="flex-1 p-4 space-y-4">
                  {logs.length === 0 && <p className="text-center py-10 text-[0.5rem] text-slate-800 uppercase tracking-widest">No activity</p>}
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4"
                    >
                       <span className="text-[0.5rem] font-mono text-slate-700 shrink-0 mt-1">{log.time}</span>
                       <div className="space-y-0.5">
                          <p className={cn(
                            "text-[0.625rem] font-bold tracking-tight",
                            log.type === 'alert' ? "text-red-400" : log.type === 'audit' ? "text-blue-400 font-bold italic" : "text-slate-300"
                          )}>{log.msg}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-white/2 border border-white/5 space-y-4">
               <div className="flex items-center gap-2 text-emerald-500/40">
                  <ShieldCheck size={16} />
                  <span className="text-[0.5625rem] font-black uppercase tracking-widest">Operating Integrity</span>
               </div>
               <p className="text-[0.5625rem] text-slate-600 leading-relaxed font-bold uppercase tracking-widest">
                  Simulation Active: Your actions affect parity scores. Standard operating distance 1.5m required.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
