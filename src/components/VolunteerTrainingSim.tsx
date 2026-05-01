import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Fingerprint,
  Users,
  Shield,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

interface VolunteerTrainingSimProps {
  onComplete: (data: any) => void;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

const MODULES = [
  { id: 'ethics', title: 'Ethical Guidelines', content: 'As a volunteer, you must remain neutral at all times. No political symbols, slogans, or biased assistance is permitted within the 100-meter exclusion zone.' },
  { id: 'security', title: 'Data Privacy', content: 'Voter data is cryptographically salted. You will only see the minimum necessary info to verify identity. Shared IDs or tokens are strictly forbidden.' },
  { id: 'ops', title: 'Crisis Response', content: 'In case of node failure or network sync issues, stay calm. Use the emergency paper ledger protocol and notify your supervisor immediately.' }
];

const QUIZ_QUESTIONS = [
  {
    q: "What should you do if a voter is not found in the list?",
    options: ["Allow anyway", "Reject immediately", "Escalate to supervisor"],
    correct: 2,
    category: 'Decision',
    explanation: "Standard protocol requires escalation. Never allow an unverified voter, and never reject without a supervisor's secondary audit of the node registry."
  },
  {
    q: "If two voters claim the same identity, how should you proceed?",
    options: ["Allow both", "Reject both", "Escalate verification"],
    correct: 2,
    category: 'Decision',
    explanation: "This is a potential identity conflict. Escalate immediately to the security tier to perform a multi-factor biometric check."
  },
  {
    q: "What is your primary role as an election volunteer?",
    options: ["Influence voters", "Assist neutrally", "Decide votes"],
    correct: 1,
    category: 'Ethics',
    explanation: "Neutrality is the cornerstone of public trust. You are there to facilitate the process, not to influence the outcome."
  },
  {
    q: "If a voter appears confused about the ballot layout, what is the correct response?",
    options: ["Ignore them", "Guide neutrally", "Suggest a candidate"],
    correct: 1,
    category: 'Communication',
    explanation: "Explain the interface and layout neutrally. Never mention specific candidates or parties during the guidance."
  },
  {
    q: "Are you permitted to share or discuss a voter's choices with others?",
    options: ["Yes, for data tracking", "No, never"],
    correct: 1,
    category: 'Ethics',
    explanation: "The secret ballot is absolute. Discussing voter choices is a severe violation of regional privacy laws and electoral integrity."
  },
  {
    q: "What is the protocol if a secondary polling system fails?",
    options: ["Stop the process", "Follow fallback procedure"],
    correct: 1,
    category: 'Process',
    explanation: "Redundancy is built-in. Follow the pre-defined fallback procedure to ensure voting continues without compromising verification."
  },
  {
    q: "In the event of queue overload, what is the best strategy?",
    options: ["Panic and rush", "Redirect and manage flow"],
    correct: 1,
    category: 'Process',
    explanation: "Calmly redirect voters to less busy nodes or manage the line flow to prevent bottlenecks and system strain."
  },
  {
    q: "If a duplicate voting attempt is detected, what should you do?",
    options: ["Allow it if they have ID", "Block and report immediately"],
    correct: 1,
    category: 'Decision',
    explanation: "Duplicate attempts trigger a high-priority alert. Block the transaction and report the event to the node supervisor."
  },
  {
    q: "Can volunteers wear clothing or promote specific candidates?",
    options: ["Yes, if off-duty", "No, it is strictly forbidden"],
    correct: 1,
    category: 'Ethics',
    explanation: "To maintain neutrality, any promotional material or biased clothing is strictly prohibited within the election exclusion zone."
  },
  {
    q: "What is the most important factor in election operations?",
    options: ["Speed of processing", "Accuracy and fairness"],
    correct: 1,
    category: 'Ethics',
    explanation: "While efficiency matters, accuracy and fairness are the primary metrics. A fast election is worthless if it is not accurate."
  }
];

export default function VolunteerTrainingSim({ onComplete, addAssistantMessage }: VolunteerTrainingSimProps) {
  const [stage, setStage] = useState<'modules' | 'quiz' | 'results' | 'nda' | 'id'>('modules');
  const [currentMod, setCurrentMod] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasSigned, setHasSigned] = useState(false);

