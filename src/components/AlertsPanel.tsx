import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Info, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Bell, 
  CheckCircle2,
  X,
  BellOff
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface ElectionAlert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  read: boolean;
}

const MOCK_ALERTS: ElectionAlert[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Polling Station Change',
    description: 'Ward 4 voters: The community center station has moved to Lincoln High Gym due to technical maintenance.',
    timestamp: '2 mins ago',
    location: 'District 7 - Ward 4',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Wait Times',
    description: 'Current wait times at Westside Senior Home have exceeded 45 minutes. Consider alternative polling locations.',
    timestamp: '15 mins ago',
    location: 'Westside Sector',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'ID Verification Update',
    description: 'Digital identity scanners have been recalibrated. Verification speed improved by 25%.',
    timestamp: '1 hour ago',
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'Early Ballot Tally',
    description: 'Initial data synchronization successful. Integrity checks confirm accuracy.',
    timestamp: '3 hours ago',
    read: true,
  }
];

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertsPanel({ isOpen, onClose }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<ElectionAlert[]>(MOCK_ALERTS);

  const unreadCount = alerts.filter(a => !a.read).length;

  const markRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-[5rem] right-[2rem] w-[22rem] z-[100] glass rounded-[2rem] border border-white/10 shadow-[0_2rem_4rem_rgba(0,0,0,0.6)] overflow-hidden flex flex-col backdrop-blur-3xl"
      >
        {/* Header */}
        <div className="px-[1.25rem] py-[1rem] border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-[0.75rem]">
            <div className="w-[2rem] h-[2rem] rounded-[0.75rem] active-step flex items-center justify-center text-gold border border-gold/20">
              <Bell size={14} />
            </div>
            <div>
              <h3 className="text-[0.6875rem] font-black text-slate-100 uppercase tracking-widest leading-none">
                System Alerts
                {unreadCount > 0 && (
                  <span className="ml-[0.5rem] inline-flex items-center justify-center w-[1.25rem] h-[1.25rem] rounded-full bg-gold text-black text-[0.5rem] font-black">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <p className="text-[0.45rem] text-slate-500 font-bold uppercase tracking-[0.2em] mt-[0.2rem]">Live Election Updates</p>
            </div>
          </div>
          <div className="flex items-center gap-[0.5rem]">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-[0.625rem] py-[0.3rem] rounded-full text-[0.45rem] font-black text-gold/70 hover:text-gold hover:bg-gold/10 border border-gold/10 uppercase tracking-widest transition-all"
              >
                Mark all read
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-[0.4rem] hover:bg-white/5 rounded-full text-slate-500 hover:text-gold transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Alert List */}
        <div className="max-h-[28rem] overflow-y-auto p-[0.75rem] space-y-[0.5rem] scrollbar-hide">
          {alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-[3rem] text-slate-600 gap-[1rem]">
              <BellOff size={32} />
              <p className="text-[0.625rem] font-black uppercase tracking-widest">No alerts</p>
            </div>
          )}
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              onClick={() => markRead(alert.id)}
              className={cn(
                "p-[1rem] rounded-[1.25rem] border transition-all cursor-pointer group relative",
                alert.read
                  ? "bg-white/[0.015] border-white/5 opacity-50 hover:opacity-70"
                  : "bg-gold/[0.04] border-gold/10 hover:bg-gold/[0.08] hover:border-gold/25"
              )}
            >
              {/* Unread dot */}
              {!alert.read && (
                <div className="absolute top-[0.875rem] right-[0.875rem] w-[0.375rem] h-[0.375rem] rounded-full bg-gold animate-pulse" />
              )}
              <div className="flex items-start gap-[0.75rem]">
                <div className={cn(
                  "w-[1.75rem] h-[1.75rem] rounded-full flex items-center justify-center shrink-0 border mt-[0.125rem]",
                  alert.type === 'urgent' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                  alert.type === 'warning' ? "bg-gold/10 border-gold/20 text-gold" :
                  "bg-blue-500/10 border-blue-500/20 text-blue-400"
                )}>
                  {alert.type === 'urgent' ? <AlertTriangle size={10} /> : 
                   alert.type === 'warning' ? <Clock size={10} /> : 
                   <Info size={10} />}
                </div>
                <div className="flex-1 min-w-0 pr-[1rem]">
                  <div className="flex items-baseline justify-between mb-[0.2rem] gap-[0.5rem]">
                    <h4 className={cn(
                      "text-[0.625rem] font-black uppercase tracking-wide truncate",
                      alert.read ? "text-slate-400" : "text-slate-100"
                    )}>
                      {alert.title}
                    </h4>
                    <span className="text-[0.45rem] font-bold text-slate-600 uppercase tracking-widest shrink-0">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-[0.5625rem] font-medium text-slate-500 leading-relaxed mb-[0.5rem] line-clamp-2 group-hover:line-clamp-none transition-all">
                    {alert.description}
                  </p>
                  {alert.location && (
                    <div className="flex items-center gap-[0.375rem] text-[0.45rem] font-black text-gold/50 uppercase tracking-widest">
                      <MapPin size={8} />
                      {alert.location}
                    </div>
                  )}
                  {!alert.read && (
                    <p className="text-[0.45rem] font-black text-gold/40 uppercase tracking-widest mt-[0.5rem]">Click to dismiss</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-[0.75rem] border-t border-white/5 bg-white/[0.02]">
          <button className="w-full py-[0.625rem] rounded-[1rem] text-[0.5rem] font-black text-gold/60 hover:text-gold uppercase tracking-[0.4em] hover:bg-gold/10 transition-all border border-gold/5 hover:border-gold/20 group flex items-center justify-center gap-[0.5rem]">
            View System Audit Log
            <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </>
  );
}
