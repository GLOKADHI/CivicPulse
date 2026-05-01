import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Map as MapIcon, 
  Clock, 
  ShieldCheck, 
  Info,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Monitor,
  MapPin,
  Lock,
  Cpu,
  Activity,
  Zap,
  TrendingUp,
  BrainCircuit,
  Settings,
  Bell,
  Bot,
  Target
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { UserRole, ELECTION_PROCESS_DATA, ROLE_FLOWS, PHASE_CONFIG } from '../constants/election';
import AIChat from './AIChat';
import ProcessTimeline from './ProcessTimeline';
import PollingBoothSim from './PollingBoothSim';
import MapComp from './MapComp';
import GoogleMapsEmbed from './GoogleMapsEmbed';
import AlertsPanel from './AlertsPanel';
import SettingsPanel from './SettingsPanel';
import { cn } from '../lib/utils';
import { Message, AssistantEvent } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { logUserJourney } from '../services/firestore';
import { logAnalyticsEvent } from '../lib/firebase';

interface DashboardProps {
  role: UserRole;
  onReset: () => void;
  onRoleChange: (newRole: UserRole) => void;
}

const MOCK_ANAYLTICS = [
  { value: 45 }, { value: 52 }, { value: 61 }, { value: 58 }, { value: 72 }, { value: 85 }, { value: 81 }, { value: 94 }
];