  // Stats
  const calculateResults = () => {
    let score = 0;
    const categoryStats: Record<string, { correct: number, total: number }> = {};

    QUIZ_QUESTIONS.forEach((q, i) => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0 };
      }
      categoryStats[q.category].total += 1;
      if (answers[i] === q.correct) {
        score += 1;
        categoryStats[q.category].correct += 1;
      }
    });

    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    let eligibility: 'Approved' | 'Training Required' | 'Not Approved' = 'Not Approved';
    if (percentage >= 85) eligibility = 'Approved';
    else if (percentage >= 70) eligibility = 'Training Required';

    return { score, total: QUIZ_QUESTIONS.length, percentage, categoryStats, eligibility };
  };

  const results = answers.length === QUIZ_QUESTIONS.length ? calculateResults() : null;

  const handleNextMod = () => {
    if (currentMod < MODULES.length - 1) {
      setCurrentMod(prev => prev + 1);
      if (addAssistantMessage) {
        addAssistantMessage(`Moving to Module ${currentMod + 2}: ${MODULES[currentMod + 1].title}. Study carefully—this will be on the final assessment.`);
      }
    } else {
      setStage('quiz');
      if (addAssistantMessage) {
        addAssistantMessage("Training complete. Starting your eligibility assessment. Accuracy and ethics are the primary criteria.", 'guidance');
      }
    }
  };

  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    const q = QUIZ_QUESTIONS[answers.length];
    const isCorrect = idx === q.correct;
    setSelectedIdx(idx);
    setShowFeedback(true);

    if (addAssistantMessage) {
        if (isCorrect) {
            addAssistantMessage(`${q.category} check: Correct. Your judgment aligns with official regional protocols.`, 'success');
        } else {
            addAssistantMessage(`${q.category} conflict: Incorrect. Regional protocol dictates: ${q.options[q.correct]}.`, 'alert');
        }
    }
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, selectedIdx as number];
    setAnswers(newAnswers);
    setShowFeedback(false);
    setSelectedIdx(null);
    
    if (newAnswers.length === QUIZ_QUESTIONS.length) {
      setStage('results');
      if (addAssistantMessage) addAssistantMessage("Assessment finalized. I'm evaluating your performance against simulation benchmarks.");
    } else {
        if (addAssistantMessage) {
            const nextQ = QUIZ_QUESTIONS[newAnswers.length];
            addAssistantMessage(`Next scenario: Category ${nextQ.category}. Analyze the situation carefully.`);
        }
    }
  };

  const signAndFinish = () => {
    const volId = `VOL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setStage('id');
    if (addAssistantMessage) addAssistantMessage(`NDA signed. Generating your official Volunteer ID: ${volId}. Welcome to the team!`, 'success');
    setTimeout(() => {
        onComplete({ 
          volunteerId: volId, 
          status: 'Certified', 
          certifiedAt: new Date().toISOString(),
          quizResults: results
        });
    }, 3000);
  };

  const getAIFeedback = () => {
    if (!results) return "";
    if (results.eligibility === 'Approved') return "Exceptional performance documented. Your ethical alignment and process accuracy meet the criteria for Level 1 Node Deployment. Certification authorized.";
    if (results.eligibility === 'Training Required') return "Adequate baseline, but critical gaps in Crisis Response detected. Supplemental training modules have been unlocked. Please review before field deployment.";
    return "Operational integrity alignment failed. Your responses indicate risk profiles outside acceptable regional variance. Re-testing is mandatory after deep-study of the Election NDA.";
  };

  return (
    <div className="w-full max-w-[40rem] mx-auto">
      <AnimatePresence mode="wait">
        {stage === 'modules' && (
          <motion.div
            key="modules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-[2rem] p-[2.5rem] border-white/5 space-y-[2rem]"
          >
            <div className="flex items-center gap-[1rem]">
              <div className="w-[3rem] h-[3rem] rounded-[1rem] bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-[1rem] font-black text-white uppercase tracking-widest">Core Training Modules</h3>
                <p className="text-[0.625rem] text-slate-500 font-bold uppercase tracking-widest">Protocol {currentMod + 1} of {MODULES.length}</p>
              </div>
            </div>

            <div className="p-[2rem] rounded-[1.5rem] bg-white/5 border border-white/5">
              <h4 className="text-[0.875rem] font-black text-gold mb-4 uppercase tracking-wider">{MODULES[currentMod].title}</h4>
              <p className="text-[0.75rem] text-slate-300 leading-relaxed font-medium">{MODULES[currentMod].content}</p>
            </div>

            <button
              onClick={handleNextMod}
              className="w-full py-[1.25rem] rounded-[1.5rem] bg-white text-black text-[0.75rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-[0.75rem] hover:bg-slate-200 transition-all"
            >
              {currentMod < MODULES.length - 1 ? 'Next Module' : 'Start Assessment'}
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {stage === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[2rem] p-[2.5rem] border-white/5 space-y-[2rem]"
          >
            <div className="flex items-center gap-[1rem]">
              <div className="w-[3rem] h-[3rem] rounded-[1rem] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="text-[1rem] font-black text-white uppercase tracking-widest">Eligibility Quiz</h3>
                <p className="text-[0.625rem] text-slate-500 font-bold uppercase tracking-widest">Question {answers.length + 1} of {QUIZ_QUESTIONS.length}</p>
              </div>
            </div>

            <div className="space-y-[1.5rem]">
               <h4 className="text-[0.875rem] font-bold text-slate-100 leading-relaxed">{QUIZ_QUESTIONS[answers.length].q}</h4>
               <div className="grid gap-[0.75rem]">
                  {QUIZ_QUESTIONS[answers.length].options.map((opt, i) => {
                    const isCorrect = i === QUIZ_QUESTIONS[answers.length].correct;
                    const isSelected = i === selectedIdx;
                    
                    return (
                      <button
                        key={i}
                        disabled={showFeedback}
                        onClick={() => handleAnswer(i)}
                        className={cn(
                          "w-full text-left p-[1.25rem] rounded-[1.25rem] border transition-all text-[0.75rem] font-medium",
                          !showFeedback && "bg-white/5 border-white/5 hover:border-gold/30 hover:bg-gold/5 text-slate-300 hover:text-white",
                          showFeedback && isCorrect && "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
                          showFeedback && isSelected && !isCorrect && "bg-red-500/10 border-red-500/30 text-red-400",
                          showFeedback && !isSelected && !isCorrect && "opacity-30 border-white/5 text-slate-500"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {showFeedback && isCorrect && <CheckCircle2 size={16} />}
                        </div>
                      </button>
                    );
                  })}
               </div>

               {showFeedback && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-6 animate-in fade-in slide-in-from-top-4"
                 >
                    <div className={cn(
                      "p-5 rounded-[1.5rem] border",
                      selectedIdx === QUIZ_QUESTIONS[answers.length].correct 
                        ? "bg-emerald-500/5 border-emerald-500/10" 
                        : "bg-red-500/5 border-red-500/10"
                    )}>
                      <p className="text-[0.625rem] font-black uppercase tracking-[0.2em] mb-2 text-slate-500">Protocol Explanation</p>
                      <p className="text-[0.75rem] text-slate-200 leading-relaxed italic">
                        "{QUIZ_QUESTIONS[answers.length].explanation}"
                      </p>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="w-full py-4 rounded-[1.25rem] bg-white text-black text-[0.7rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                    >
                      {answers.length === QUIZ_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'}
                      <ArrowRight size={14} />
                    </button>
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}

        {stage === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] p-[2.5rem] border-white/5 space-y-8"
          >
            <div className="text-center space-y-2">
               <h3 className="text-[1.25rem] font-black text-white uppercase tracking-tight">Assessment Summary</h3>
               <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                     <p className="text-[0.5rem] text-slate-500 uppercase font-black tracking-widest mb-1">Score</p>
                     <span className="text-[1.5rem] font-black text-white leading-none">{results.score}/{results.total}</span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-center">
                     <p className="text-[0.5rem] text-slate-500 uppercase font-black tracking-widest mb-1">Percentage</p>
                     <span className={cn(
                       "text-[1.5rem] font-black leading-none",
                       results.percentage >= 80 ? "text-emerald-400" : results.percentage >= 60 ? "text-gold" : "text-red-400"
                     )}>{results.percentage}%</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[0.625rem] font-black text-slate-500 uppercase tracking-widest ml-2">Category Performance</h4>
               <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(results.categoryStats).map(([cat, stat]) => (
                    <div key={cat} className="p-4 rounded-[1.25rem] bg-white/5 border border-white/5 flex items-center justify-between">
                       <span className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider">{cat}</span>
                       <span className="text-[0.625rem] font-black text-white">{stat.correct}/{stat.total}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-5 rounded-[1.5rem] bg-gold/5 border border-gold/20 flex items-start gap-4">
               <Zap size={18} className="text-gold shrink-0 mt-0.5" />
               <div className="space-y-1">
                  <span className="text-[0.625rem] font-black text-gold uppercase tracking-[0.2em]">AI Decision Support</span>
                  <p className="text-[0.6875rem] text-slate-300 font-medium italic leading-relaxed">"{getAIFeedback()}"</p>
               </div>
            </div>

            {results.eligibility !== 'Not Approved' ? (
              <div className="space-y-4">
                 <button
                   onClick={() => setStage('nda')}
                   className="w-full py-[1.25rem] rounded-[1.5rem] bg-white text-black text-[0.75rem] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
                 >
                   {results.eligibility === 'Approved' ? 'Proceed to NDA' : 'Continue Training'}
                 </button>
                 <button 
                   onClick={() => addAssistantMessage?.(`Tell me more about the ${results.eligibility} status and what I should focus on.`, 'standard')}
                   className="w-full flex items-center justify-center gap-2 text-[0.5rem] font-black text-slate-500 uppercase tracking-widest hover:text-gold transition-colors"
                 >
                    <HelpCircle size={12} /> Ask Assistant for detailed debriefing
                 </button>
              </div>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full py-[1.25rem] rounded-[1.5rem] bg-red-500 text-white text-[0.75rem] font-black uppercase tracking-[0.2em] shadow-xl"
              >
                Return to Roles
              </button>
            )}
          </motion.div>
        )}

        {stage === 'nda' && (
          <motion.div
            key="nda"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[2rem] p-[2.5rem] border-white/5 space-y-[2rem]"
          >
            <div className="text-center space-y-4">
              <ShieldCheck size={32} className="text-emerald-500 mx-auto" />
              <h3 className="text-[1.25rem] font-black text-white uppercase tracking-tight">Certification Readiness</h3>
              <p className="text-[0.75rem] text-slate-500 font-medium max-w-[20rem] mx-auto">You matched our performance profiles. Finalize your deployment by signing the Integrity Agreement.</p>
            </div>

            <div className="p-[1.5rem] bg-black/40 rounded-[1.5rem] border border-white/5 max-h-[10rem] overflow-y-auto">
               <p className="text-[0.5rem] text-slate-600 font-mono leading-relaxed">
                 I hereby swear to uphold the principles of non-partisan election supervision. I acknowledge that any attempt to influence, manipulate, or compromise the integrity of the vote counts or voter privacy will result in immediate termination and legal action. I understand my role is of the highest public trust...
               </p>
            </div>

            <label className="flex items-center gap-[1rem] cursor-pointer group">
               <div className={cn(
                 "w-[1.25rem] h-[1.25rem] rounded-md border flex items-center justify-center transition-all",
                 hasSigned ? "bg-gold border-gold text-black" : "border-white/20 bg-white/5"
               )}>
                 <input 
                   type="checkbox" 
                   className="hidden" 
                   checked={hasSigned} 
                   onChange={(e) => setHasSigned(e.target.checked)} 
                 />
                 {hasSigned && <CheckCircle2 size={12} />}
               </div>
               <span className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-200">I accept the Integrity Agreement</span>
            </label>

            <button
              disabled={!hasSigned}
              onClick={signAndFinish}
              className="w-full py-[1.25rem] rounded-[1.5rem] bg-emerald-500 text-black text-[0.75rem] font-black uppercase tracking-[0.2em] shadow-[0_1rem_2rem_rgba(16,185,129,0.2)] disabled:opacity-30 disabled:shadow-none transition-all"
            >
              Issue Volunteer ID
            </button>
          </motion.div>
        )}

        {stage === 'id' && (
          <motion.div
            key="id"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[2.5rem] p-[3rem] border-gold/30 shadow-[0_0_4rem_rgba(212,175,55,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[15rem] h-[15rem] bg-gold/5 blur-[5rem] rounded-full -mr-[5rem] -mt-[5rem]" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Shield size={32} className="text-gold" />
                    <div>
                       <h4 className="text-[1.25rem] font-black text-white uppercase tracking-tighter">Certified</h4>
                       <p className="text-[0.5rem] text-gold font-bold uppercase tracking-[0.3em]">Election Official Token</p>
                    </div>
                 </div>
                 <div className="w-[4rem] h-[4rem] rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
                    <Users size={24} />
                 </div>
              </div>

              <div className="bg-black/60 p-[2rem] rounded-[2rem] border border-white/5 text-center">
                 <span className="block text-[0.5rem] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Unique Identifier</span>
                 <h2 className="text-[2rem] font-black text-white tracking-[0.2em] font-mono">
                   {Math.random().toString(36).substr(2, 6).toUpperCase()}
                 </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3">
                    <Fingerprint size={16} className="text-gold/40" />
                    <span className="text-[0.625rem] text-slate-500 font-bold uppercase">Biometrics Locked</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gold/40" />
                    <span className="text-[0.625rem] text-slate-500 font-bold uppercase">Valid: 2026 Cycle</span>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
