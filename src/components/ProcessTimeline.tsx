import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Zap,
  ArrowRight,
  ShieldCheck,
  Target,
  FileText,
  Lock,
  Bot
} from 'lucide-react';
import { UserRole, ELECTION_PROCESS_DATA, ROLE_FLOWS } from '../constants/election';
import { cn } from '../lib/utils';
import EligibilityChecker from './EligibilityChecker';
import PollingBoothSim from './PollingBoothSim';
import IdentityVerifier from './IdentityVerifier';
import VoterRegistrationForm from './VoterRegistrationForm';
import CandidateFilingForm from './CandidateFilingForm';
import ComplianceAuditSim from './ComplianceAuditSim';
import CandidateApprovalSim from './CandidateApprovalSim';
import VolunteerTrainingSim from './VolunteerTrainingSim';
import VolunteerAssignmentSim from './VolunteerAssignmentSim';
import VolunteerLiveBoothSim from './VolunteerLiveBoothSim';
import VolunteerClosingSim from './VolunteerClosingSim';
import BallotGenerator from './BallotGenerator';
import VoterResults from './VoterResults';

interface ProcessTimelineProps {
  role: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  completedIndices: number[];
  setCompletedIndices: React.Dispatch<React.SetStateAction<number[]>>;
  registrationData: any;
  setRegistrationData: React.Dispatch<React.SetStateAction<any>>;
  candidateData: any;
  setCandidateData: React.Dispatch<React.SetStateAction<any>>;
  candidateAuditResult: any;
  setCandidateAuditResult: React.Dispatch<React.SetStateAction<any>>;
  volunteerData: any;
  setVolunteerData: React.Dispatch<React.SetStateAction<any>>;
  electionId: string;
  setElectionId: React.Dispatch<React.SetStateAction<string>>;
  ballotPdfUrl: string;
  setBallotPdfUrl: React.Dispatch<React.SetStateAction<string>>;
  trackingId: string;
  setTrackingId: React.Dispatch<React.SetStateAction<string>>;
  addAssistantMessage: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
  onReset: () => void;
}

