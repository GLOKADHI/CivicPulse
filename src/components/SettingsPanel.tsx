import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  Eye,
  Contrast,
  Volume2,
  Check,
  Monitor,
  Type,
  RefreshCw,
  MapPin,
  BarChart2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettings, Theme, Language, FontSize, AppSettings } from '../context/SettingsContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES: { id: Language; label: string; native: string; flag: string }[] = [
  { id: 'en', label: 'English',  native: 'English',   flag: '🇬🇧' },
  { id: 'ta', label: 'Tamil',    native: 'தமிழ்',     flag: '🇮🇳' },
  { id: 'hi', label: 'Hindi',    native: 'हिन्दी',    flag: '🇮🇳' },
  { id: 'fr', label: 'French',   native: 'Français',  flag: '🇫🇷' },
];

const FONT_SIZES: { id: FontSize; label: string; preview: string }[] = [
  { id: 'sm', label: 'Small',   preview: 'Aa' },
  { id: 'md', label: 'Default', preview: 'Aa' },
  { id: 'lg', label: 'Large',   preview: 'Aa' },
];

const THEMES: { id: Theme; label: string; icon: any; desc: string }[] = [
  { id: 'light',  label: 'Light',  icon: Sun,     desc: 'Bright & clean' },
  { id: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Easy on eyes' },
  { id: 'system', label: 'System', icon: Monitor, desc: 'Follows OS' },
];

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      aria-pressed={checked}
      className={cn(
        'relative w-[2.75rem] h-[1.5rem] rounded-full border transition-all duration-300 shrink-0',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        checked ? 'bg-gold/25 border-gold/50' : 'bg-white/5 border-white/10'
      )}
    >
      <div className={cn(
        'absolute top-[0.1875rem] w-[1.125rem] h-[1.125rem] rounded-full transition-all duration-300 shadow-md',
        checked ? 'left-[1.4375rem] bg-gold shadow-gold/30' : 'left-[0.1875rem] bg-slate-600'
      )} />
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.45rem] font-black text-slate-600 uppercase tracking-[0.3em] mb-[0.625rem] mt-[1.125rem] first:mt-0 px-[0.125rem]">
      {children}
    </p>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-[0.875rem] rounded-[1.25rem] bg-white/[0.03] border border-white/5', className)}>
      {children}
    </div>
  );
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSetting, resetSettings, saveSettings, t } = useSettings();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[99]" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-[5rem] right-[2rem] w-[23rem] z-[100] glass rounded-[2rem] border border-white/10 shadow-[0_2rem_4rem_rgba(0,0,0,0.6)] overflow-hidden flex flex-col backdrop-blur-3xl"
      >
        {/* Header */}
        <div className="px-[1.25rem] py-[1rem] border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-[0.75rem]">
            <div className="w-[2rem] h-[2rem] rounded-[0.75rem] bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
              <Settings size={14} />
            </div>
            <div>
              <h3 className="text-[0.6875rem] font-black text-slate-100 uppercase tracking-widest leading-none">{t('settings')}</h3>
              <p className="text-[0.45rem] text-slate-500 font-bold uppercase tracking-[0.2em] mt-[0.2rem]">{t('portalPreferences')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-[0.4rem] hover:bg-white/5 rounded-full text-slate-500 hover:text-gold transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-[1.125rem] scrollbar-hide" style={{ maxHeight: '34rem' }}>

          {/* ── APPEARANCE ── */}
          <SectionLabel>Appearance</SectionLabel>

          {/* Theme */}
          <Card className="mb-[0.5rem]">
            <div className="flex items-center gap-[0.5rem] mb-[0.75rem]">
              <Moon size={11} className="text-slate-400" />
              <span className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest">Theme</span>
              <span className="ml-auto text-[0.45rem] font-bold text-gold/60 uppercase tracking-widest">
                {THEMES.find(t => t.id === settings.theme)?.label}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-[0.375rem]">
              {THEMES.map(th => {
                const Icon = th.icon;
                const active = settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => updateSetting('theme', th.id)}
                    className={cn(
                      'flex flex-col items-center gap-[0.375rem] py-[0.75rem] rounded-[1rem] border text-[0.45rem] font-black uppercase tracking-widest transition-all',
                      active
                        ? 'bg-gold/15 border-gold/40 text-gold shadow-[0_0_1rem_rgba(212,175,55,0.15)]'
                        : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10 hover:bg-white/5'
                    )}
                  >
                    <Icon size={14} />
                    <span>{th.label}</span>
                    {active && <Check size={8} />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Font Size */}
          <Card>
            <div className="flex items-center gap-[0.5rem] mb-[0.75rem]">
              <Type size={11} className="text-slate-400" />
              <span className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest">Font Size</span>
              <span className="ml-auto text-[0.45rem] font-bold text-gold/60 uppercase tracking-widest">
                {FONT_SIZES.find(f => f.id === settings.fontSize)?.label}
              </span>
            </div>
            <div className="flex gap-[0.375rem]">
              {FONT_SIZES.map((f, idx) => {
                const active = settings.fontSize === f.id;
                const sizes = ['text-[0.65rem]', 'text-[0.8rem]', 'text-[1rem]'];
                return (
                  <button
                    key={f.id}
                    onClick={() => updateSetting('fontSize', f.id)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-[0.25rem] py-[0.625rem] rounded-[0.875rem] border transition-all',
                      active
                        ? 'bg-gold/15 border-gold/40 text-gold'
                        : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                    )}
                  >
                    <span className={cn('font-black', sizes[idx])}>{f.preview}</span>
                    <span className="text-[0.4rem] font-black uppercase tracking-widest">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* ── LANGUAGE ── */}
          <SectionLabel>Display Language</SectionLabel>
          <Card>
            <div className="flex items-center gap-[0.5rem] mb-[0.75rem]">
              <Globe size={11} className="text-slate-400" />
              <span className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest">Language</span>
            </div>
            <div className="grid grid-cols-2 gap-[0.375rem]">
              {LANGUAGES.map(lang => {
                const active = settings.language === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => updateSetting('language', lang.id)}
                    className={cn(
                      'flex items-center gap-[0.5rem] px-[0.625rem] py-[0.5rem] rounded-[0.875rem] border transition-all text-left',
                      active
                        ? 'bg-gold/15 border-gold/40 text-gold'
                        : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                    )}
                  >
                    <span className="text-[0.875rem] leading-none">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.5rem] font-black uppercase tracking-widest truncate">{lang.label}</p>
                      <p className="text-[0.4rem] font-medium opacity-60 truncate">{lang.native}</p>
                    </div>
                    {active && <Check size={8} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* ── NOTIFICATIONS ── */}
          <SectionLabel>Notifications</SectionLabel>
          <div className="space-y-[0.375rem]">
            {[
              {
                key: 'notifications' as keyof AppSettings,
                icon: Bell,
                label: 'Push Alerts',
                desc: 'Election updates & reminders'
              },
              {
                key: 'soundEffects' as keyof AppSettings,
                icon: Volume2,
                label: 'Sound Effects',
                desc: 'UI interaction sounds'
              },
            ].map(item => {
              const Icon = item.icon;
              const active = settings[item.key] as boolean;
              return (
                <div
                  key={item.key}
                  className={cn(
                    'flex items-center justify-between p-[0.875rem] rounded-[1.25rem] border transition-all',
                    active ? 'bg-gold/[0.04] border-gold/15' : 'bg-white/[0.03] border-white/5'
                  )}
                >
                  <div className="flex items-center gap-[0.625rem]">
                    <div className={cn(
                      'w-[1.75rem] h-[1.75rem] rounded-[0.5rem] flex items-center justify-center border transition-all',
                      active ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-white/5 border-white/10 text-slate-500'
                    )}>
                      <Icon size={11} />
                    </div>
                    <div>
                      <p className="text-[0.5625rem] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[0.4rem] text-slate-600 font-medium mt-[0.1rem]">{item.desc}</p>
                    </div>
                  </div>
                  <Toggle checked={active} onChange={v => updateSetting(item.key, v as any)} />
                </div>
              );
            })}
          </div>

          {/* ── ACCESSIBILITY ── */}
          <SectionLabel>Accessibility</SectionLabel>
          <div className="space-y-[0.375rem]">
            {[
              {
                key: 'highContrast' as keyof AppSettings,
                icon: Contrast,
                label: 'High Contrast',
                desc: 'Increases visual contrast of entire page'
              },
              {
                key: 'reducedMotion' as keyof AppSettings,
                icon: Eye,
                label: 'Reduce Motion',
                desc: 'Disables all animations & transitions'
              },
            ].map(item => {
              const Icon = item.icon;
              const active = settings[item.key] as boolean;
              return (
                <div
                  key={item.key}
                  className={cn(
                    'flex items-center justify-between p-[0.875rem] rounded-[1.25rem] border transition-all',
                    active ? 'bg-gold/[0.04] border-gold/15' : 'bg-white/[0.03] border-white/5'
                  )}
                >
                  <div className="flex items-center gap-[0.625rem]">
                    <div className={cn(
                      'w-[1.75rem] h-[1.75rem] rounded-[0.5rem] flex items-center justify-center border transition-all',
                      active ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-white/5 border-white/10 text-slate-500'
                    )}>
                      <Icon size={11} />
                    </div>
                    <div>
                      <p className="text-[0.5625rem] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[0.4rem] text-slate-600 font-medium mt-[0.1rem]">{item.desc}</p>
                    </div>
                  </div>
                  <Toggle checked={active} onChange={v => updateSetting(item.key, v as any)} />
                </div>
              );
            })}
          </div>

          {/* ── PRIVACY & DATA ── */}
          <SectionLabel>Privacy & Data</SectionLabel>
          <div className="space-y-[0.375rem]">
            {/* Location */}
            <div className={cn(
              'p-[0.875rem] rounded-[1.25rem] border transition-all',
              settings.locationAccess ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-white/[0.03] border-white/5'
            )}>
              <div className="flex items-center justify-between mb-[0.375rem]">
                <div className="flex items-center gap-[0.625rem]">
                  <div className={cn(
                    'w-[1.75rem] h-[1.75rem] rounded-[0.5rem] flex items-center justify-center border transition-all',
                    settings.locationAccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'
                  )}>
                    <MapPin size={11} />
                  </div>
                  <div>
                    <p className="text-[0.5625rem] font-black text-slate-300 uppercase tracking-widest">Location Access</p>
                    <p className="text-[0.4rem] text-slate-600 font-medium mt-[0.1rem]">Find nearby polling stations</p>
                  </div>
                </div>
                <Toggle
                  checked={settings.locationAccess}
                  onChange={v => updateSetting('locationAccess', v)}
                />
              </div>
              {settings.locationAccess && (
                <p className="text-[0.4rem] font-bold text-emerald-400/70 uppercase tracking-widest pl-[2.375rem]">
                  ✓ Browser geolocation active
                </p>
              )}
            </div>

            {/* Analytics */}
            <div className={cn(
              'p-[0.875rem] rounded-[1.25rem] border transition-all',
              settings.analyticsSharing ? 'bg-blue-500/[0.04] border-blue-500/20' : 'bg-white/[0.03] border-white/5'
            )}>
              <div className="flex items-center justify-between mb-[0.375rem]">
                <div className="flex items-center gap-[0.625rem]">
                  <div className={cn(
                    'w-[1.75rem] h-[1.75rem] rounded-[0.5rem] flex items-center justify-center border transition-all',
                    settings.analyticsSharing ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500'
                  )}>
                    <BarChart2 size={11} />
                  </div>
                  <div>
                    <p className="text-[0.5625rem] font-black text-slate-300 uppercase tracking-widest">Analytics Sharing</p>
                    <p className="text-[0.4rem] text-slate-600 font-medium mt-[0.1rem]">Help improve the platform</p>
                  </div>
                </div>
                <Toggle
                  checked={settings.analyticsSharing}
                  onChange={v => updateSetting('analyticsSharing', v)}
                />
              </div>
              {settings.analyticsSharing && (
                <p className="text-[0.4rem] font-bold text-blue-400/70 uppercase tracking-widest pl-[2.375rem]">
                  ✓ Anonymous usage data enabled
                </p>
              )}
              {!settings.analyticsSharing && (
                <p className="text-[0.4rem] font-bold text-slate-700 uppercase tracking-widest pl-[2.375rem]">
                  No personal data is collected
                </p>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="h-[0.5rem]" />
        </div>

        {/* Footer */}
        <div className="px-[1rem] py-[0.75rem] border-t border-white/5 bg-white/[0.02] flex gap-[0.5rem] items-center">
          <button
            onClick={resetSettings}
            className="flex items-center gap-[0.375rem] px-[0.75rem] py-[0.625rem] rounded-[1rem] text-[0.45rem] font-black text-slate-500 hover:text-red-400 hover:bg-red-500/5 border border-white/5 hover:border-red-500/20 uppercase tracking-widest transition-all"
          >
            <RefreshCw size={10} />
            Reset All
          </button>
          <div className="flex-1 flex items-center justify-center gap-[0.5rem] py-[0.625rem] rounded-[1rem] bg-white/[0.03] border border-white/5 text-[0.45rem] font-black text-slate-600 uppercase tracking-widest">
            <span className="w-[0.375rem] h-[0.375rem] rounded-full bg-emerald-500 animate-pulse" />
            Changes apply instantly
          </div>
        </div>
      </motion.div>
    </>
  );
}
