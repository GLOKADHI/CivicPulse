import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useSettings, Toast, ToastType } from '../context/SettingsContext';
import { cn } from '../lib/utils';

const ICONS: Record<ToastType, React.FC<{ size: number; className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-400',
  info: 'border-gold/20 bg-gold/5 text-gold',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
};

function ToastItem({ toast }: { toast: Toast }) {
  const Icon = ICONS[toast.type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex items-start gap-[0.75rem] px-[1rem] py-[0.75rem] rounded-[1.25rem] border backdrop-blur-xl shadow-xl max-w-[20rem] min-w-[14rem]',
        COLORS[toast.type]
      )}
    >
      <Icon size={14} className="shrink-0 mt-[0.1rem]" />
      <p className="text-[0.5625rem] font-bold leading-relaxed flex-1">{toast.message}</p>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts } = useSettings();

  return (
    <div className="fixed bottom-[2rem] right-[2rem] z-[200] flex flex-col gap-[0.5rem] items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
