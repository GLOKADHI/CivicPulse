import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserCircle, 
  Handshake, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  LayoutDashboard, 
  Terminal, 
  Workflow, 
  Zap, 
  Shield, 
  Bot, 
  ArrowRight, 
  ArrowUpRight, 
  ChevronRight,
  Settings,
  LogIn
} from 'lucide-react';
import { UserRole } from '../constants/election';
import { cn } from '../lib/utils';
import Typewriter from './Typewriter';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { logAnalyticsEvent } from '../lib/firebase';

interface LandingPageProps {
  onSetRole: (role: UserRole) => void;
  showDemo: boolean;
  setShowDemo: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

/**
 * The main landing page component of the CivicPulse portal.
 * Handles role selection, authority sections, and primary call-to-actions.
 */
const LandingPage: React.FC<LandingPageProps> = ({ 
  onSetRole, 
  showDemo, 
  setShowDemo,
  showSettings,
  setShowSettings
}) => {
  const { t } = useSettings();
  const { user, signInWithGoogle, logout } = useAuth();
  const [activeStage, setActiveStage] = useState<'role' | 'learn' | 'prepare' | 'execute'>('role');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const rolesSection = document.getElementById('roles');
      const intelligenceSection = document.getElementById('intelligence');
      const heroSection = document.getElementById('hero');

      if (rolesSection && scrollPos >= rolesSection.offsetTop) {
        setActiveStage('execute');
      } else if (intelligenceSection && scrollPos >= intelligenceSection.offsetTop) {
        setActiveStage('learn');
      } else if (heroSection) {
        setActiveStage('role');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roles: { 
    id: UserRole; 
    title: string; 
    description: string; 
    icon: any;
    steps: string[];
    aiTip: string;
    estTime: string;
  }[] = [
    { 
      id: 'voter', 
      title: t('voterTitle'), 
      description: t('voterDesc'),
      icon: UserCircle,
      steps: ['Registration', 'Verification', 'Voting Day Process', 'Results'],
      aiTip: 'Official Reminder: Verify your registration status by Oct 12th.',
      estTime: 'Total: 2 Hours'
    },
    { 
      id: 'candidate', 
      title: t('candidateTitle'), 
      description: t('candidateDesc'),
      icon: Users,
      steps: ['Candidacy Filing', 'Compliance Audit', 'Approval/Completion'],
      aiTip: 'Candidate Alert: New campaign finance disclosure requirements active.',
      estTime: 'Total: 4 Days'
    },
    { 
      id: 'volunteer', 
      title: t('volunteerTitle'), 
      description: t('volunteerDesc'),
      icon: Handshake,
      steps: ['Training', 'Assignment', 'Booth Ops', 'Closing'],
      aiTip: 'Volunteer Update: Polling stations in Ward 4 require bilingual staff.',
      estTime: 'Total: 2 Days'
    },
  ];

  return (
    <div className="relative z-10 max-w-[80rem] mx-auto px-[1.5rem] py-[2rem]">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between mb-[4rem] glass px-[1.5rem] py-[0.75rem] rounded-[1.5rem] border-white/5 sticky top-[2rem] z-50 backdrop-blur-3xl bg-black/40">
        <div className="flex items-center gap-[1rem]">
           <div className="w-[2.5rem] h-[2.5rem] flex items-center justify-center">
             <img src="/images/logo.png" alt="CivicPulse Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
           </div>
           <div className="flex flex-col">
             <h1 className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-slate-100">{t('appName')}</h1>
             <span className="text-[0.5rem] font-bold uppercase tracking-[0.3em] text-slate-500">{t('portal')}</span>
           </div>
        </div>

        <div className="hidden lg:flex items-center gap-[0.5rem]">
          {[
            { id: 'role', label: t('step1'), target: 'hero' },
            { id: 'learn', label: t('step2'), target: 'intelligence' },
            { id: 'execute', label: t('step3'), target: 'roles' }
          ].map((s, i) => {
            const stagesOrder = ['role', 'learn', 'prepare', 'execute'];
            const currentIdx = stagesOrder.indexOf(activeStage);
            const targetIdx = stagesOrder.indexOf(s.id as any);
            const isPast = targetIdx < currentIdx;
            const isActive = activeStage === s.id;

            return (
              <React.Fragment key={s.id}>
                <button 
                  onClick={() => {
                    setActiveStage(s.id as any);
                    scrollToSection(s.target);
                  }}
                  className={cn(
                  "flex items-center gap-[0.75rem] px-[1rem] py-[0.4rem] rounded-full border transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100",
                  isActive ? "bg-gold/10 border-gold/20 text-gold shadow-[0_0_1rem_rgba(212,175,55,0.1)]" : 
                  isPast ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                  "opacity-30 border-transparent text-slate-500"
                )}>
                  <div className={cn(
                    "w-[1.25rem] h-[1.25rem] rounded-full flex items-center justify-center text-[0.625rem] font-black border",
                    isActive ? "bg-gold text-black border-gold shadow-[0_0_1rem_rgba(212,175,55,0.4)]" : 
                    isPast ? "bg-emerald-500 text-black border-emerald-500" :
                    "border-white/20"
                  )}>
                    {isPast ? <CheckCircle2 size={10} /> : i + 1}
                  </div>
                  <span className="text-[0.625rem] font-black uppercase tracking-widest">{s.label}</span>
                </button>
                {i < 2 && <div className="w-[1rem] h-[0.0625rem] bg-white/5" />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-[1rem] shrink-0">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            aria-label="System Settings"
            className={cn(
              "p-[0.625rem] glass rounded-[0.75rem] transition-all border border-white/5",
              showSettings ? "text-gold bg-gold/10 border-gold/40" : "text-slate-400 hover:text-gold hover:bg-gold/5"
            )}
          >
            <Settings size={16} className={cn(showSettings && "animate-[spin_4s_linear_infinite]")} />
          </button>
          <button 
            onClick={() => setShowDemo(true)}
            aria-label="Open Election Simulator"
            className="px-[1.25rem] py-[0.625rem] rounded-[0.75rem] text-[0.5625rem] font-black uppercase tracking-widest text-slate-400 hover:text-gold hover:bg-gold/5 transition-all border border-white/5 shrink-0"
          >
            {t('simulator')}
          </button>

          {/* Auth Button */}
          <div className="flex items-center gap-[1rem] ml-[1rem] border-l border-white/5 pl-[1rem]">
            {user ? (
              <div className="flex items-center gap-[1rem]">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[0.625rem] font-black text-slate-200 uppercase tracking-widest truncate max-w-[8rem]">{user.displayName}</span>
                  <button 
                    onClick={() => logout()}
                    className="text-[0.5rem] font-bold text-slate-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                  >
                    {t('signOut')}
                  </button>
                </div>
                <div className="w-[2.5rem] h-[2.5rem] rounded-[0.75rem] border border-gold/20 overflow-hidden shadow-lg shadow-gold/10">
                  <img src={user.photoURL || ''} alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <button 
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-[0.75rem] px-[1.25rem] py-[0.625rem] rounded-[0.75rem] bg-gold/10 text-gold border border-gold/20 text-[0.5625rem] font-black uppercase tracking-widest hover:bg-gold/20 transition-all shadow-lg shadow-gold/5"
              >
                <LogIn size={14} />
                {t('signIn')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="text-center mt-[5rem] mb-[8rem] max-w-[64rem] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-[0.75rem] px-[1.5rem] py-[0.5rem] gold-glass rounded-full text-[0.625rem] font-black uppercase tracking-[0.4em] text-gold mb-[2.5rem] border-gold/20 shadow-lg shadow-gold/5"
        >
          <Shield size={14} className="fill-gold" />
          Official Election Interface
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-fluid-h1 font-black tracking-tighter mb-10 leading-[0.85] uppercase"
        >
          {t('heroTitle')}
        </motion.h1>

        <div className="max-w-3xl mx-auto mb-16 px-4 min-w-0">
          <h2 className="text-fluid-base text-slate-400 font-medium leading-relaxed break-words">
            <Typewriter text="Initializing non-partisan guidance. CivicPulse maps local election requirements to provide your personalized democratic roadmap with absolute integrity." />
          </h2>
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="flex flex-col sm:flex-row items-center justify-center gap-[1.5rem]"
        >
           <button 
             onClick={() => scrollToSection('roles')}
             className="gold-glow active-step px-[3rem] py-[1.5rem] rounded-[1rem] text-[0.75rem] font-black uppercase tracking-[0.3em] text-white hover:scale-[1.05] transition-all flex items-center gap-[1rem]"
           >
             {t('initJourney')} <ArrowRight size={20} />
           </button>
           <button 
             onClick={() => {
               onSetRole('voter');
               logAnalyticsEvent('role_selection', { role: 'voter' });
             }}
             className="glass px-[3rem] py-[1.5rem] rounded-[1rem] text-[0.75rem] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-gold hover:border-gold/30 transition-all flex items-center gap-[1rem]"
           >
             {t('quickDemo')} <Bot size={20} />
           </button>
        </motion.div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="mb-[10rem] relative">
        <div className="flex flex-col items-center text-center mb-[4rem]">
          <h2 className="text-[2.5rem] font-black tracking-tight uppercase leading-none">{t('roleSelection')}</h2>
          <p className="text-slate-500 text-[0.75rem] font-bold uppercase tracking-[0.4em] mt-[1rem]">{t('chooseParticipate')}</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-[2rem]">
          {roles.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                onSetRole(r.id);
                logAnalyticsEvent('role_selection', { role: r.id });
              }}
              className="glass p-[2.5rem] rounded-[2.5rem] text-left transition-all group relative overflow-hidden flex flex-col items-start border-white/5 hover:border-gold/30 hover:bg-gold/[0.02] min-h-[32rem] min-w-0"
            >
              <div className="w-[4rem] h-[4rem] bg-white/5 text-gold rounded-[1.25rem] flex items-center justify-center mb-[2rem] border border-white/10 group-hover:bg-gold group-hover:text-black transition-all shrink-0">
                <r.icon size={28} />
              </div>

              <div className="flex-1 w-full flex flex-col min-w-0">
                <h3 className="text-[1.5rem] font-black mb-[0.75rem] uppercase tracking-tight group-hover:text-gold transition-colors break-words leading-tight">
                  {r.title}
                </h3>
                <p className="text-slate-500 text-[0.875rem] font-medium leading-relaxed mb-[2rem] break-words">
                  {r.description}
                </p>
                
                <div className="mt-auto space-y-[0.75rem] mb-[2rem] min-w-0">
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-[0.5625rem] font-black text-slate-600 uppercase tracking-widest truncate">Protocol Path</span>
                     <span className="text-[0.5625rem] font-medium text-slate-500 italic shrink-0 whitespace-nowrap">{r.estTime}</span>
                  </div>
                  <div className="flex gap-[0.5rem]">
                     {r.steps.map((step, idx) => (
                       <div key={idx} className="flex-1 h-[0.125rem] bg-white/10 rounded-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-gold/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                       </div>
                     ))}
                  </div>
                </div>
              </div>
              
              <div className="w-full pt-[2rem] border-t border-white/5 flex items-center justify-between relative z-10 shrink-0 mt-auto">
                 <div className="flex items-center gap-[0.75rem] text-gold/60 text-[0.625rem] font-black uppercase tracking-widest group-hover:text-gold transition-colors truncate mr-2">
                    {t('initJourney')}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 shrink-0" />
                 </div>
                 <div className="px-[0.75rem] py-[0.375rem] rounded-full bg-gold/5 border border-gold/10 text-gold text-[0.5rem] font-black uppercase tracking-widest shrink-0">
                    ID: {r.id.toUpperCase()}
                 </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Intelligence Systems */}
      <section id="intelligence" className="mb-[12rem]">
        <div className="grid lg:grid-cols-2 gap-[5rem] items-center">
          <div className="space-y-[2.5rem]">
            <div>
              <h3 className="text-[0.75rem] font-black text-gold uppercase tracking-[0.4em] mb-[1rem]">Election System</h3>
              <h2 className="text-[3.75rem] font-black leading-none uppercase tracking-tighter">System <br /> Capabilities</h2>
            </div>
            
            <div className="grid gap-[1.5rem]">
              {[
                { label: 'Integrity Auditing', val: 100, icon: Shield },
                { label: 'Real-time Law Mapping', val: 94, icon: Workflow },
                { label: 'Civic Intelligence', val: 88, icon: Bot }
              ].map((cap, i) => (
                <div key={i} className="glass p-[2rem] rounded-[1.5rem] border-white/5 group hover:border-gold/20 transition-all">
                  <div className="flex items-center justify-between mb-[1.5rem]">
                    <div className="flex items-center gap-[1rem]">
                      <div className="w-[2.5rem] h-[2.5rem] rounded-[0.75rem] bg-gold/5 flex items-center justify-center text-gold group-hover:active-step group-hover:text-white transition-all">
                        <cap.icon size={20} />
                      </div>
                      <span className="text-[0.75rem] font-black uppercase tracking-widest text-slate-200">{cap.label}</span>
                    </div>
                    <span className="text-[0.625rem] font-black text-gold">{cap.val}%</span>
                  </div>
                  <div className="h-[0.25rem] bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cap.val}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full active-step"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[4rem] aspect-square p-[3rem] border-white/5 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
             <div className="relative w-full h-full">
                {[
                  { x: '20%', y: '20%', icon: Shield },
                  { x: '80%', y: '20%', icon: MapPin },
                  { x: '50%', y: '50%', icon: Bot, primary: true },
                  { x: '20%', y: '80%', icon: Clock },
                  { x: '80%', y: '80%', icon: Zap }
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full glass border-white/10 flex items-center justify-center shadow-2xl",
                      node.primary ? "w-[8rem] h-[8rem] z-20 active-step text-white shadow-gold/20" : "w-[4rem] h-[4rem] z-10 text-gold shadow-lg"
                    )}
                    style={{ left: node.x, top: node.y }}
                  >
                    <node.icon size={node.primary ? 40 : 20} />
                  </motion.div>
                ))}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <motion.line x1="20%" y1="20%" x2="50%" y2="50%" stroke="currentColor" className="text-gold" strokeWidth="1" />
                  <motion.line x1="80%" y1="20%" x2="50%" y2="50%" stroke="currentColor" className="text-gold" strokeWidth="1" />
                  <motion.line x1="20%" y1="80%" x2="50%" y2="50%" stroke="currentColor" className="text-gold" strokeWidth="1" />
                  <motion.line x1="80%" y1="80%" x2="50%" y2="50%" stroke="currentColor" className="text-gold" strokeWidth="1" />
                </svg>
             </div>
          </div>
        </div>
      </section>

      {/* Authority Footer */}
      <section className="mb-[12rem]">
         <div className="grid md:grid-cols-4 gap-[3rem] border-y border-white/5 py-[6rem]">
            {[
              { title: 'Authority', val: 'Verified', color: 'text-gold' },
              { title: 'Encryption', val: 'AES-256', color: 'text-slate-100' },
              { title: 'Non-Partisan', val: '100% Bias-Free', color: 'text-slate-100' },
              { title: 'Security', val: 'End-to-End', color: 'text-gold' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-[0.625rem] font-black text-slate-500 uppercase tracking-[0.4em] mb-[1rem]">{item.title}</p>
                <p className={cn("text-[1.5rem] font-black uppercase tracking-tighter", item.color)}>{item.val}</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default LandingPage;
