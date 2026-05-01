import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Info,
  FileText,
  Sparkles,
  RefreshCw,
  Trash2,
  AlertCircle,
  Signature
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateIndianName } from '../lib/names';

type FilingStep = 'details' | 'office' | 'eligibility' | 'documents' | 'preview';

interface CandidateData {
  fullName: string;
  office: string;
  party: string;
  isCitizen: boolean;
  minAge: boolean;
  residenceRequirement: boolean;
  hasFinancialDisclosure: boolean;
  hasIntentForm: boolean;
  candidateId: string;
}

interface CandidateFilingFormProps {
  onComplete?: (data?: any) => void;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

export default function CandidateFilingForm({ onComplete, addAssistantMessage }: CandidateFilingFormProps) {
  const [step, setStep] = useState<FilingStep>('details');
  const [data, setData] = useState<CandidateData>({
    fullName: '',
    office: '',
    party: '',
    isCitizen: true,
    minAge: true,
    residenceRequirement: true,
    hasFinancialDisclosure: false,
    hasIntentForm: false,
    candidateId: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CandidateData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  const offices = [
    'Member of Parliament (Lok Sabha)',
    'Member of Legislative Assembly (MLA)',
    'District Development Council',
    'Municipal Corporation Mayor',
    'Sarpanch (Panchayat Leader)'
  ];

  const parties = [
    'Progressive Bharat Dal',
    'National Vikas Alliance',
    'Jan Shakti Front',
    'Independent / Non-Partisan',
    'Regional Sangathan Party'
  ];

  const handleAutoFill = () => {
    const newData = {
      ...data,
      fullName: generateIndianName().toUpperCase(),
      office: offices[Math.floor(Math.random() * offices.length)],
      party: parties[Math.floor(Math.random() * parties.length)],
      isCitizen: true,
      minAge: true,
      residenceRequirement: true,
      hasFinancialDisclosure: true,
      hasIntentForm: true
    };
    setData(newData);
    setErrors({});

    if (addAssistantMessage) {
      addAssistantMessage(`Prepared filing for ${newData.fullName}. I've selected the ${newData.office} role for this simulation representing the ${newData.party}.`);
    }
  };

  const handleClear = () => {
    setData({
      fullName: '',
      office: '',
      party: '',
      isCitizen: true,
      minAge: true,
      residenceRequirement: true,
      hasFinancialDisclosure: false,
      hasIntentForm: false,
      candidateId: ''
    });
    setErrors({});
    if (addAssistantMessage) {
      addAssistantMessage("Manual filing started. Remember, candidate details are indexed by regional AI for compliance—accuracy is mandatory.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => handleAutoFill(), 800);
    return () => clearTimeout(timer);
  }, []);

  const validateStep = () => {
    const newErrors: Partial<Record<keyof CandidateData, string>> = {};
    
    if (step === 'details') {
      if (!data.fullName) newErrors.fullName = "Full name is required";
    }

    if (step === 'office') {
      if (!data.office) newErrors.office = "Target office is required";
      if (!data.party) newErrors.party = "Party affiliation is required";
    }

    if (step === 'eligibility') {
      if (!data.isCitizen) newErrors.isCitizen = "Citizenship is mandatory";
      if (!data.minAge) newErrors.minAge = "You must meet the minimum age requirement";
      if (!data.residenceRequirement) newErrors.residenceRequirement = "Residence duration check failed";
    }

    if (step === 'documents') {
      if (!data.hasIntentForm) newErrors.hasIntentForm = "Declaration of Intent must be generated";
      if (!data.hasFinancialDisclosure) newErrors.hasFinancialDisclosure = "Financial disclosure is mandatory";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 'details') {
        setStep('office');
        if (addAssistantMessage) addAssistantMessage("Name recorded. Now choose your target public office and party affiliation.");
      }
      else if (step === 'office') {
        setStep('eligibility');
        if (addAssistantMessage) addAssistantMessage("Role selected. Proceeding to legal eligibility self-audit.");
      }
      else if (step === 'eligibility') {
        setStep('documents');
        if (addAssistantMessage) addAssistantMessage("Eligibility confirmed. I've prepared the legal documents for your signature.");
      }
      else if (step === 'documents') {
        setStep('preview');
        if (addAssistantMessage) addAssistantMessage("Final summary generated. Review carefully before submitting to the judicial node.");
      }
      else if (step === 'preview') handleFinalize();
    } else {
        if (addAssistantMessage) addAssistantMessage("Compliance check failed. Please resolve the errors in your filing to proceed.", 'alert');
    }
  };

  const handleGenerateIntent = () => {
    setIsGeneratingDoc(true);
    if (addAssistantMessage) addAssistantMessage("Generating Declaration of Intent with secure sub-atomic timestamp...");
    setTimeout(() => {
      setData(prev => ({ ...prev, hasIntentForm: true }));
      setIsGeneratingDoc(false);
      setErrors(prev => ({ ...prev, hasIntentForm: undefined }));
      if (addAssistantMessage) addAssistantMessage("Document generated and signed successfully.", 'success');
    }, 1500);
  };

  const handleUploadDisclosure = () => {
    setData(prev => ({ ...prev, hasFinancialDisclosure: true }));
    setErrors(prev => ({ ...prev, hasFinancialDisclosure: undefined }));
    if (addAssistantMessage) addAssistantMessage("Financial disclosure staged for audit.", 'success');
  };

  const handleFinalize = () => {
    setIsSubmitting(true);
    const generatedId = `CAND-${Math.floor(100000 + Math.random() * 900000)}`;
    if (addAssistantMessage) addAssistantMessage(`Filing candidacy for ${data.fullName}... Broadcasting to the central node.`);
    
    setTimeout(() => {
      setData(prev => ({ ...prev, candidateId: generatedId }));
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (addAssistantMessage) addAssistantMessage(`Filing successful. Your Candidate ID is ${generatedId}. Proceeding to compliance audit.`, 'success');
      
      setTimeout(() => {
        if (onComplete) onComplete({ ...data, candidateId: generatedId });
      }, 2500);
    }, 2000);
  };

  const steps: FilingStep[] = ['details', 'office', 'eligibility', 'documents', 'preview'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="glass rounded-[2rem] border-white/5 bg-white/2 p-[2rem] space-y-[2rem] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1rem]">
          <div className="w-[2.5rem] h-[2.5rem] rounded-[1rem] bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
            <Signature size={20} />
          </div>
          <div>
            <h4 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-widest">Candidacy Portal</h4>
            <p className="text-[0.5625rem] text-slate-500 font-bold uppercase tracking-widest mt-[0.125rem]">Official Filing Interface</p>
          </div>
        </div>
        <div className="flex items-center gap-[1rem]">
          <div className="flex items-center gap-[0.5rem] bg-white/5 p-[0.375rem] rounded-full border border-white/5">
              <button 
                onClick={handleAutoFill}
                className="p-[0.5rem] rounded-full hover:bg-gold/20 text-gold transition-all"
                title="Fill with Sample Data"
              >
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={handleClear}
                className="p-[0.5rem] rounded-full hover:bg-red-500/20 text-red-400 transition-all"
                title="Clear All Fields"
              >
                <Trash2 size={14} />
              </button>
          </div>
          <div className="flex flex-col items-end gap-[0.5rem]">
              <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Phase {currentStepIndex + 1}/{steps.length}</span>
              <div className="w-[6rem] h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gold"
                    animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
              </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-[3rem] rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center gap-[1.5rem]"
          >
            <div className="w-[5rem] h-[5rem] rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-[0_0_2rem_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h5 className="text-[1.25rem] font-black text-emerald-400 uppercase tracking-[0.2em] mb-[0.5rem]">Filing Recorded Succesfully</h5>
              <div className="bg-black/40 border border-white/10 p-[1.5rem] rounded-[1.5rem] my-[1rem]">
                 <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest block mb-1">Official Candidate ID</span>
                 <p className="text-[1.5rem] font-mono text-gold tracking-[0.3em]">{data.candidateId}</p>
              </div>
              <p className="text-[0.75rem] text-slate-400 leading-relaxed font-medium">
                Your declaration has been timestamped and indexed. <br />
                <span className="text-gold font-bold">Awaiting Compliance Audit...</span>
              </p>
            </div>
            <motion.div 
              className="w-12 h-1 bg-emerald-500/20 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 2.5 }}
            >
               <motion.div 
                 className="h-full bg-emerald-500"
                 initial={{ x: "-100%" }}
                 animate={{ x: "0%" }}
                 transition={{ duration: 2.5 }}
               />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-[1.75rem]"
          >
            {step === 'details' && (
              <div className="space-y-[1.5rem]">
                <div className="space-y-[0.75rem]">
                   <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                     <User size={12} className="text-gold" /> Full Legal Candidate Name
                   </label>
                   <input 
                      type="text"
                      value={data.fullName}
                      onChange={(e) => setData({...data, fullName: e.target.value})}
                      placeholder="ENTER FULL NAME"
                      className={cn(
                        "w-full bg-white/5 border rounded-[1.25rem] py-[1.25rem] px-[1.5rem] text-[0.875rem] text-slate-100 transition-all font-bold tracking-widest",
                        errors.fullName ? "border-red-500/40" : "border-white/10 focus:border-gold/40 outline-none"
                      )}
                   />
                   {errors.fullName && <p className="text-[0.5rem] text-red-400 font-bold uppercase ml-2">{errors.fullName}</p>}
                </div>
                <div className="p-[1.25rem] rounded-[1.5rem] bg-white/2 border border-white/5 flex items-start gap-[1rem]">
                    <Info size={16} className="text-gold mt-0.5" />
                    <p className="text-[0.625rem] text-slate-400 leading-relaxed font-medium">
                      Ensure your name matches your registered voter identity. Discrepancies will trigger a compliance hold.
                    </p>
                </div>
              </div>
            )}

            {step === 'office' && (
              <div className="space-y-[1.5rem]">
                <div className="space-y-[0.75rem]">
                   <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                     <Briefcase size={12} className="text-gold" /> Target Public Office
                   </label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-[0.75rem]">
                     {offices.map((office) => (
                       <button
                         key={office}
                         onClick={() => setData({...data, office})}
                         className={cn(
                           "p-[1.25rem] rounded-[1.25rem] border text-left transition-all text-[0.75rem] font-bold tracking-wider",
                           data.office === office ? "bg-gold/10 border-gold text-gold" : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                         )}
                       >
                         {office}
                       </button>
                     ))}
                   </div>
                </div>
                <div className="space-y-[0.75rem]">
                   <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                     <Sparkles size={12} className="text-gold" /> Party Affiliation
                   </label>
                   <select 
                      value={data.party}
                      onChange={(e) => setData({...data, party: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] py-[1.25rem] px-[1.5rem] text-[0.875rem] text-slate-100 focus:border-gold/40 outline-none appearance-none cursor-pointer"
                   >
                      <option value="" className="bg-slate-900">Select Party...</option>
                      {parties.map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                   </select>
                </div>
              </div>
            )}

            {step === 'eligibility' && (
              <div className="space-y-[1.25rem]">
                 <h5 className="text-[0.625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem]">Eligibility Self-Audit</h5>
                 <div className="space-y-[0.75rem]">
                    {[
                      { key: 'isCitizen', label: 'Verified Citizenship of this Region', description: 'Candidates must be legal citizens for at least 10 years.' },
                      { key: 'minAge', label: 'Minimum Age Requirement Met', description: 'Requires age 25+ for regional offices, 35+ for executive roles.' },
                      { key: 'residenceRequirement', label: 'Local Residency Requirement', description: 'Confirmed residence in the target district for 3+ consecutive years.' }
                    ].map((item) => (
                      <div 
                        key={item.key}
                        onClick={() => setData({...data, [item.key]: !data[item.key as keyof CandidateData]})}
                        className={cn(
                          "p-[1.25rem] rounded-[1.5rem] border transition-all cursor-pointer flex items-center justify-between gap-[1.5rem]",
                          data[item.key as keyof CandidateData] ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/5 opacity-60"
                        )}
                      >
                         <div className="min-w-0">
                            <p className={cn(
                              "text-[0.75rem] font-black uppercase tracking-widest",
                              data[item.key as keyof CandidateData] ? "text-emerald-400" : "text-slate-400"
                            )}>
                              {item.label}
                            </p>
                            <p className="text-[0.5rem] text-slate-500 mt-1">{item.description}</p>
                         </div>
                         <div className={cn(
                           "w-[1.5rem] h-[1.5rem] rounded-full border flex items-center justify-center shrink-0",
                           data[item.key as keyof CandidateData] ? "bg-emerald-500 border-emerald-500 text-black" : "border-white/10"
                         )}>
                            {data[item.key as keyof CandidateData] && <CheckCircle2 size={12} />}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {step === 'documents' && (
              <div className="space-y-[1.5rem]">
                 <div className="p-[1.5rem] rounded-[2rem] bg-white/5 border border-white/10 space-y-[1.5rem]">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-[0.75rem]">
                          <div className={cn(
                            "w-[2rem] h-[2rem] rounded-[0.75rem] flex items-center justify-center",
                            data.hasIntentForm ? "bg-emerald-500/10 text-emerald-500" : "bg-gold/10 text-gold"
                          )}>
                             <Signature size={16} />
                          </div>
                          <div>
                             <p className="text-[0.625rem] font-black text-slate-100 uppercase tracking-widest">Declaration of Intent</p>
                             <p className="text-[0.5rem] text-slate-500 font-bold uppercase tracking-widest">{data.hasIntentForm ? 'GENERATED & SIGNED' : 'AWAITING SIGNATURE'}</p>
                          </div>
                       </div>
                       {!data.hasIntentForm ? (
                         <button 
                            onClick={handleGenerateIntent}
                            disabled={isGeneratingDoc}
                            className="px-[1rem] py-[0.5rem] rounded-lg bg-gold/10 border border-gold/20 text-gold text-[0.5625rem] font-black uppercase tracking-widest hover:bg-gold/20 transition-all flex items-center gap-2"
                         >
                            {isGeneratingDoc ? <RefreshCw size={10} className="animate-spin" /> : <Signature size={10} />}
                            {isGeneratingDoc ? 'Processing...' : 'Sign & Generate'}
                         </button>
                       ) : (
                         <div className="text-emerald-500 flex items-center gap-2 text-[0.5625rem] font-black uppercase">
                            <CheckCircle2 size={12} /> Verified
                         </div>
                       )}
                    </div>

                    <div className="h-[1px] bg-white/10" />

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-[0.75rem]">
                          <div className={cn(
                            "w-[2rem] h-[2rem] rounded-[0.75rem] flex items-center justify-center",
                            data.hasFinancialDisclosure ? "bg-emerald-500/10 text-emerald-500" : "bg-gold/10 text-gold"
                          )}>
                             <FileText size={16} />
                          </div>
                          <div>
                             <p className="text-[0.625rem] font-black text-slate-100 uppercase tracking-widest">Financial Disclosure</p>
                             <p className="text-[0.5rem] text-slate-500 font-bold uppercase tracking-widest">{data.hasFinancialDisclosure ? 'AUDIT READY' : 'MANDATORY UPLOAD'}</p>
                          </div>
                       </div>
                       {!data.hasFinancialDisclosure ? (
                         <button 
                            onClick={handleUploadDisclosure}
                            className="px-[1rem] py-[0.5rem] rounded-lg bg-gold/10 border border-gold/20 text-gold text-[0.5625rem] font-black uppercase tracking-widest hover:bg-gold/20 transition-all"
                         >
                            Simulate Upload
                         </button>
                       ) : (
                         <div className="text-emerald-500 flex items-center gap-2 text-[0.5625rem] font-black uppercase">
                            <CheckCircle2 size={12} /> Staged
                         </div>
                       )}
                    </div>
                 </div>
                 {errors.hasIntentForm && <p className="text-[0.5rem] text-red-400 font-bold uppercase text-center mt-2 flex items-center justify-center gap-1"><AlertCircle size={10} /> {errors.hasIntentForm}</p>}
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-[1.5rem]">
                 <div className="p-[2rem] rounded-[2.5rem] bg-gold/5 border border-gold/10 space-y-[2rem]">
                    <div className="flex items-center gap-[1rem] pb-[1.5rem] border-b border-white/5">
                        <div className="w-[3rem] h-[3rem] rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                           <User size={24} />
                        </div>
                        <div>
                           <h5 className="text-[1rem] font-black text-slate-100 uppercase tracking-tight">{data.fullName}</h5>
                           <p className="text-[0.5625rem] text-gold font-bold uppercase tracking-widest mt-1">Candidate Profile Summary</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-[2rem]">
                       <div className="space-y-[0.375rem]">
                          <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Office Sought</span>
                          <p className="text-[0.75rem] font-bold text-slate-200">{data.office}</p>
                       </div>
                       <div className="space-y-[0.375rem]">
                          <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Organization</span>
                          <p className="text-[0.75rem] font-bold text-slate-200">{data.party}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-[0.75rem] p-[1.25rem] rounded-[1.25rem] bg-emerald-500/5 border border-emerald-500/10">
                       <ShieldCheck size={16} className="text-emerald-500" />
                       <span className="text-[0.5625rem] font-black text-emerald-400 uppercase tracking-widest">Eligibility Indicators: Verified - No Compliance Alerts</span>
                    </div>
                 </div>
                 <p className="text-[0.5625rem] text-slate-500 leading-relaxed font-medium text-center italic">
                   Note: Final certification is subject to a 72-hour judicial compliance audit.
                 </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!isSubmitted && (
         <div className="flex items-center gap-[1.25rem] pt-[1.5rem] border-t border-white/5">
            {currentStepIndex > 0 && (
              <button 
                onClick={() => setStep(steps[currentStepIndex - 1])}
                className="px-[1.5rem] py-[1.25rem] rounded-[1.5rem] border border-white/10 text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            
            <button 
              onClick={nextStep}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-[1rem] py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] gold-glow transition-all"
            >
              {isSubmitting ? (
                 <>
                   <RefreshCw size={16} className="animate-spin" />
                   Syncing with Ledger...
                 </>
              ) : (
                <>
                  {step === 'preview' ? 'Confirm & File Candidacy' : 'Advance to Next Step'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
         </div>
      )}
    </div>
  );
}
