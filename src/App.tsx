import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Bot,
  Shield,
  LayoutDashboard,
  Terminal
} from 'lucide-react';
import { UserRole } from './constants/election';
import Dashboard from './components/Dashboard';
import SettingsPanel from './components/SettingsPanel';
import LandingPage from './components/LandingPage';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

/**
 * The root Application component.
 * Manages the top-level state for role selection and modal visibility.
 */
function AppContent() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync state with browser history for back-button support
  React.useEffect(() => {
    if (role) {
      window.history.pushState({ role }, `CivicPulse - ${role}`, `#${role}`);
    } else {
      window.history.pushState(null, 'CivicPulse', '/');
    }
  }, [role]);

  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.role) {
        setRole(event.state.role);
      } else {
        setRole(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // If a role is selected, render the dedicated role dashboard
  if (role) {
    return (
      <Dashboard 
        role={role} 
        onReset={() => {
          setRole(null);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }} 
        onRoleChange={setRole} 
      />
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-gold/30 overflow-x-hidden relative bg-[#05070a]">
      {/* Premium Animated Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Main Landing Interface */}
      <LandingPage 
        onSetRole={setRole}
        showDemo={showDemo}
        setShowDemo={setShowDemo}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {/* Persistent Interaction Layer */}
      <div className="fixed bottom-[3rem] right-[3rem] z-50 flex flex-col gap-[1rem]">
         <motion.button 
           whileHover={{ scale: 1.1 }}
           onClick={() => setShowDemo(true)}
           className="w-[3.5rem] h-[3.5rem] glass rounded-[1.25rem] flex items-center justify-center text-gold border-gold/30 gold-glow backdrop-blur-xl"
           aria-label="Open Simulator"
         >
           <LayoutDashboard size={24} className="fill-gold" />
         </motion.button>
         
         <motion.button 
           whileHover={{ scale: 1.1, rotate: 5 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => setRole('voter')}
           className="w-[5rem] h-[5rem] active-step rounded-[1.75rem] flex items-center justify-center text-white shadow-[0_1.25rem_2.5rem_rgba(212,175,55,0.3)] border-gold/40"
           aria-label="Quick AI Assistant"
         >
           <Bot size={32} />
           <div className="absolute top-0 right-0 w-[1.25rem] h-[1.25rem] bg-green-500 rounded-full border-[0.25rem] border-[#05070a]" />
         </motion.button>
      </div>

      {/* Global Modals & Overlays */}
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
             </motion.div>
          </motion.div>
        )}
        
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      {/* Global Footer */}
      <footer className="pt-[8rem] pb-[4rem] border-t border-white/5 relative z-10 max-w-[80rem] mx-auto px-[1.5rem]">
         <div className="flex flex-col md:flex-row items-center justify-between gap-[2rem] opacity-40">
            <p className="text-[0.625rem] font-black uppercase tracking-[0.3em] text-slate-600">CivicPulse Election Portal 2.4.9 © 2026</p>
            <div className="flex items-center gap-[2.5rem] text-[0.625rem] font-black uppercase tracking-[0.3em] text-slate-600">
               <span className="hover:text-gold cursor-pointer transition-colors">Legal Protocol</span>
               <span className="hover:text-gold cursor-pointer transition-colors">Transparency Log</span>
               <span className="hover:text-gold cursor-pointer transition-colors">Security Manifest</span>
            </div>
         </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SettingsProvider>
  );
}

