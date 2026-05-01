/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserCircle, 
  Handshake, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  MessageSquare,
  MapPin,
  Clock,
  LayoutDashboard,
  Terminal,
  Workflow,
  Zap,
  Shield,
  FileText,
  Heart,
  Trophy,
  Globe,
  Bot,
  ArrowRight,
  Sparkles,
  MousePointer2,
  Lock,
  Box
} from 'lucide-react';
import { UserRole } from './constants/election';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';

const Typewriter = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <span className="inline-block border-r-2 border-gold pr-1 animate-pulse min-h-[1.2em]">
      {displayText}
    </span>
  );
};

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [activeStage, setActiveStage] = useState<'role' | 'learn' | 'prepare' | 'execute'>('role');

  // Scroll logic for breadcrumb
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
      title: 'I am a Voter', 
      description: 'Find out how to register, where to vote, and research candidates.',
      icon: UserCircle,
      steps: ['Registration', 'Verification', 'Voting Day Process', 'Results'],
      aiTip: 'Official Reminder: Verify your registration status by Oct 12th.',
      estTime: 'Total: 2 Hours'
    },
    { 
      id: 'candidate', 
      title: 'I am a Candidate', 
      description: 'Learn about filing requirements, campaign guidelines, and compliance.',
      icon: Users,
      steps: ['Candidacy Filing', 'Compliance Audit', 'Approval/Completion'],
      aiTip: 'Candidate Alert: New campaign finance disclosure requirements active.',
      estTime: 'Total: 4 Days'
    },
    { 
      id: 'volunteer', 
      title: 'I am a Volunteer', 
      description: 'Discover opportunities to support the election process at polling stations.',
      icon: Handshake,
      steps: ['Training', 'Assignment', 'Booth Ops', 'Closing'],
      aiTip: 'Volunteer Update: Polling stations in Ward 4 require bilingual staff.',
      estTime: 'Total: 2 Days'
    },
  ];

  if (role) {
    return <Dashboard role={role} onReset={() => setRole(null)} onRoleChange={setRole} />;
  }

  const stages = [
    { id: 'role', label: 'Identity' },
    { id: 'learn', label: 'Intelligence' },
    { id: 'prepare', label: 'Strategy' },
    { id: 'execute', label: 'Action' }
  ];

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-gold/30 overflow-x-hidden relative">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[160px]" />
        
        {/* Fine grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-10 max-w-[80rem] mx-auto px-[1.5rem] py-[2rem]">
        
        {/* Navigation Bar - Step System */}
        <nav className="flex items-center justify-between mb-[4rem] glass px-[1.5rem] py-[0.75rem] rounded-[1.5rem] border-white/5 sticky top-[2rem] z-50 backdrop-blur-3xl bg-black/40">
          <div className="flex items-center gap-[1rem]">
             <div className="w-[2.5rem] h-[2.5rem] flex items-center justify-center">
               <img src="/images/logo.png" alt="CivicPulse Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
             </div>
             <div className="flex flex-col">
               <h1 className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-slate-100">CivicPulse</h1>
               <span className="text-[0.5rem] font-bold uppercase tracking-[0.3em] text-slate-500">Election Portal</span>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-[0.5rem]">
            {[
              { id: 'role', label: 'Step 1: Identity', target: 'hero' },
              { id: 'learn', label: 'Step 2: Intelligence', target: 'intelligence' },
              { id: 'execute', label: 'Step 3: Action', target: 'roles' }
            ].map((s, i) => {
              const stagesOrder = ['role', 'learn', 'prepare', 'execute'];
              const currentIdx = stagesOrder.indexOf(activeStage);
              const targetIdx = stagesOrder.indexOf(s.id as any);
              const isPast = targetIdx < currentIdx;
              const isActive = activeStage === s.id;
              // On landing page, we don't strictly lock navigation unless it's past the action step
              const isLocked = false; 

              return (
                <React.Fragment key={s.id}>
                  <button 
                    disabled={isLocked}
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
              onClick={() => setShowDemo(true)}
              className="px-[1.25rem] py-[0.625rem] rounded-[0.75rem] text-[0.5625rem] font-black uppercase tracking-widest text-slate-400 hover:text-gold hover:bg-gold/5 transition-all border border-white/5 shrink-0"
            >
              Simulator
            </button>
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
            Command <span className="text-gold italic font-serif lowercase tracking-normal">your</span> <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500">Democracy.</span>
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
               Initialize Journey <ArrowRight size={20} />
             </button>
             <button 
               onClick={() => setRole('voter')}
               className="glass px-[3rem] py-[1.5rem] rounded-[1rem] text-[0.75rem] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-gold hover:border-gold/30 transition-all flex items-center gap-[1rem]"
             >
               Quick Demo <Bot size={20} />
             </button>
          </motion.div>
        </section>

        {/* Roles Section - Defined Protocol */}
        <section id="roles" className="mb-[10rem] relative">
          <div className="flex flex-col items-center text-center mb-[4rem]">
            <h2 className="text-[2.5rem] font-black tracking-tight uppercase leading-none">Role Selection</h2>
            <p className="text-slate-500 text-[0.75rem] font-bold uppercase tracking-[0.4em] mt-[1rem]">Choose how you will participate</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-[2rem]">
            {roles.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setRole(r.id)}
                className="glass p-[2.5rem] rounded-[2.5rem] text-left transition-all group relative overflow-hidden flex flex-col items-start border-white/5 hover:border-gold/30 hover:bg-gold/[0.02] min-h-[32rem] min-w-0"
              >
                {/* Header Icon - Anchored Top */}
                <div className="w-[4rem] h-[4rem] bg-white/5 text-gold rounded-[1.25rem] flex items-center justify-center mb-[2rem] border border-white/10 group-hover:bg-gold group-hover:text-black transition-all shrink-0">
                  <r.icon size={28} />
                </div>

                {/* Content Center - Elastic/Grows */}
                <div className="flex-1 w-full flex flex-col min-w-0">
                  <h3 className="text-[1.5rem] font-black mb-[0.75rem] uppercase tracking-tight group-hover:text-gold transition-colors break-words leading-tight">
                    {r.title}
                  </h3>
                  <p className="text-slate-500 text-[0.875rem] font-medium leading-relaxed mb-[2rem] break-words">
                    {r.description}
                  </p>
                  
                  {/* Step Preview - Anchored towards bottom of text block */}
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
                
                {/* Action Footer - Strictly Anchored Bottom */}
                <div className="w-full pt-[2rem] border-t border-white/5 flex items-center justify-between relative z-10 shrink-0 mt-auto">
                   <div className="flex items-center gap-[0.75rem] text-gold/60 text-[0.625rem] font-black uppercase tracking-widest group-hover:text-gold transition-colors truncate mr-2">
                      Initialize Journey
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

        {/* Intelligence / Systems Section */}
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

            {/* Visual Flow Diagram / Simulation feel */}
            <div className="glass rounded-[4rem] aspect-square p-[3rem] border-white/5 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
               
               {/* Animated Node Diagram */}
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
                      {node.primary && (
                        <div className="absolute -inset-[1rem] border border-gold/20 rounded-full animate-ping opacity-20" />
                      )}
                    </motion.div>
                  ))}
                  
                  {/* SVG Connections Line Animation */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} x1="20%" y1="20%" x2="50%" y2="50%" stroke="currentColor" className="text-gold" strokeWidth="1" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} x1="80%" y1="20%" x2="50%" y2="50%" stroke="currentColor" className="text-gold" strokeWidth="1" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} x1="20%" y1="80%" x2="50%" y2="50%" stroke="currentColor" className="text-gold" strokeWidth="1" />
                    <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} x1="80%" y1="80%" x2="50%" y2="50%" stroke="currentColor" className="text-gold" strokeWidth="1" />
                  </svg>
               </div>

               <div className="absolute bottom-[3rem] left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <p className="text-[0.625rem] font-black text-gold uppercase tracking-[0.4em] mb-[0.5rem]">Interface Active</p>
                  <div className="flex gap-[0.25rem]">
                     {[1,2,3,4].map(b => <div key={b} className="w-[0.25rem] h-[0.25rem] rounded-full bg-gold/50 animate-pulse" />)}
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Global Authority Section */}
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

        {/* Floating Intelligence Hub */}
        <div className="fixed bottom-[3rem] right-[3rem] z-50 flex flex-col gap-[1rem]">
           {/* Simulation Fast Link */}
           <motion.button 
             whileHover={{ scale: 1.1 }}
             onClick={() => setShowDemo(true)}
             className="w-[3.5rem] h-[3.5rem] glass rounded-[1.25rem] flex items-center justify-center text-gold border-gold/30 gold-glow backdrop-blur-xl"
           >
             <LayoutDashboard size={24} className="fill-gold" />
           </motion.button>
           
           <motion.button 
             whileHover={{ scale: 1.1, rotate: 5 }}
             whileTap={{ scale: 0.9 }}
             onClick={() => setRole('voter')}
             className="w-[5rem] h-[5rem] active-step rounded-[1.75rem] flex items-center justify-center text-white shadow-[0_1.25rem_2.5rem_rgba(212,175,55,0.3)] border-gold/40"
           >
             <Bot size={32} />
             <div className="absolute top-0 right-0 w-[1.25rem] h-[1.25rem] bg-green-500 rounded-full border-[0.25rem] border-[#05070a]" />
           </motion.button>
        </div>

        {/* Premium Footer */}
        <footer className="pt-[8rem] pb-[4rem] border-t border-white/5">
           <div className="grid lg:grid-cols-3 gap-[5rem] items-start mb-[5rem]">
              <div className="space-y-[1.5rem]">
                <div className="flex items-center gap-[1rem] text-gold">
                   <Shield size={32} />
                   <h2 className="text-[1.5rem] font-black uppercase tracking-tighter">CivicPulse</h2>
                </div>
                <p className="text-[0.75rem] font-medium text-slate-500 leading-relaxed uppercase tracking-widest max-w-[20rem]">
                  The world's first premium non-partisan election guidance system.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-[2.5rem]">
                 <div className="space-y-[1rem]">
                    <p className="text-[0.625rem] font-black text-slate-100 uppercase tracking-widest">Protocol</p>
                    <ul className="space-y-[0.5rem] text-[0.625rem] font-bold text-slate-600 uppercase tracking-widest">
                       <li className="hover:text-gold cursor-pointer transition-colors">Integrity Map</li>
                       <li className="hover:text-gold cursor-pointer transition-colors">Election Logic</li>
                       <li className="hover:text-gold cursor-pointer transition-colors">Database Sync</li>
                    </ul>
                 </div>
                 <div className="space-y-[1rem]">
                    <p className="text-[0.625rem] font-black text-slate-100 uppercase tracking-widest">Action</p>
                    <ul className="space-y-[0.5rem] text-[0.625rem] font-bold text-slate-600 uppercase tracking-widest">
                       <li className="hover:text-gold cursor-pointer transition-colors">Register Hub</li>
                       <li className="hover:text-gold cursor-pointer transition-colors">Simulation</li>
                       <li className="hover:text-gold cursor-pointer transition-colors">Execute</li>
                    </ul>
                 </div>
              </div>

              <div className="glass p-[2rem] rounded-[1.5rem] border-white/5 space-y-[1.5rem]">
                 <p className="text-[0.625rem] font-black text-gold uppercase tracking-[0.4em]">System Health</p>
                 <div className="flex items-center justify-between">
                    <span className="text-[0.625rem] font-bold text-slate-500">Official Server</span>
                    <span className="text-[0.625rem] font-black text-green-400">Online</span>
                 </div>
                 <div className="h-[0.125rem] bg-white/5 w-full rounded-full overflow-hidden">
                    <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="w-1/2 h-full bg-gold/30" />
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between gap-[2rem] pt-[3rem] border-t border-white/5 opacity-40">
              <p className="text-[0.625rem] font-black uppercase tracking-[0.3em] text-slate-600">CivicPulse Election Portal 2.4.9 © 2026</p>
              <div className="flex items-center gap-[2.5rem] text-[0.625rem] font-black uppercase tracking-[0.3em] text-slate-600">
                 <span className="hover:text-gold cursor-pointer transition-colors">Legal Protocol</span>
                 <span className="hover:text-gold cursor-pointer transition-colors">Transparency Log</span>
                 <span className="hover:text-gold cursor-pointer transition-colors">Security Manifest</span>
              </div>
           </div>
        </footer>
      </div>

      {/* Simulator Portal Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-[1.5rem] bg-black/90 backdrop-blur-3xl"
          >
             <motion.div 
               initial={{ scale: 0.95, y: 40 }}
               animate={{ scale: 1, y: 0 }}
               className="glass max-w-[42rem] w-full p-[4rem] rounded-[3.75rem] border-gold/20 shadow-[0_0_6.25rem_rgba(212,175,55,0.1)] text-center relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-[0.25rem] active-step" />
                <div className="w-[6rem] h-[6rem] active-step rounded-[2rem] flex items-center justify-center text-white mx-auto mb-[2.5rem] shadow-2xl shadow-gold/20 border-gold/30">
                  <Terminal size={48} className="text-gold" />
                </div>
                <h2 className="text-[2.5rem] font-black uppercase tracking-tighter mb-[1.5rem]">Simulator Hub</h2>
                <p className="text-slate-400 font-medium leading-[1.8] mb-[3rem] text-[1.125rem]">
                  All simulations are derived from real-world datasets but isolated from actual election records.
                </p>
                <div className="grid sm:grid-cols-2 gap-[1rem]">
                  <button 
                    onClick={() => setRole('voter')}
                    className="w-full py-[1.5rem] active-step text-white rounded-[1rem] font-black uppercase tracking-[0.2em] text-[0.75rem] hover:scale-[1.03] transition-all shadow-xl shadow-gold/20 border-gold/30"
                  >
                    Enter Loop
                  </button>
                  <button 
                    onClick={() => setShowDemo(false)}
                    className="w-full py-[1.5rem] glass text-slate-500 hover:text-gold rounded-[1rem] font-black uppercase tracking-[0.2em] text-[0.75rem] transition-all"
                  >
                    Disconnect
                  </button>
                </div>
                <p className="text-[0.625rem] font-black text-slate-700 uppercase tracking-[0.4em] mt-[2.5rem]">Authorized Access Only</p>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
