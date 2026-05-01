import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ScanLine, 
  Signature, 
  CheckSquare, 
  ArrowRight, 
  Play, 
  Eye, 
  ShieldCheck, 
  ClipboardCheck,
  RefreshCw,
  Zap,
  Bot
} from 'lucide-react';
import { cn } from '../lib/utils';

type SimStep = 'check-in' | 'ballot' | 'voting' | 'deposit';

interface PollingBoothSimProps {
  onComplete?: (data?: any) => void;
  electionId?: string;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

const CANDIDATES = [
  { id: 'c1', name: 'Progress India Party', candidate: 'Rajesh Khanna', icon: '🏢' },
  { id: 'c2', name: 'Lok Shakti Alliance', candidate: 'Sunita Sharma', icon: '🤝' },
  { id: 'c3', name: 'Green Earth Front', candidate: 'Amit Deshmukh', icon: '🌿' },
  { id: 'c4', name: 'Independent Citizen', candidate: 'Priya Iyer', icon: '🗳️' }
];

export default function PollingBoothSim({ onComplete, electionId, addAssistantMessage }: PollingBoothSimProps) {
  const [currentStep, setCurrentStep] = useState<SimStep>('check-in');
  const [completed, setCompleted] = useState<SimStep[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const steps: { id: SimStep; title: string; description: string; icon: any; action: string }[] = [
    { 
      id: 'check-in', 
      title: 'Voter Check-in', 
      description: 'Present your identity credentials and verify your registration with the official poll worker.',
      icon: Signature,
      action: 'Verify Credentials'
    },
    { 
      id: 'ballot', 
      title: 'Receive Ballot', 
      description: 'Once verified, your voting access is activated. Your secure ballot is retrieved for your session.',
      icon: ClipboardCheck,
      action: 'Get Ballot'
    },
    { 
      id: 'voting', 
      title: 'Inside the Booth', 
      description: 'Make your choice on the secure ballot. Take your time to review before finalizing your selection.',
      icon: ScanLine,
      action: 'Cast Vote'
    },
    { 
      id: 'deposit', 
      title: 'Confirmation', 
      description: 'Finalize your choice. Your vote is securely recorded and included in the election tally.',
      icon: CheckSquare,
      action: 'Finalize Vote'
    }
  ];

  const handleNext = () => {
    if (isVerifying) return;
    if (currentStep === 'voting' && !selectedCandidateId) {
      if (addAssistantMessage) {
        addAssistantMessage("Please select a candidate to proceed. Your vote remains private within the encrypted terminal.", 'alert');
      }
      return;
    }

    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    setIsVerifying(true);
    if (addAssistantMessage) {
      if (currentStep === 'check-in') addAssistantMessage("Verifying your identity against the distributed registry. Hand over your digital ID.");
      if (currentStep === 'ballot') addAssistantMessage("Authenticating ballot access. The system is generating a unique cryptographic session for you.");
      if (currentStep === 'voting') addAssistantMessage("Encoding your selection. We're using sub-atomic encryption for maximum privacy.");
      if (currentStep === 'deposit') addAssistantMessage("Submitting your vote to the decentralized ledger. Almost there.");
    }
    
    // Simulate system processing
    setTimeout(() => {
      setCompleted(prev => [...new Set([...prev, currentStep])]);
      setIsVerifying(false);
      
      if (currentIndex < steps.length - 1) {
        const nextId = steps[currentIndex + 1].id;
        setCurrentStep(nextId);
        
        if (addAssistantMessage) {
            if (nextId === 'ballot') addAssistantMessage("Verified! Your ballot is now accessible. Please collect it from the virtual terminal.", 'success');
            if (nextId === 'voting') addAssistantMessage("You are now in the private voting booth. Choose wisely—your vote is your voice.", 'guidance');
            if (nextId === 'deposit') addAssistantMessage("Selection recorded. Review your choice one last time before finalizing.", 'guidance');
        }
      }
    }, 1500);
  };

  const handleFinish = () => {
    const trackingId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    if (addAssistantMessage) {
        addAssistantMessage(`Vote successfully deposited. Your tracking ID is ${trackingId}. Keep it for verification purposes.`, 'success');
    }
    if (onComplete) onComplete({ trackingId });
  };

  const reset = () => {
    setCurrentStep('check-in');
    setCompleted([]);
  };

  const currentStepData = steps.find(s => s.id === currentStep)!;

  return (
    <div className="flex flex-col h-full bg-black/20 selection:bg-gold/30 rounded-[3rem] overflow-hidden border border-white/5">
      <div className="p-[2.5rem] border-b border-white/5 bg-white/5 backdrop-blur-3xl shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-[1.875rem] font-black text-slate-100 uppercase tracking-tighter leading-none">Polling Experience</h2>
          <p className="text-gold text-[0.5rem] font-black mt-[0.5rem] uppercase tracking-[0.4em] opacity-60 italic">Interactive Voting Simulation</p>
        </div>
        {electionId && (
          <div className="px-[1rem] py-[0.5rem] rounded-full bg-gold/10 border border-gold/20 flex items-center gap-[0.5rem]">
             <Zap size={10} className="text-gold" />
             <span className="text-[0.5rem] font-black text-gold uppercase tracking-widest">{electionId}</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-[2.5rem] flex flex-col items-center justify-center max-w-[48rem] mx-auto w-full">
        {/* Step Indicator */}
        <div className="flex items-center gap-[0.75rem] mb-[3rem] w-full">
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div 
                className={cn(
                  "flex flex-col items-center gap-[1rem] flex-1",
                  currentStep === s.id ? "opacity-100" : "opacity-30"
                )}
              >
                <div className={cn(
                  "w-[3.5rem] h-[3.5rem] rounded-[1.25rem] flex items-center justify-center transition-all border shadow-2xl overflow-hidden relative",
                  completed.includes(s.id) ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : 
                  currentStep === s.id ? "active-step text-white shadow-gold/20 scale-110 border-gold/30" : "bg-white/5 border-white/10 text-slate-600"
                )}>
                  {completed.includes(s.id) ? <CheckSquare size={26} /> : <s.icon size={26} />}
                  {currentStep === s.id && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 animate-pulse" />
                  )}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="w-full h-[0.0625rem] bg-white/5 mt-[1.5rem] mx-[0.5rem]" />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="gold-glass p-[2.5rem] md:p-[3.5rem] rounded-[3.5rem] w-full relative overflow-hidden border-gold/10"
          >
            <div className="relative z-10 flex flex-col items-center text-center">
              {currentStep === 'voting' ? (
                <div className="w-full space-y-[2rem]">
                   <div className="flex items-center justify-between mb-[1rem]">
                      <h4 className="text-[0.625rem] font-black text-slate-500 uppercase tracking-widest">Election Ballot</h4>
                      <div className="flex items-center gap-[0.5rem] text-gold">
                         <ShieldCheck size={14} />
                         <span className="text-[0.5rem] font-black uppercase tracking-widest">Secure Privacy Mode active</span>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem] w-full">
                      {CANDIDATES.map((candidate) => (
                        <div 
                          key={candidate.id}
                          onClick={() => setSelectedCandidateId(candidate.id)}
                          className={cn(
                            "group p-[1.25rem] rounded-[1.5rem] border transition-all cursor-pointer text-left flex items-center gap-[1rem]",
                            selectedCandidateId === candidate.id 
                              ? "bg-gold/10 border-gold/40 shadow-[0_0_1.5rem_rgba(212,175,55,0.1)]" 
                              : "bg-white/2 border-white/5 hover:border-white/20"
                          )}
                        >
                           <div className={cn(
                             "w-[2.5rem] h-[2.5rem] rounded-[1rem] flex items-center justify-center text-[1.25rem] transition-all",
                             selectedCandidateId === candidate.id ? "bg-gold text-black" : "bg-white/5 text-slate-500"
                           )}>
                              {candidate.icon}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h5 className={cn(
                                "text-[0.75rem] font-black uppercase tracking-widest transition-colors",
                                selectedCandidateId === candidate.id ? "text-gold" : "text-slate-300"
                              )}>
                                {candidate.name}
                              </h5>
                              <p className="text-[0.5625rem] text-slate-500 font-bold uppercase truncate">
                                {candidate.candidate}
                              </p>
                           </div>
                           {selectedCandidateId === candidate.id && (
                             <div className="w-[1rem] h-[1rem] rounded-full bg-gold flex items-center justify-center">
                               <CheckSquare size={10} className="text-black" />
                             </div>
                           )}
                        </div>
                      ))}
                   </div>

                   <p className="text-[0.5625rem] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                     Select a candidate to record your choice. <br />
                     <span className="text-gold opacity-60">Selection is recorded locally until submission.</span>
                   </p>
                </div>
              ) : (
                <>
                  <div className="w-[6rem] h-[6rem] bg-gold/5 text-gold rounded-[2rem] flex items-center justify-center mb-[2rem] border border-gold/20 shadow-inner group">
                    <currentStepData.icon size={48} className="transition-transform group-hover:scale-110 duration-500" />
                  </div>
                  <h3 className="text-[1.5rem] font-black text-slate-100 mb-[1rem] tracking-tight uppercase leading-none">{currentStepData.title}</h3>
                  
                  {currentStep === 'check-in' && electionId && (
                     <div className="space-y-[1.5rem] w-full">
                        <div className="p-[1.5rem] rounded-[1.5rem] bg-gold/5 border border-gold/10 space-y-[0.75rem] w-full">
                           <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest block">Simulation Identity Token</span>
                           <p className="text-[1.25rem] font-mono text-gold tracking-[0.2em] font-bold">{electionId}</p>
                        </div>
                        
                        {/* AI Recommendation Component */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-[1.5rem] rounded-[2rem] bg-blue-500/5 border border-blue-500/20 space-y-4 text-left"
                        >
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <Bot size={14} className="text-blue-400" />
                                 <span className="text-[0.625rem] font-black text-blue-100 uppercase tracking-widest">AI Verification Recommendation</span>
                              </div>
                              <span className="text-[0.5rem] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/10">98% Confidence</span>
                           </div>
                           
                           <div className="flex items-center justify-between gap-4">
                              <div className="flex-1 space-y-1">
                                 <div className="flex items-center justify-between text-[0.5rem] font-black uppercase text-slate-500 tracking-widest">
                                    <span>Risk Score</span>
                                    <span className="text-emerald-400">02 / 100</span>
                                 </div>
                                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[2%]" />
                                 </div>
                              </div>
                              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                 <span className="text-[0.625rem] font-black text-emerald-400 uppercase tracking-widest">ACCEPT</span>
                              </div>
                           </div>
                           
                           <p className="text-[0.5625rem] text-slate-400 font-medium italic opacity-80 leading-relaxed uppercase tracking-wider">
                             Reason: Biometric match successful. Cross-node registry confirms active eligibility for this sector.
                           </p>
                        </motion.div>
                     </div>
                  )}

                  <p className="text-slate-400 font-medium leading-[1.8] mb-[2.5rem] text-[0.875rem]">
                    {currentStepData.description}
                  </p>
                </>
              )}

              <div className="flex gap-[1.5rem] w-full justify-center mt-auto">
                 <button 
                   onClick={handleNext}
                   disabled={isVerifying || (currentStep === 'voting' && !selectedCandidateId)}
                   className="flex-1 max-w-[20rem] flex items-center justify-center gap-[1rem] py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] gold-glow transition-all disabled:opacity-30"
                 >
                   {isVerifying ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Synchronizing...
                      </>
                   ) : (
                      <>
                        {currentStepData.action}
                        <ArrowRight size={18} />
                      </>
                   )}
                 </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Simulation Result Overlay */}
      <AnimatePresence>
        {completed.includes('deposit') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-[2rem] bg-black/90 backdrop-blur-3xl rounded-[3rem] interaction-ready"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               className="gold-glass p-[3.5rem] rounded-[4rem] border-gold/30 text-center max-w-[32rem] w-full relative"
             >
                <div className="w-[6rem] h-[6rem] active-step text-white rounded-[2rem] flex items-center justify-center mx-auto mb-[2.5rem] shadow-[0_1rem_3rem_rgba(212,175,55,0.3)]">
                  <ShieldCheck size={48} />
                </div>
                <h2 className="text-[1.75rem] font-black text-slate-100 mb-[1rem] tracking-tighter uppercase leading-none">Vote Recorded</h2>
                
                {selectedCandidateId && (
                   <div className="mb-[1.5rem] p-[1.25rem] rounded-[1.5rem] bg-gold/5 border border-gold/10 inline-flex flex-col items-center">
                      <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest mb-2">Authenticated Selection</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xl">{CANDIDATES.find(c => c.id === selectedCandidateId)?.icon}</span>
                         <span className="text-gold font-bold uppercase tracking-widest text-[0.75rem]">
                           {CANDIDATES.find(c => c.id === selectedCandidateId)?.name}
                         </span>
                      </div>
                   </div>
                )}

                <p className="text-slate-400 text-[0.875rem] mb-[2.5rem] font-medium leading-relaxed italic">
                  Digital participation recorded. Your encrypted vote has been submitted to the official counting center.
                </p>
                <div className="flex flex-col gap-[1rem]">
                  <button onClick={handleFinish} className="w-full py-[1.25rem] active-step text-white rounded-[1.25rem] font-black uppercase tracking-[0.3em] text-[0.75rem] hover:scale-[1.03] transition-all">
                    Finalize Simulation
                  </button>
                  <p className="text-[0.4375rem] text-gold/40 uppercase tracking-[0.5em] font-black">Secure Election Hash: {Math.random().toString(16).slice(2, 10)}...</p>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
