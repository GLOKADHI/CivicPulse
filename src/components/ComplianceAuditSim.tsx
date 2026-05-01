import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  FileCheck, 
  UserCheck, 
  Database, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  Fingerprint,
  Info,
  ShieldCheck,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ComplianceAuditSimProps {
  onComplete: (data: any) => void;
  candidateData?: any;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

type AuditStatus = 'idle' | 'running' | 'summary';

interface AuditStep {
  id: string;
  label: string;
  icon: any;
  status: 'pending' | 'scanning' | 'passed' | 'flagged';
  details: string;
}

export default function ComplianceAuditSim({ onComplete, candidateData, addAssistantMessage }: ComplianceAuditSimProps) {
  const [status, setStatus] = useState<AuditStatus>('idle');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [steps, setSteps] = useState<AuditStep[]>([
    { 
      id: 'id', 
      label: 'Identity Validation', 
      icon: UserCheck, 
      status: 'pending',
      details: 'Verifying legal name and citizenship status against national registry.'
    },
    { 
      id: 'finance', 
      label: 'Financial Disclosure', 
      icon: Database, 
      status: 'pending',
      details: 'Scanning submitted campaign funds and asset declarations for compliance.'
    },
    { 
      id: 'records', 
      label: 'Public Records', 
      icon: History, 
      status: 'pending',
      details: 'Screening criminal records and professional history for eligibility.'
    },
  ]);

  const startAudit = () => {
    setStatus('running');
    setCurrentStepIdx(0);
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    if (addAssistantMessage) {
        addAssistantMessage("Initiating multi-vector compliance audit. This will scan your identity, financial records, and legal eligibility simultaneously.");
    }
  };

  useEffect(() => {
    if (status !== 'running') return;

    if (currentStepIdx < steps.length) {
      // Start scanning current step
      const currentStepLabel = steps[currentStepIdx].label;

      setSteps(prev => prev.map((s, idx) => 
        idx === currentStepIdx ? { ...s, status: 'scanning' } : s
      ));

      if (addAssistantMessage) {
        addAssistantMessage(`Scanning: ${currentStepLabel}... Running cross-reference checks against the national registry.`);
      }

      const timer = setTimeout(() => {
        setSteps(prev => prev.map((s, idx) => 
          idx === currentStepIdx ? { ...s, status: 'passed' } : s
        ));

        if (addAssistantMessage) {
          addAssistantMessage(`${currentStepLabel} check passed. No anomalies detected.`, 'success');
        }

        setCurrentStepIdx(prev => prev + 1);
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      // Audit finished
      const timer = setTimeout(() => {
        setStatus('summary');
        if (addAssistantMessage) {
          addAssistantMessage("Audit complete. Your candidacy is fully compliant with regional mandates. Review your report below.", 'success');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, currentStepIdx, steps.length, addAssistantMessage]);

  return (
    <div className="w-full max-w-[40rem] mx-auto">
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-[2rem] p-[3rem] border-white/5 text-center space-y-[2rem]"
          >
            <div className="w-[5rem] h-[5rem] rounded-[2rem] bg-gold/5 flex items-center justify-center text-gold mx-auto border border-gold/10">
              <Shield size={32} />
            </div>
            
            <div className="space-y-[0.75rem]">
              <h3 className="text-[1.25rem] font-black text-slate-100 uppercase tracking-widest">Candidate Compliance Audit</h3>
              <p className="text-[0.75rem] text-slate-500 font-medium leading-relaxed max-w-[20rem] mx-auto">
                Begin the official screening process to verify your candidacy eligibility and campaign integrity.
              </p>
            </div>

            <div className="p-[1.5rem] rounded-[1.5rem] bg-white/5 border border-white/5 flex items-start gap-[1rem] text-left">
              <Info size={16} className="text-gold shrink-0 mt-0.5" />
              <p className="text-[0.625rem] text-slate-400 italic">
                Note: This is a <strong>simulation</strong>. No actual databases are accessed. Your candidacy status here is for educational purposes only.
              </p>
            </div>

            <button
              onClick={startAudit}
              className="w-full py-[1.25rem] rounded-[1.5rem] bg-gold text-black text-[0.75rem] font-black uppercase tracking-[0.2em] shadow-[0_0.25rem_2rem_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-[0.75rem]"
            >
              Run Compliance Audit
              <Zap size={16} fill="black" />
            </button>
          </motion.div>
        )}

        {status === 'running' && (
          <motion.div
            key="running"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="glass rounded-[2.5rem] p-[3rem] border-white/5 space-y-[3rem]"
          >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-[1rem]">
                  <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-widest">Election Audit Agent</h4>
                    <p className="text-[0.5rem] text-slate-500 font-bold uppercase tracking-[0.2em]">Processing Metadata...</p>
                  </div>
               </div>
               <div className="text-right">
                  <span className="text-[0.625rem] font-black text-gold uppercase tracking-widest">Step {Math.min(currentStepIdx + 1, steps.length)}/3</span>
               </div>
            </div>

            <div className="space-y-[1.5rem]">
              {steps.map((step, i) => (
                <div 
                  key={step.id}
                  className={cn(
                    "p-[1.5rem] rounded-[2rem] border transition-all flex items-center gap-[1.5rem]",
                    step.status === 'scanning' ? "bg-gold/5 border-gold/30 shadow-[0_0_2rem_rgba(212,175,55,0.1)]" :
                    step.status === 'passed' ? "bg-emerald-500/5 border-emerald-500/20" :
                    "bg-white/2 border-white/5 opacity-40"
                  )}
                >
                  <div className={cn(
                    "w-[3rem] h-[3rem] rounded-[1.25rem] flex items-center justify-center shrink-0 border",
                    step.status === 'scanning' ? "bg-gold text-black border-gold animate-pulse" :
                    step.status === 'passed' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                    "bg-slate-800 text-slate-600 border-white/5"
                  )}>
                    <step.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-[0.25rem]">
                      <h5 className="text-[0.75rem] font-bold text-slate-100 uppercase tracking-wider">{step.label}</h5>
                      {step.status === 'scanning' && <span className="text-[0.5rem] font-black text-gold uppercase animate-pulse">Scanning...</span>}
                      {step.status === 'passed' && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                    <p className="text-[0.5625rem] text-slate-500 leading-relaxed font-medium">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-[2rem] border-t border-white/5">
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${(currentStepIdx / steps.length) * 100}%` }}
                    className="h-full bg-gold shadow-[0_0_1rem_rgba(212,175,55,0.5)]"
                  />
               </div>
            </div>
          </motion.div>
        )}

        {status === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] p-[3rem] border-white/5 space-y-[2.5rem] relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[15rem] h-[15rem] bg-emerald-500/5 blur-[5rem] rounded-full -mr-[5rem] -mt-[5rem]" />

            <div className="text-center space-y-[1.5rem] relative z-10">
              <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-[0.5rem]">
                <h3 className="text-[1.5rem] font-black text-white uppercase tracking-tighter">Audit Passed</h3>
                <p className="text-[0.625rem] text-emerald-400 font-bold uppercase tracking-[0.3em]">Candidacy Eligibility Confirmed</p>
              </div>
            </div>

            <div className="space-y-[1rem] relative z-10">
               <h6 className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-widest pl-[1rem]">Compliance Report</h6>
               <div className="bg-white/5 rounded-[2rem] border border-white/5 p-[2rem] space-y-[1.5rem]">
                  <div className="flex items-center justify-between">
                     <span className="text-[0.6875rem] font-bold text-slate-400">Candidate Name</span>
                     <span className="text-[0.6875rem] font-black text-white uppercase tracking-wider">{candidateData?.fullName || 'Anonymous Candidate'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[0.6875rem] font-bold text-slate-400">Election ID</span>
                     <span className="text-[0.6875rem] font-black text-gold uppercase">EP-2026-ALPHA</span>
                  </div>
                  <div className="h-[1px] bg-white/5" />
                  <div className="space-y-[1rem]">
                     <div className="flex items-start gap-[1rem]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                        <p className="text-[0.625rem] text-slate-400 leading-relaxed">Identity matched successfully with regional census record <span className="text-slate-100 font-bold">#492-BX</span>.</p>
                     </div>
                     <div className="flex items-start gap-[1rem]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                        <p className="text-[0.625rem] text-slate-400 leading-relaxed">Campaign treasurer disclosure meets all legislative transparency requirements.</p>
                     </div>
                     <div className="flex items-start gap-[1rem]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                        <p className="text-[0.625rem] text-slate-400 leading-relaxed">Criminal record check returns zero disqualifying conflicts.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-gold/5 border border-gold/10 p-[1.5rem] rounded-[1.5rem] flex items-center gap-[1rem]">
               <Zap size={16} className="text-gold" />
               <p className="text-[0.5625rem] text-slate-300 font-medium">
                 Your Candidacy Certificate has been generated and locked to your participant node.
               </p>
            </div>

            <button
              onClick={() => onComplete({ status: 'Passed', auditId: 'AUD-9921-X' })}
              className="w-full py-[1.25rem] rounded-[1.5rem] bg-white text-black text-[0.75rem] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all flex items-center justify-center gap-[0.75rem]"
            >
              Continue Journey
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
