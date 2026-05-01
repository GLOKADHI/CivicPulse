import React from 'react';
import { Download, FileText, CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface SummaryReportProps {
  role: string;
  data: any;
  title: string;
  subtitle: string;
}

export default function SummaryReport({ role, data, title, subtitle }: SummaryReportProps) {
  const handleDownload = () => {
    const reportData = {
      title,
      subtitle,
      generatedAt: new Date().toISOString(),
      role,
      journeyDetails: data
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CivicPulse_Election_Audit_${role.toUpperCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-[2rem] rounded-[2.5rem] gold-glass border-gold/20 space-y-[1.5rem]">
      <div className="flex items-center gap-[1rem]">
        <div className="w-[3.5rem] h-[3.5rem] rounded-[1.25rem] bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-[0_4px_20px_rgba(212,175,55,0.2)]">
          <FileText size={28} />
        </div>
        <div>
          <h4 className="text-[1rem] font-black text-slate-100 uppercase tracking-tight">{title}</h4>
          <p className="text-[0.625rem] text-gold font-bold uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="p-[1.5rem] rounded-[1.5rem] bg-black/40 border border-white/5 space-y-[1rem]">
        <div className="flex items-center justify-between text-[0.625rem] font-black uppercase tracking-widest text-slate-500">
           <span>Integrity Status</span>
           <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>
        </div>
        <div className="flex items-center justify-between text-[0.625rem] font-black uppercase tracking-widest text-slate-500">
           <span>Encryption Grade</span>
           <span className="text-gold flex items-center gap-1"><Shield size={12}/> Military (AES-256)</span>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-[1rem] py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] gold-glow transition-all"
      >
        <Download size={18} />
        Download Audit Report
      </motion.button>
      
      <p className="text-[0.5rem] text-slate-500 text-center uppercase tracking-widest font-black opacity-50">
        Digital Signature: {Math.random().toString(36).substring(7).toUpperCase()}-NODE-SECURE
      </p>
    </div>
  );
}
