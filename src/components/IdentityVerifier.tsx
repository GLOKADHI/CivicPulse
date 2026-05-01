import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  Scan, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Hash,
  Info,
  CheckCircle2,
  XCircle,
  User,
  MapPin,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

type VerifyStatus = 'idle' | 'scanning' | 'matching' | 'success' | 'failed';

interface IdentityVerifierProps {
  onComplete?: () => void;
  registrationData?: {
    fullName: string;
    dob: string;
    address: string;
    idNumber: string;
    hasPhoto: boolean;
  } | null;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

export default function IdentityVerifier({ onComplete, registrationData, addAssistantMessage }: IdentityVerifierProps) {
  const [idNumber, setIdNumber] = useState(registrationData?.idNumber || '');
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (registrationData?.idNumber) {
      setIdNumber(registrationData.idNumber);
    }
  }, [registrationData]);

  const generateDemoId = () => {
    const randomId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setIdNumber(randomId);
    setErrorMsg('');
    if (addAssistantMessage) {
      addAssistantMessage("Generated a demo Citizen ID for you. In a real election, this would be your physical or digital residence card ID.");
    }
  };

  const validateInput = (val: string) => {
    const onlyNums = val.replace(/[^\d]/g, '').slice(0, 12);
    setIdNumber(onlyNums);
    if (onlyNums.length === 12) setErrorMsg('');
  };

  const startVerification = () => {
    if (idNumber.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Citizen Reference ID.');
      if (addAssistantMessage) addAssistantMessage("The Citizen ID must be exactly 12 digits. Check your input and try again.", 'alert');
      return;
    }

    setStatus('scanning');
    setProgress(0);
    setErrorMsg('');
    if (addAssistantMessage) addAssistantMessage("Starting identity verification. We're cross-referencing your biometric data and ID with the national census registry.");

    // Simulated Scanning Phase
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setStatus('matching');
          if (addAssistantMessage) addAssistantMessage("Scanning complete. Now matching fingerprints and facial data against regional records.");
        }, 500);
      }
      setProgress(p);
    }, 150);
  };

  useEffect(() => {
    if (status === 'matching') {
      const isActuallySuccess = Math.random() > 0.2;
      setProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          
          setTimeout(() => {
            setStatus(isActuallySuccess ? 'success' : 'failed');
            if (!isActuallySuccess) {
              const msg = 'Security Protocol Exception: ID record mismatch detected at central node.';
              setErrorMsg(msg);
              if (addAssistantMessage) addAssistantMessage(msg, 'alert');
            } else {
              if (addAssistantMessage) addAssistantMessage("Verification protocols finalized. Identity node synchronized with the regional record.", 'success');
              setTimeout(() => {
                if (onComplete) onComplete();
              }, 2500);
            }
          }, 800);
        }
        setProgress(p);
      }, 200);
    }
  }, [status, onComplete, addAssistantMessage]);

  const [aiAnalysis, setAiAnalysis] = useState<{ confidence: number; risk: 'LOW' | 'MED' | 'HIGH'; reason: string } | null>(null);

  useEffect(() => {
    if (status === 'matching') {
      // Simulate AI analysis depth
      const timer = setTimeout(() => {
        setAiAnalysis({
          confidence: 99.4,
          risk: 'LOW',
          reason: 'Biometric signatures match historical census data with 0.02ms latency.'
        });
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAiAnalysis(null);
    }
  }, [status]);

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
  };

  return (
    <div className="glass rounded-[2rem] border-white/5 bg-white/2 p-[2rem] space-y-[2rem]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1rem]">
          <div className="w-[2.5rem] h-[2.5rem] rounded-[1rem] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Fingerprint size={20} />
          </div>
          <div>
            <h4 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-widest">Identity Verification</h4>
            <p className="text-[0.5625rem] text-slate-500 font-bold uppercase tracking-widest mt-[0.125rem]">Official Citizen Validation</p>
          </div>
        </div>
        <div className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-full bg-white/5 border border-white/5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[0.5rem] font-black text-emerald-500 uppercase tracking-widest">Encrypted Tunnel</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-[1.5rem]"
          >
            <div className="p-[1.25rem] rounded-[1.25rem] bg-gold/5 border border-gold/10 flex items-start gap-[1rem]">
              <Info size={16} className="text-gold shrink-0 mt-0.5" />
              <p className="text-[0.625rem] text-slate-400 leading-relaxed italic font-medium">
                "Validating submitted application data. This ensures identity integrity before ballot issuance."
              </p>
            </div>

            {registrationData && (
              <div className="p-[1.5rem] rounded-[2rem] bg-white/5 border border-white/10 space-y-[1.25rem]">
                 <div className="flex items-center justify-between">
                    <h5 className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-widest">Application Data Identified</h5>
                    <div className="px-[0.75rem] py-[0.25rem] rounded-full bg-gold/10 border border-gold/20 text-[0.5rem] font-black text-gold uppercase tracking-widest">Ready for Sync</div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-[1.5rem]">
                    <div className="flex items-center gap-[0.75rem]">
                       <div className="w-[2rem] h-[2rem] rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                          <User size={12} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Full Name</span>
                          <span className="text-[0.6875rem] font-bold text-slate-200 truncate max-w-[8rem]">{registrationData.fullName}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-[0.75rem]">
                       <div className="w-[2rem] h-[2rem] rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                          <Calendar size={12} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">DOB</span>
                          <span className="text-[0.6875rem] font-bold text-slate-200">{registrationData.dob}</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-[1rem] border-t border-white/5 flex items-center gap-[0.75rem]">
                    <MapPin size={12} className="text-gold" />
                    <span className="text-[0.625rem] text-slate-400 truncate flex-1">{registrationData.address}</span>
                 </div>
              </div>
            )}

            <div className="space-y-[1rem]">
              <div className="flex items-center justify-between ml-[0.5rem]">
                <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em]">12-Digit Citizen Ref ID</label>
                <button 
                  onClick={generateDemoId}
                  className="text-[0.5625rem] font-black text-gold uppercase tracking-widest hover:underline"
                >
                  Generate Demo ID
                </button>
              </div>
              <div className="relative">
                <Hash size={16} className="absolute left-[1.25rem] top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={idNumber}
                  onChange={(e) => validateInput(e.target.value)}
                  placeholder="EX: 8823 4109 4452"
                  className={cn(
                    "w-full bg-white/5 border rounded-[1.25rem] py-[1.25rem] pl-[3.25rem] pr-[1.25rem] text-[1rem] font-mono text-slate-100 tracking-[0.2em] outline-none transition-all placeholder:text-slate-800",
                    errorMsg ? "border-red-500/40" : "border-white/10 focus:border-gold/40"
                  )}
                />
              </div>
              {errorMsg && <p className="text-[0.5rem] font-bold text-red-400 uppercase tracking-widest ml-[0.5rem]">{errorMsg}</p>}
            </div>

            <button 
              onClick={startVerification}
              className="w-full py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] gold-glow hover:scale-[1.02] transition-all"
            >
              {registrationData ? 'Confirm & Start Verification' : 'Initialize Verification'}
            </button>
          </motion.div>
        )}

        {(status === 'scanning' || status === 'matching') && (
           <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-[2rem] gap-[2rem]"
           >
             <div className="relative">
                <div className="w-[6rem] h-[6rem] rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center">
                    {status === 'scanning' ? (
                       <Scan size={32} className="text-gold animate-pulse" />
                    ) : (
                       <Search size={32} className="text-blue-400 animate-spin-slow" />
                    )}
                </div>
                <motion.div 
                  className="absolute inset-0 border-2 border-gold/40 rounded-[2rem]"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
             </div>

             <div className="text-center space-y-[0.75rem] w-full max-w-[15rem]">
                <h5 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-[0.3em]">
                    {status === 'scanning' ? 'Verifying Identity' : 'Matching Records'}
                </h5>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={cn(
                            "h-full transition-all duration-200",
                            status === 'scanning' ? "bg-gold" : "bg-blue-400"
                        )}
                    />
                </div>
                <p className="text-[0.5625rem] text-slate-500 font-bold uppercase tracking-widest">
                    {status === 'scanning' ? 'Checking Certificate Format...' : `Searching records for ${registrationData?.fullName || 'Citizen'}...`}
                </p>

                {aiAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-[1.25rem] bg-white/5 border border-white/10 space-y-2 text-left"
                  >
                     <div className="flex items-center justify-between">
                        <span className="text-[0.5rem] font-black text-gold uppercase tracking-widest">AI Recommendation</span>
                        <span className="text-[0.5rem] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded-full">CONFIDENCE: {aiAnalysis.confidence}%</span>
                     </div>
                     <p className="text-[0.5625rem] text-slate-400 font-medium italic">"{aiAnalysis.reason}"</p>
                  </motion.div>
                )}
             </div>
           </motion.div>
        )}

        {(status === 'success' || status === 'failed') && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "p-[2.5rem] rounded-[2.5rem] border flex flex-col items-center text-center gap-[1.5rem]",
                status === 'success' ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10"
            )}
          >
             <div className={cn(
                 "w-[4rem] h-[4rem] rounded-full flex items-center justify-center",
                 status === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
             )}>
                {status === 'success' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
             </div>

             <div>
                <h5 className={cn(
                    "text-[1rem] font-black uppercase tracking-[0.2em] mb-[0.5rem]",
                    status === 'success' ? "text-emerald-400" : "text-red-400"
                )}>
                    {status === 'success' ? 'Voter Identity Validated' : 'Verification Rejected'}
                </h5>
                <p className="text-[0.6875rem] text-slate-400 leading-relaxed font-medium">
                    {status === 'success' 
                        ? `Identity confirmed for ${registrationData?.fullName || 'Citizen'}. Your account has been authenticated for the election.` 
                        : errorMsg}
                </p>
             </div>

             {status === 'failed' && (
                <button 
                    onClick={reset}
                    className="flex items-center gap-[0.75rem] px-[1.5rem] py-[0.75rem] rounded-full bg-white/5 border border-white/10 text-[0.625rem] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                    <RefreshCw size={12} />
                    Retry Simulation
                </button>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="pt-[1.5rem] border-t border-white/5 grid grid-cols-2 gap-[2rem]">
          <div className="space-y-[0.5rem]">
             <h6 className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest flex items-center gap-[0.5rem]">
                <ShieldCheck size={10} className="text-emerald-500" />
                Why this matters
             </h6>
             <p className="text-[0.5625rem] text-slate-500 leading-relaxed font-bold">Prevents identity spoofing and ensures one voice per citizen.</p>
          </div>
          <div className="space-y-[0.5rem] border-l border-white/5 pl-[2rem]">
             <h6 className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Est. Time</h6>
             <p className="text-[0.5625rem] text-gold font-black uppercase tracking-widest">3 - 5 Minutes</p>
          </div>
      </div>
    </div>
  );
}