export default function ProcessTimeline({ 
  role, 
  onRoleChange,
  currentIndex, 
  setCurrentIndex, 
  completedIndices, 
  setCompletedIndices,
  registrationData,
  setRegistrationData,
  candidateData,
  setCandidateData,
  candidateAuditResult,
  setCandidateAuditResult,
  volunteerData,
  setVolunteerData,
  electionId,
  setElectionId,
  ballotPdfUrl,
  setBallotPdfUrl,
  trackingId,
  setTrackingId,
  addAssistantMessage,
  onReset
}: ProcessTimelineProps) {
  const flowIds = ROLE_FLOWS[role];

  const currentStepId = flowIds[currentIndex];
  const step = ELECTION_PROCESS_DATA[currentStepId];

  const [showSummary, setShowSummary] = useState(false);
  const [completedStepId, setCompletedStepId] = useState<string | null>(null);

  const handleNext = (data?: any) => {
    if (data && currentStepId === 'voter-reg') {
      setRegistrationData(data);
    }
    if (data && currentStepId === 'cand-file') {
      setCandidateData(data);
    }
    if (data && currentStepId === 'cand-verify') {
      setCandidateAuditResult(data);
    }
    if (data && (currentStepId === 'vol-training' || currentStepId === 'vol-assign' || currentStepId === 'vol-booth' || currentStepId === 'vol-closing')) {
      setVolunteerData((prev: any) => ({ ...prev, ...data }));
    }
    if (data?.electionId) {
      setElectionId(data.electionId);
    }
    if (data?.ballotPdfUrl) {
      setBallotPdfUrl(data.ballotPdfUrl);
    }
    if (data?.trackingId) {
      setTrackingId(data.trackingId);
    }

    setCompletedStepId(currentStepId);
    setShowSummary(true);
    
    const nextStep = ROLE_FLOWS[role][currentIndex + 1];
    if (addAssistantMessage && nextStep) {
        addAssistantMessage(`Phase Complete. Initiating debriefing for ${step.title}.`, 'success');
    }
  };

  const proceedToNextStep = () => {
    setShowSummary(false);
    if (currentIndex < flowIds.length - 1) {
      setCompletedIndices(prev => [...new Set([...prev, currentIndex])]);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Flow completed
      setCompletedIndices(prev => [...new Set([...prev, currentIndex])]);
      if (role === 'candidate' && completedStepId === 'cand-approval') {
        onRoleChange('voter');
        setCurrentIndex(0);
        setCompletedIndices([]);
      } else {
        addAssistantMessage("Journey finalized. You have successfully navigated all protocols.", "success");
      }
    }
  };

  const [lockedStepMessage, setLockedStepMessage] = useState<number | null>(null);

  const handleStepClick = (idx: number) => {
    if (idx === currentIndex) return;
    
    const isCompleted = completedIndices.includes(idx);
    
    if (isCompleted || idx < currentIndex) {
      // Allow navigation to completed or past steps
      setCurrentIndex(idx);
      const targetStep = ELECTION_PROCESS_DATA[flowIds[idx]];
      addAssistantMessage(`Revisiting ${targetStep.title}. Technical logs are preserved for audit.`, 'guidance');
    } else {
      // Prevent skipping ahead
      setLockedStepMessage(idx);
      setTimeout(() => setLockedStepMessage(null), 2000);
      addAssistantMessage("Sequence violation. Cumulative verification required before accessing subsequent nodes.", "alert");
    }
  };

  const progress = ((completedIndices.length) / flowIds.length) * 100;

  return (
    <div className="flex flex-col h-full bg-black/20 selection:bg-gold/30">
      <div className="p-[2rem] border-b border-white/5 bg-black/40 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-[1.5rem]">
        <div className="min-w-0">
          <h2 className="text-fluid-h3 font-black text-slate-100 uppercase tracking-widest truncate">Election Roadmap</h2>
          <p className="text-slate-500 text-[0.625rem] font-bold uppercase tracking-[0.3em] mt-[0.25rem] truncate">Participation Path: <span className="text-gold">{role} Journey</span></p>
        </div>
        <div className="flex items-center gap-[1rem] shrink-0">
           <div className="flex flex-col items-end gap-[0.375rem]">
              <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Global Progress</span>
              <span className="text-[0.75rem] font-black text-gold">{Math.round(progress)}%</span>
           </div>
           <div className="w-[8rem] h-[0.25rem] bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                animate={{ width: `${progress}%` }} 
                className="h-full active-step" 
              />
           </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Progress Sidebar - Guided Steps */}
        <nav className="w-full lg:w-[20rem] border-r border-white/5 p-[1.5rem] space-y-[1rem] overflow-y-auto bg-black/10 interaction-ready" aria-label="Step progress">
          <p className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.4em] mb-[1.5rem] ml-[0.5rem]">Journey Steps</p>
          <div className="space-y-[0.75rem]">
            {flowIds.map((id, idx) => {
              const s = ELECTION_PROCESS_DATA[id];
              const isCompleted = completedIndices.includes(idx);
              const isActive = currentIndex === idx;
              const isLocked = idx !== currentIndex;

              return (
                <button
                  key={id}
                  onClick={() => handleStepClick(idx)}
                  className={cn(
                    "w-full text-left p-[1.25rem] rounded-[1.5rem] transition-all border flex items-center gap-[1rem] group relative",
                    isActive ? "active-step border-gold/30 gold-glow ring-1 ring-gold/20" : 
                    isCompleted ? "bg-emerald-500/[0.02] border-emerald-500/10 text-emerald-400/50" :
                    "bg-transparent border-white/5 text-slate-800 opacity-20"
                  )}
                >
                  <div className={cn(
                    "w-[2rem] h-[2rem] rounded-full flex items-center justify-center shrink-0 font-black text-[0.625rem] border transition-all",
                    isActive ? "bg-gold text-black border-gold shadow-[0_0_1rem_rgba(212,175,55,0.4)]" : 
                    isCompleted ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "border-white/5"
                  )}>
                    {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "font-bold text-[0.6875rem] uppercase tracking-wider truncate",
                        isActive ? "text-white" : isCompleted ? "text-emerald-400/60" : "text-slate-600"
                      )}>{s.title}</p>
                      {isLocked && !isCompleted && <Lock size={10} className="text-slate-700" />}
                      {isCompleted && <ShieldCheck size={10} className="text-emerald-500/50" />}
                    </div>
                    <p className="text-[0.5rem] font-medium uppercase tracking-widest opacity-40 mt-[0.25rem]">
                      {isCompleted ? 'Completed' : isActive ? 'Current Step' : 'Scheduled'}
                    </p>
                  </div>
                  
                  <AnimatePresence>
                    {lockedStepMessage === idx && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-[1rem] z-20 rounded-[1.5rem]"
                      >
                         <span className="text-[0.5rem] font-black text-gold uppercase tracking-[0.4em] flex items-center gap-2">
                           <Lock size={10} /> Step Locked
                         </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Step Content Details */}
        <div className="flex-1 p-[3rem] overflow-y-auto relative min-w-0 bg-black/5" role="main">
          <AnimatePresence mode="wait">
            {showSummary ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-[48rem] mx-auto min-h-full flex flex-col items-center justify-center text-center py-[5rem]"
              >
                <div className="w-[5rem] h-[5rem] rounded-[2rem] active-step text-white flex items-center justify-center mb-[2rem] shadow-[0_1rem_3rem_rgba(212,175,55,0.3)]">
                   <Target size={32} />
                </div>
                <h2 className="text-[1.5rem] font-black text-slate-100 mb-[1rem] tracking-tight uppercase">Strategic De-briefing</h2>
                <div className="p-[2.5rem] rounded-[3rem] gold-glass border-gold/20 mb-[2.5rem] w-full text-left space-y-6">
                   <div>
                     <p className="text-[0.625rem] font-black text-gold uppercase tracking-[0.4em] mb-[0.75rem] flex items-center gap-2">
                       <ShieldCheck size={14} /> Identity Verified: What You Learned
                     </p>
                     <p className="text-[0.9375rem] text-slate-200 leading-relaxed font-medium italic">
                       "{step.whatLearned}"
                     </p>
                   </div>

                   <div className="pt-6 border-t border-gold/10">
                     <p className="text-[0.625rem] font-black text-blue-400 uppercase tracking-[0.4em] mb-[0.75rem] flex items-center gap-2">
                       <Info size={14} /> Why This Step Matters
                     </p>
                     <p className="text-[0.875rem] text-slate-400 leading-relaxed font-medium">
                       {step.whyItMatters}
                     </p>
                   </div>

                   <div className="pt-6 border-t border-gold/10">
                     <p className="text-[0.625rem] font-black text-emerald-400 uppercase tracking-[0.4em] mb-[0.75rem] flex items-center gap-2">
                       <ArrowRight size={14} /> What Happens Next
                     </p>
                     <p className="text-[0.875rem] text-slate-400 leading-relaxed font-medium">
                       {ROLE_FLOWS[role][currentIndex + 1] 
                         ? `Moving to Phase: ${ELECTION_PROCESS_DATA[ROLE_FLOWS[role][currentIndex + 1]].title}. Your credentials will be cross-referenced for node-level parity.`
                         : "Journey complete. All cryptographic proof-of-vote records have been synchronized."}
                     </p>
                   </div>

                   <button 
                     onClick={() => addAssistantMessage?.(`Can you explain more about ${step.title} and the importance of ${step.whatLearned}?`, 'standard')}
                     className="flex items-center gap-2 text-[0.6rem] font-black text-gold/60 uppercase tracking-widest hover:text-gold transition-colors pt-4"
                   >
                     <Bot size={12} /> Deep-Dive with Assistant
                   </button>
                </div>
                <button 
                  onClick={proceedToNextStep}
                  className="px-[3rem] py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] flex items-center gap-[1rem] gold-glow transition-all hover:scale-105"
                >
                  Proceed to Next Phase <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentStepId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[48rem] mx-auto min-h-full flex flex-col pb-[5rem]"
            >
                <div className="flex justify-between items-center mb-[2.5rem] shrink-0">
                   <h5 className="text-[0.625rem] font-black text-gold uppercase tracking-[0.3em]">Step {currentIndex + 1} of {flowIds.length}</h5>
                   <div className="px-[1rem] py-[0.375rem] rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[0.5625rem] font-black uppercase tracking-[0.2em] flex items-center gap-[0.5rem] shrink-0">
                      Phase: {step.phase}
                   </div>
                </div>

              <h3 className="text-fluid-h3 font-black text-slate-100 mb-[1.5rem] tracking-tight uppercase leading-none break-words shrink-0">
                {step.title}
              </h3>

              <div className="grid gap-[3rem] min-w-0 flex-1">
                {/* WHAT TO DO */}
                <div className="space-y-[1.25rem] min-w-0 h-fit">
                   <div className="flex items-center gap-[0.75rem] shrink-0">
                     <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20">
                        <Zap size={14} />
                     </div>
                     <h4 className="text-[0.75rem] font-black uppercase tracking-widest text-slate-200">What to do</h4>
                   </div>
                   <div className="p-[2rem] rounded-[2.5rem] glass border-white/5 bg-white/2 hover:bg-white/5 transition-colors">
                      <p className="text-fluid-base text-slate-300 leading-relaxed font-medium break-words mb-[1.5rem]">
                        {step.whatToDo}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] pt-[1.5rem] border-t border-white/5">
                        <div className="space-y-[1rem]">
                          <h5 className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-[0.5rem]">
                            <FileText size={12} className="text-gold" />
                            Required Documents
                          </h5>
                          <ul className="space-y-[0.75rem]">
                             {step.requiredDocs.map((doc, i) => (
                               <li key={i} className="flex items-center gap-[0.75rem] text-[0.6875rem] font-bold text-slate-400">
                                 <div className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                                 {doc}
                               </li>
                             ))}
                          </ul>
                        </div>
                        <div className="space-y-[1rem]">
                          <h5 className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-[0.5rem]">
                            <Clock size={12} className="text-gold" />
                            Estimated Time
                          </h5>
                          <p className="text-[0.875rem] font-black text-gold uppercase tracking-wider">{step.estimatedTime}</p>
                        </div>
                      </div>
                   </div>
                </div>

                {/* SIMULATION LAYER (Enhanced Interactive Support) */}
                {(currentStepId === 'voter-reg' || currentStepId === 'voter-verify' || currentStepId === 'voter-prep' || currentStepId === 'voter-vote' || currentStepId === 'voter-results' || currentStepId === 'cand-file' || currentStepId === 'cand-verify' || currentStepId === 'cand-approval' || currentStepId.startsWith('vol-')) && (
                  <div className="space-y-[1.25rem] min-w-0 h-fit">
                    <div className="flex items-center gap-[0.75rem] shrink-0">
                      <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
                          <Zap size={14} />
                      </div>
                      <h4 className="text-[0.75rem] font-black uppercase tracking-widest text-slate-200">Interactive Simulation</h4>
                    </div>
                    {currentStepId === 'voter-reg' && <VoterRegistrationForm onComplete={handleNext} addAssistantMessage={addAssistantMessage} />}
                    {currentStepId === 'cand-file' && <CandidateFilingForm onComplete={handleNext} addAssistantMessage={addAssistantMessage} />}
                    {currentStepId === 'cand-verify' && <ComplianceAuditSim onComplete={handleNext} candidateData={candidateData} addAssistantMessage={addAssistantMessage} />}
                    {currentStepId === 'cand-approval' && <CandidateApprovalSim onComplete={() => handleNext({})} candidateData={candidateData} addAssistantMessage={addAssistantMessage} />}
                    {currentStepId === 'voter-verify' && <IdentityVerifier onComplete={handleNext} registrationData={registrationData} addAssistantMessage={addAssistantMessage} />}
                    {currentStepId === 'voter-prep' && <BallotGenerator onComplete={handleNext} registrationData={registrationData} addAssistantMessage={addAssistantMessage} />}
                    
                    {/* Volunteer Simulation Sequence */}
                    {currentStepId === 'vol-training' && <VolunteerTrainingSim onComplete={handleNext} addAssistantMessage={addAssistantMessage} />}
                    {currentStepId === 'vol-assign' && <VolunteerAssignmentSim onComplete={handleNext} volunteerData={volunteerData} addAssistantMessage={addAssistantMessage} />}
                    {currentStepId === 'vol-booth' && <VolunteerLiveBoothSim onComplete={handleNext} volunteerData={volunteerData} addAssistantMessage={addAssistantMessage} />}
                    {currentStepId === 'vol-closing' && <VolunteerClosingSim onComplete={handleNext} volunteerData={volunteerData} addAssistantMessage={addAssistantMessage} onReset={onReset} />}

                    {currentStepId === 'voter-vote' && (
                      <PollingBoothSim 
                        onComplete={handleNext} 
                        electionId={electionId}
                        addAssistantMessage={addAssistantMessage}
                      />
                    )}
                    {currentStepId === 'voter-results' && (
                      <VoterResults 
                        registrationData={registrationData}
                        electionId={electionId}
                        trackingId={trackingId}
                        onComplete={handleNext}
                        addAssistantMessage={addAssistantMessage}
                      />
                    )}
                  </div>
                )}

                {/* WHY IT MATTERS */}
                <div className="space-y-[1.25rem] min-w-0 h-fit">
                   <div className="flex items-center gap-[0.75rem] shrink-0">
                     <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                        <Info size={14} />
                     </div>
                     <h4 className="text-[0.75rem] font-black uppercase tracking-widest text-slate-200">Guidance & Context</h4>
                   </div>
                   <div className="p-[2rem] sm:p-[2.5rem] rounded-[2rem] sm:rounded-[2.5rem] glass border-emerald-500/10 bg-emerald-500/[0.02] w-full min-w-0">
                      <p className="text-fluid-base text-emerald-100/70 leading-relaxed italic font-medium break-words">
                        "{step.whyItMatters}"
                      </p>
                   </div>
                </div>

              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
