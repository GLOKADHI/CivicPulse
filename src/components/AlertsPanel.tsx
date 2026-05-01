import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Info, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Bell, 
  CheckCircle2,
  X
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
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-[5.5rem] right-[2.5rem] w-full max-w-[24rem] z-[100] glass rounded-[2rem] border-white/10 shadow-[0_2rem_4rem_rgba(0,0,0,0.4)] overflow-hidden flex flex-col backdrop-blur-3xl"
    >
      <div className="p-[1.5rem] border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-[0.75rem]">
          <div className="w-[2rem] h-[2rem] rounded-[0.75rem] active-step flex items-center justify-center text-gold border border-gold/20">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-widest">System Alerts</h3>
            <p className="text-[0.5rem] text-slate-500 font-bold uppercase tracking-[0.2em] mt-[0.125rem]">Live Election Updates</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-[0.5rem] hover:bg-white/5 rounded-full text-slate-500 hover:text-gold transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-[32rem] overflow-y-auto p-[1rem] space-y-[0.75rem] scrollbar-hide">
        {MOCK_ALERTS.map((alert) => (
          <div 
            key={alert.id}
            className={cn(
              "p-[1.25rem] rounded-[1.5rem] border transition-all cursor-pointer group",
              alert.read ? "bg-white/2 border-white/5 opacity-60" : "bg-gold/5 border-gold/10 hover:bg-gold/[0.08] hover:border-gold/20"
            )}
          >
            <div className="flex items-start gap-[1rem]">
              <div className={cn(
                "w-[2rem] h-[2rem] rounded-full flex items-center justify-center shrink-0 border",
                alert.type === 'urgent' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                alert.type === 'warning' ? "bg-gold/10 border-gold/20 text-gold" :
                "bg-blue-500/10 border-blue-500/20 text-blue-400"
              )}>
                {alert.type === 'urgent' ? <AlertTriangle size={12} /> : 
                 alert.type === 'warning' ? <Clock size={12} /> : 
                 <Info size={12} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-[0.25rem]">
                  <h4 className="text-[0.6875rem] font-black text-slate-100 uppercase tracking-wide truncate">
                    {alert.title}
                  </h4>
                  <span className="text-[0.5rem] font-bold text-slate-500 uppercase tracking-widest shrink-0 ml-[0.5rem]">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-[0.625rem] font-medium text-slate-400 leading-relaxed mb-[0.75rem] line-clamp-2 group-hover:line-clamp-none transition-all">
                  {alert.description}
                </p>
                {alert.location && (
                  <div className="flex items-center gap-[0.5rem] text-[0.5rem] font-black text-gold/60 uppercase tracking-widest">
                    <MapPin size={10} />
                    {alert.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-[1rem] border-t border-white/5 bg-white/2">
        <button className="w-full py-[0.75rem] rounded-[1rem] text-[0.5625rem] font-black text-gold uppercase tracking-[0.4em] hover:bg-gold/10 transition-all border border-gold/10 group flex items-center justify-center gap-[0.5rem]">
          View System Audit Log
          <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