export default function Dashboard({ role, onReset, onRoleChange }: DashboardProps) {
  const { t } = useSettings();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'journey' | 'ai' | 'map' | 'locations'>('journey');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Log Journey Start
  React.useEffect(() => {
    logUserJourney(user?.uid, role, 'initialization', 'dashboard_loaded');
    logAnalyticsEvent('journey_start', { role, userId: user?.uid });
  }, [role, user]);

  // Log Tab Changes
  React.useEffect(() => {
    logUserJourney(user?.uid, role, 'navigation', `tab_switched_${activeTab}`);
    logAnalyticsEvent('tab_switch', { role, tab: activeTab });
  }, [activeTab]);

  // Assistant State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'default-1',
      role: 'model',
      timestamp: Date.now(),
      content: `System Initialized. I am your CivicPulse Assistant. I'll guide you through each step of the ${role} journey. How can I help?`,
      type: 'standard'
    }
  ]);

  const addAssistantMessage = (content: string, type: Message['type'] = 'standard') => {
    setMessages(prev => {
      // Prevent duplicate identical system-generated messages
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.role === 'model' && lastMessage.content === content) {
        return prev;
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        role: 'model',
        timestamp: Date.now(),
        content,
        type
      }];
    });
  };

  // Automated Guidance Logic
  React.useEffect(() => {
    const step = ELECTION_PROCESS_DATA[ROLE_FLOWS[role][currentIndex]];
    if (!step) return;

    const guidance = {
      'voter-reg': `Phase: ${step.phase.toUpperCase()}. Establish your identity on the civic ledger. We've detected no previous entries for your biometric profile.`,
      'voter-verify': "Auditing credentials. Our system checks for node-level consistency and prevents double-registration.",
      'voter-vote': "Polling station lock-on established. Proceed with official ID for final biometric gating.",
      'cand-file': "Candidacy protocols active. Ensure asset disclosures are cryptographically precise.",
      'vol-training': "Training initialized. Ethics and operational protocols must be indexed to your profile.",
      'voter-results': "Final tally phase. Your anonymous audit trail will confirm vote inclusion."
    }[step.id];

    if (guidance) {
      addAssistantMessage(guidance, 'guidance');
    }
  }, [currentIndex, role]);

  // Reactive Interaction Handler
  const handleActionPerformance = (action: string, status: 'success' | 'alert') => {
    const messages = {
      success: [
        "Protocol match. Identity integrity confirmed.",
        "Node synchronization successful.",
        "Cryptographic proof-of-action recorded."
      ],
      alert: [
        "Sequence deviation detected. Please follow official guidelines.",
        "Validation mismatch. Review your input credentials.",
        "Access restricted. Ensure prerequisites are met."
      ]
    };
    const pool = messages[status];
    addAssistantMessage(pool[Math.floor(Math.random() * pool.length)], status);
  };

  // Elevated Sim State
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [candidateAuditResult, setCandidateAuditResult] = useState<any>(null);
  const [volunteerData, setVolunteerData] = useState<any>({});
  const [electionId, setElectionId] = useState<string>('');
  const [ballotPdfUrl, setBallotPdfUrl] = useState<string>('');
  const [trackingId, setTrackingId] = useState<string>('');

  const flowIds = ROLE_FLOWS[role];
  const currentIndexValid = Math.min(currentIndex, flowIds.length - 1);
  const currentStep = ELECTION_PROCESS_DATA[flowIds[currentIndexValid]];
  const globalProgress = Math.round((completedIndices.length / flowIds.length) * 100);

  const getStepTip = () => {
    switch(currentStep.id) {
       case 'voter-reg': return "Deadlines vary by region. Check your local cut-off date immediately.";
       case 'voter-verify': return "Secure verification ensures your identity is protected and unique.";
       case 'voter-prep': return "Sample ballots are personalized based on your registered residential address.";
       case 'voter-vote': return "Bring your official identification to ensure smooth validation at the booth.";
       case 'voter-results': return "Tracking IDs are anonymous and secure for your privacy.";
       default: return "Initializing non-partisan guidance information...";
    }
  };

  const tabs = [
    { id: 'journey', label: t('electionJourney'), icon: Clock, progress: globalProgress },
    { id: 'ai', label: t('electionAssistant'), icon: MessageSquare, progress: 100 },
    { id: 'map', label: t('pollingMap'), icon: MapIcon, progress: 85 },
    { id: 'locations', label: t('findLocations') || 'Locations', icon: MapPin, progress: 90 },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-gold/30 bg-[#05070a] relative overflow-hidden">
      {/* Subtle Background Grid/Particles */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      {/* Header */}
      <header className="z-[60] px-[2.5rem] py-[1.5rem] flex items-center justify-between sticky top-0 backdrop-blur-xl border-b border-white/5 shrink-0 bg-black/40 interaction-ready">
        <div className="flex items-center gap-[2.5rem]">
          <button 
            onClick={onReset}
            className="p-[0.75rem] glass hover:bg-gold/10 rounded-[1rem] transition-all text-slate-500 hover:text-gold border border-white/5 group overflow-hidden relative"
            aria-label="Return to Identity Phase"
            title="Return to Identity Phase"
          >
            <ArrowLeft size={18} className="relative z-10 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="flex items-center gap-[1.25rem]">
            <div className="w-[3.5rem] h-[3.5rem] flex items-center justify-center">
              <img src="/images/logo.png" alt="CivicPulse Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-[1.25rem] tracking-[0.2em] uppercase leading-none">{t('appName')}</h1>
              <div className="flex items-center gap-[0.5rem] mt-[0.5rem]">
                <span className="text-[0.5625rem] font-bold uppercase tracking-[0.3em] text-gold/80">{role} {t('assistant')}</span>
                <div className="w-[0.25rem] h-[0.25rem] rounded-full bg-slate-800" />
                <span className="text-[0.5625rem] font-medium uppercase tracking-[0.3em] text-slate-500">{t('liveInfo')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flow Indicator - Unified Phase Tracking */}
        <div className="hidden lg:flex items-center gap-[0.75rem]">
          {PHASE_CONFIG.map((phase, i) => {
            const isCurrentPhase = currentStep.phase === phase.id;
            const isPastPhase = PHASE_CONFIG.findIndex(p => p.id === currentStep.phase) > i;
            const isFuturePhase = !isCurrentPhase && !isPastPhase;

            const handlePhaseClick = () => {
              if (isFuturePhase) {
                addAssistantMessage(`Chronological skip restricted. The ${phase.label} phase requires prior node validation.`, 'alert');
                return;
              }
              const firstStepIdx = flowIds.findIndex(id => ELECTION_PROCESS_DATA[id].phase === phase.id);
              if (firstStepIdx !== -1) {
                setCurrentIndex(firstStepIdx);
                addAssistantMessage(`Switching focus to ${phase.label} phase. Protocols loaded.`, 'guidance');
              }
            };

            return (
              <React.Fragment key={phase.id}>
                 <button 
                   onClick={handlePhaseClick}
                   disabled={isFuturePhase}
                   className={cn(
                   "flex items-center gap-[0.75rem] px-[1.25rem] py-[0.5rem] rounded-full border transition-all shrink-0 hover:scale-105 active:scale-95 disabled:hover:scale-100",
                   isCurrentPhase ? "bg-gold/10 border-gold/20 text-gold shadow-[0_0_1rem_rgba(212,175,55,0.1)]" : 
                   isPastPhase ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                   "opacity-20 border-white/5 text-slate-500"
                 )}>
                   <div className={cn(
                     "w-[1.25rem] h-[1.25rem] rounded-full flex items-center justify-center text-[0.625rem] font-black border shrink-0",
                     isCurrentPhase ? "bg-gold text-black border-gold" : 
                     isPastPhase ? "bg-emerald-500 text-black border-emerald-500" : 
                     "border-white/20"
                   )}>
                     {isPastPhase ? <ShieldCheck size={10} /> : i + 1}
                   </div>
                   <div className="flex flex-col text-left">
                     <span className="text-[0.625rem] font-black uppercase tracking-widest whitespace-nowrap">{phase.label}</span>
                     <span className="text-[0.4rem] font-bold uppercase tracking-widest opacity-60 mt-0.5">{phase.deadline}</span>
                   </div>
                 </button>
                 {i < PHASE_CONFIG.length - 1 && <div className="w-[1.5rem] h-[0.0625rem] bg-white/5 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-[1.5rem]">
           {/* Real-time Vitals Display */}
           <div className="hidden xl:flex flex-col text-right mr-4">
              <span className="text-[0.4375rem] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Network Integrity</span>
              <div className="flex items-center gap-1.5 justify-end">
                 <div className="flex gap-[1px]">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-[2px] h-3 rounded-full bg-emerald-500/40" />)}
                 </div>
                 <span className="text-[0.625rem] font-black text-emerald-400 font-mono">99.9%</span>
              </div>
           </div>
           
           <div className="flex items-center gap-[1rem]">
              <button 
                onClick={() => { setShowAlerts(!showAlerts); setShowSettings(false); }}
                aria-label="Toggle Election Alerts"
                className={cn(
                  "p-[0.75rem] glass rounded-[1rem] transition-all relative",
                  showAlerts ? "text-gold bg-gold/10 border-gold/40" : "text-slate-500 hover:text-gold"
                )}
              >
                <Bell size={18} />
                <div className="absolute top-[0.625rem] right-[0.625rem] w-1.5 h-1.5 bg-gold rounded-full border-2 border-black" />
              </button>
              <button 
                onClick={() => { setShowSettings(!showSettings); setShowAlerts(false); }}
                aria-label="Toggle Assistant Settings"
                className={cn(
                  "p-[0.75rem] glass rounded-[1rem] transition-all",
                  showSettings ? "text-gold bg-gold/10 border-gold/40" : "text-slate-500 hover:text-gold"
                )}
              >
                <Settings size={18} />
              </button>
           </div>
        </div>
      </header>

      <AnimatePresence>
        {showAlerts && (
          <AlertsPanel isOpen={showAlerts} onClose={() => setShowAlerts(false)} />
        )}
        {showSettings && (
          <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      <main 
        className="flex-1 w-full max-w-[140rem] mx-auto p-[2rem] h-full min-h-0 grid grid-cols-1 md:grid-cols-[260px_minmax(400px,1fr)] [@media(min-width:1100px)]:grid-cols-[260px_minmax(500px,1fr)_300px] gap-[3rem] overflow-hidden"
      >
        
        {/* SIDEBAR: SUPPORTIVE NAV - Hidden on Mobile (<768px) */}
        <div className="hidden md:flex flex-col gap-[2rem] min-w-0 h-full overflow-hidden shrink-0 relative z-50 interaction-ready">
          <div className="glass rounded-[2rem] p-[0.75rem] border-white/5 flex-1 flex flex-col overflow-hidden">
            <nav className="flex flex-col gap-[0.5rem] overflow-y-auto pr-[0.5rem] scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  aria-label={`Switch to ${tab.label} section`}
                  className={cn(
                    "flex items-center gap-[1rem] p-[1.5rem] rounded-[1.5rem] transition-all group border border-transparent shrink-0",
                    activeTab === tab.id 
                      ? "bg-gold/5 border-gold/10 text-gold shadow-sm" 
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "w-[2.5rem] h-[2.5rem] rounded-[1rem] flex items-center justify-center shrink-0 transition-all",
                    activeTab === tab.id ? "bg-gold text-black shadow-[0_0.25rem_1rem_rgba(212,175,55,0.2)]" : "bg-white/5"
                  )}>
                    <tab.icon size={18} />
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-[0.625rem] font-black uppercase tracking-widest truncate w-full">{tab.label}</span>
                    <div className="flex items-center gap-[0.5rem] mt-[0.25rem] w-full">
                       <div className="h-[0.125rem] flex-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${tab.progress}%` }} className={cn("h-full", activeTab === tab.id ? "bg-gold" : "bg-slate-700")} />
                       </div>
                       <span className="text-[0.5rem] font-bold opacity-60">{tab.progress}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* MAIN CONTENT: PRIMARY FOCUS - Protected Center Panel */}
        <div className="flex flex-col gap-[2.5rem] min-w-0 sm:min-w-[400px] lg:min-w-[500px] h-full overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 glass rounded-[3rem] overflow-hidden flex flex-col border border-white/5 shadow-2xl relative"
            >
              {activeTab === 'journey' && (
                <ProcessTimeline 
                  role={role}
                  onRoleChange={onRoleChange}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  completedIndices={completedIndices}
                  setCompletedIndices={setCompletedIndices}
                  registrationData={registrationData}
                  setRegistrationData={setRegistrationData}
                  candidateData={candidateData}
                  setCandidateData={setCandidateData}
                  candidateAuditResult={candidateAuditResult}
                  setCandidateAuditResult={setCandidateAuditResult}
                  volunteerData={volunteerData}
                  setVolunteerData={setVolunteerData}
                  electionId={electionId}
                  setElectionId={setElectionId}
                  ballotPdfUrl={ballotPdfUrl}
                  setBallotPdfUrl={setBallotPdfUrl}
                  trackingId={trackingId}
                  setTrackingId={setTrackingId}
                  addAssistantMessage={(content, type) => {
                    addAssistantMessage(content, type);
                    if (type === 'success' || type === 'alert') {
                      // Proactive feedback based on action
                    }
                  }}
                  onReset={onReset}
                />
              )}
              {activeTab === 'ai' && (
                <AIChat 
                  role={role} 
                  messages={messages} 
                  onSendMessage={(text) => {
                    setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      role: 'user',
                      timestamp: Date.now(),
                      content: text
                    }]);
                  }}
                  setMessages={setMessages}
                />
              )}
              {activeTab === 'map' && <MapComp />}
              {activeTab === 'locations' && <GoogleMapsEmbed query="polling booths near me" />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* INTELLIGENCE PANEL: SUPPORTIVE (Hidden on <1100px) */}
        <div className="hidden [@media(min-width:1100px)]:flex flex-col gap-[2rem] min-w-0 h-full overflow-hidden shrink-0">
          {/* Tactical Metrics Card */}
          <div className="p-[2rem] rounded-[2rem] border border-white/5 bg-white/2 space-y-[1.75rem]">
             <div className="flex items-center gap-[1rem]">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                   <Target size={14} />
                </div>
                <h4 className="text-[0.625rem] font-black text-slate-100 uppercase tracking-widest">Tactical Metrics</h4>
             </div>
             
             <div className="grid grid-cols-1 gap-[1rem]">
                {[
                  { label: "Voter Turnout", value: "84.2%", trend: "+2.1%", color: "text-emerald-400" },
                  { label: "Identity Sync", value: "0.2ms", trend: "LATENCY", color: "text-gold" },
                  { label: "Verification Rate", value: "99.98%", trend: "STABLE", color: "text-blue-400" },
                  { label: "Active Nodes", value: "1,442", trend: "ONLINE", color: "text-emerald-400" }
                ].map((metric, i) => (
                  <div key={i} className="p-[1rem] rounded-[1.25rem] bg-white/2 border border-white/5 space-y-[0.375rem]">
                     <div className="flex items-center justify-between">
                        <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">{metric.label}</span>
                        <span className="text-[0.4rem] font-black text-slate-600 uppercase tracking-widest">{metric.trend}</span>
                     </div>
                     <p className={cn("text-[1.125rem] font-black tracking-tighter", metric.color)}>{metric.value}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Simplified AI Insights Card */}
          <div className="glass rounded-[2rem] p-[2rem] border-white/5 relative overflow-hidden group hover:border-gold/20 transition-all shrink-0">
             <div className="flex items-center gap-[1rem] mb-[1.5rem]">
                <div className="w-[2.5rem] h-[2.5rem] rounded-[1rem] bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                  <Bot size={18} />
                </div>
                <h3 className="text-[0.625rem] font-black text-slate-100 uppercase tracking-widest">Election Assistant</h3>
             </div>
             
             <div className="p-[1.25rem] rounded-[1.25rem] bg-white/5 border border-white/5 mb-[1.5rem]">
                <p className="text-[0.75rem] font-medium text-slate-400 leading-relaxed italic">
                  "{messages.filter(m => m.role === 'model').slice(-1)[0]?.content || getStepTip()}"
                </p>
             </div>

             <button className="w-full py-[1rem] rounded-[1.25rem] bg-gold/10 hover:bg-gold/20 text-gold text-[0.625rem] font-black uppercase tracking-widest transition-all border border-gold/10">
                Acknowledge
             </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="z-40 p-[2rem] flex flex-col md:flex-row justify-between items-center bg-black/40 border-t border-white/5 backdrop-blur-3xl px-[3rem] shrink-0">
        <div className="flex items-center gap-[1.5rem] opacity-40">
          <div className="flex items-center gap-[0.75rem]">
             <ShieldCheck size={16} className="text-gold" />
             <p className="text-[0.5625rem] font-black uppercase tracking-[0.5em] text-slate-200">Election Security Certified</p>
          </div>
          <div className="h-[1rem] w-[0.0625rem] bg-white/10" />
          <p className="text-[0.5625rem] font-black uppercase tracking-[0.4em] text-slate-500">CivicPulse Guide v1.0</p>
        </div>
        <div className="flex gap-[3rem] text-[0.5625rem] font-black uppercase tracking-[0.4em] text-slate-500">
           <span className="hover:text-gold cursor-pointer transition-all">Support</span>
           <span className="hover:text-gold cursor-pointer transition-all">Privacy Policy</span>
           <span className="hover:text-gold cursor-pointer transition-all">Official Resources</span>
        </div>
      </footer>
    </div>
  );
}
