import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type Language = 'en' | 'ta' | 'hi' | 'fr';
export type FontSize = 'sm' | 'md' | 'lg';

export interface AppSettings {
  theme: Theme;
  language: Language;
  fontSize: FontSize;
  notifications: boolean;
  soundEffects: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  locationAccess: boolean;
  analyticsSharing: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'en',
  fontSize: 'md',
  notifications: true,
  soundEffects: false,
  highContrast: false,
  reducedMotion: false,
  locationAccess: false,
  analyticsSharing: false,
};

// ─── i18n translations ───────────────────────────────────────────────────────
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'CivicPulse',
    portal: 'Election Portal',
    step1: 'Step 1: Identity',
    step2: 'Step 2: Intelligence',
    step3: 'Step 3: Action',
    simulator: 'Simulator',
    initJourney: 'Initialize Journey',
    quickDemo: 'Quick Demo',
    roleSelection: 'Role Selection',
    chooseParticipate: 'Choose how you will participate',
    voterTitle: 'I am a Voter',
    candidateTitle: 'I am a Candidate',
    volunteerTitle: 'I am a Volunteer',
    electionJourney: 'Election Journey',
    electionAssistant: 'Election Assistant',
    pollingMap: 'Polling Map',
    settings: 'Settings',
    portalPreferences: 'Portal Preferences',
    systemAlerts: 'System Alerts',
    liveUpdates: 'Live Election Updates',
    voterDesc: 'Find out how to register, where to vote, and research candidates.',
    candidateDesc: 'Learn about filing requirements, campaign guidelines, and compliance.',
    volunteerDesc: 'Discover opportunities to support the election process at polling stations.',
    heroTitle: 'ELECTION INTELLIGENCE HUB',
    heroSubtitle: 'Secure, verifiable, and transparent participation engine.',
    electionRoadmap: 'Election Roadmap',
    participationPath: 'Participation Path',
    globalProgress: 'Global Progress',
    journeySteps: 'Journey Steps',
    currentStep: 'Current Step',
    completed: 'Completed',
    scheduled: 'Scheduled',
    whatToDo: 'What to do',
    reqDocs: 'Required Documents',
    estTime: 'Estimated Time',
    interactiveSim: 'Interactive Simulation',
    guidanceContext: 'Guidance & Context',
    proceedNext: 'Proceed to Next Phase',
    strategicDebrief: 'Strategic De-briefing',
    identityVerified: 'Identity Verified: What You Learned',
    whyMatters: 'Why This Step Matters',
    whatHappensNext: 'What Happens Next',
    deepDive: 'Deep-Dive with Assistant',
    stepNum: 'Step {n} of {m}',
    phase: 'Phase',
    civicPulseIntel: 'CivicPulse Intelligence',
    guidanceMode: 'GUIDANCE MODE',
    realTimeSync: 'Real-time Sync',
    directInput: 'Direct Input',
    sysInstruction: 'System Instruction',
    aiAnalysis: 'AI Analysis',
    suggestedQuestions: 'Suggested Questions',
    askQuestion: 'Ask a question about the election process...',
    secureSession: 'Secure Election Assistant Session',
    processing: 'PROCESSING DEPTH...',
    synthesizing: 'SYNTHESIZING...',
    assistant: 'Assistant',
    liveInfo: 'Live Information',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    findLocations: 'Find Locations',
  },
  ta: {
    appName: 'சிவிக்பல்ஸ்',
    portal: 'தேர்தல் போர்டல்',
    step1: 'படி 1: அடையாளம்',
    step2: 'படி 2: தகவல்',
    step3: 'படி 3: நடவடிக்கை',
    simulator: 'சிமுலேட்டர்',
    initJourney: 'பயணத்தை தொடங்கு',
    quickDemo: 'விரைவு டெமோ',
    roleSelection: 'பங்கு தேர்வு',
    chooseParticipate: 'உங்கள் பங்கை தேர்வு செய்யுங்கள்',
    voterTitle: 'நான் ஒரு வாக்காளர்',
    candidateTitle: 'நான் ஒரு வேட்பாளர்',
    volunteerTitle: 'நான் ஒரு தன்னார்வலர்',
    electionJourney: 'தேர்தல் பயணம்',
    electionAssistant: 'தேர்தல் உதவியாளர்',
    pollingMap: 'வாக்குச்சாவடி வரைபடம்',
    settings: 'அமைப்புகள்',
    portalPreferences: 'போர்டல் விருப்பங்கள்',
    systemAlerts: 'கணினி விழிப்பூட்டல்கள்',
    liveUpdates: 'நேரடி தேர்தல் புதுப்பிப்புகள்',
    voterDesc: 'எப்படி பதிவு செய்வது, எங்கு வாக்களிப்பது, வேட்பாளர்களை எப்படி ஆராய்வது என்பதை அறியுங்கள்.',
    candidateDesc: 'வேட்பு மனு தாக்கல், தேர்தல் பிரசார விதிகள் மற்றும் இணக்கம் குறித்து அறிக.',
    volunteerDesc: 'வாக்குச்சாவடிகளில் தேர்தல் செயல்முறையை ஆதரிப்பதற்கான வாய்ப்புகளைக் கண்டறியவும்.',
    heroTitle: 'தேர்தல் புலனாய்வு மையம்',
    heroSubtitle: 'பாதுகாப்பான, சரிபார்க்கக்கூடிய, வெளிப்படையான பங்கேற்பு தளம்.',
    electionRoadmap: 'தேர்தல் வரைபடம்',
    participationPath: 'பங்கேற்பு பாதை',
    globalProgress: 'ஒட்டுமொத்த முன்னேற்றம்',
    journeySteps: 'பயண படிகள்',
    currentStep: 'தற்போதைய படி',
    completed: 'முடிந்தது',
    scheduled: 'திட்டமிடப்பட்டுள்ளது',
    whatToDo: 'என்ன செய்ய வேண்டும்',
    reqDocs: 'தேவையான ஆவணங்கள்',
    estTime: 'மதிப்பிடப்பட்ட நேரம்',
    interactiveSim: 'ஊடாடும் சிமுலேஷன்',
    guidanceContext: 'வழிகாட்டுதல் மற்றும் சூழல்',
    proceedNext: 'அடுத்த கட்டத்திற்குச் செல்லவும்',
    strategicDebrief: 'வியூக மதிப்பாய்வு',
    identityVerified: 'அடையாளம் சரிபார்க்கப்பட்டது: நீங்கள் கற்றது என்ன',
    whyMatters: 'இந்த படி ஏன் முக்கியம்',
    whatHappensNext: 'அடுத்து என்ன நடக்கும்',
    deepDive: 'உதவியாளருடன் ஆழமாக விவாதிக்கவும்',
    stepNum: 'படி {n} / {m}',
    phase: 'கட்டம்',
    civicPulseIntel: 'சிவிக்பல்ஸ் புலனாய்வு',
    guidanceMode: 'வழிகாட்டுதல் முறை',
    realTimeSync: 'நேரடி ஒத்திசைவு',
    directInput: 'நேரடி உள்ளீடு',
    sysInstruction: 'கணினி வழிமுறை',
    aiAnalysis: 'செயற்கை நுண்ணறிவு பகுப்பாய்வு',
    suggestedQuestions: 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
    askQuestion: 'தேர்தல் செயல்முறை குறித்து கேள்வி கேளுங்கள்...',
    secureSession: 'பாதுகாப்பான தேர்தல் உதவியாளர் அமர்வு',
    processing: 'ஆழமாக செயலாக்குகிறது...',
    synthesizing: 'தொகுக்கிறது...',
    assistant: 'உதவியாளர்',
    liveInfo: 'நேரடி தகவல்',
    signIn: 'உள்நுழைய',
    signOut: 'வெளியேற',
    findLocations: 'இடங்களைக் கண்டுபிடி',
  },
  hi: {
    appName: 'सिविकपल्स',
    portal: 'चुनाव पोर्टल',
    step1: 'चरण 1: पहचान',
    step2: 'चरण 2: जानकारी',
    step3: 'चरण 3: कार्रवाई',
    simulator: 'सिमुलेटर',
    initJourney: 'यात्रा शुरू करें',
    quickDemo: 'त्वरित डेमो',
    roleSelection: 'भूमिका चयन',
    chooseParticipate: 'अपनी भूमिका चुनें',
    voterTitle: 'मैं एक मतदाता हूं',
    candidateTitle: 'मैं एक उम्मीदवार हूं',
    volunteerTitle: 'मैं एक स्वयंसेवक हूं',
    electionJourney: 'चुनाव यात्रा',
    electionAssistant: 'चुनाव सहायक',
    pollingMap: 'मतदान मानचित्र',
    settings: 'सेटिंग्स',
    portalPreferences: 'पोर्टल प्राथमिकताएं',
    systemAlerts: 'सिस्टम अलर्ट',
    liveUpdates: 'लाइव चुनाव अपडेट',
    voterDesc: 'जानें कि पंजीकरण कैसे करें, कहाँ वोट करें और उम्मीदवारों पर शोध कैसे करें।',
    candidateDesc: 'नामांकन, अभियान दिशानिर्देशों और अनुपालन के बारे में जानें।',
    volunteerDesc: 'मतदान केंद्रों पर चुनाव प्रक्रिया का समर्थन करने के अवसर खोजें।',
    heroTitle: 'चुनाव खुफिया हब',
    heroSubtitle: 'सुरक्षित, सत्यापन योग्य और पारदर्शी भागीदारी इंजन।',
    electionRoadmap: 'चुनाव रोडमैप',
    participationPath: 'भागीदारी पथ',
    globalProgress: 'वैश्विक प्रगति',
    journeySteps: 'यात्रा के चरण',
    currentStep: 'वर्तमान चरण',
    completed: 'पूर्ण',
    scheduled: 'निर्धारित',
    whatToDo: 'क्या करें',
    reqDocs: 'आवश्यक दस्तावेज',
    estTime: 'अनुमानित समय',
    interactiveSim: 'इंटरैक्टिव सिमुलेशन',
    guidanceContext: 'मार्गदर्शन और संदर्भ',
    proceedNext: 'अगले चरण पर जाएं',
    strategicDebrief: 'रणनीतिक डीब्रीफिंग',
    identityVerified: 'पहचान सत्यापित: आपने क्या सीखा',
    whyMatters: 'यह कदम क्यों महत्वपूर्ण है',
    whatHappensNext: 'आगे क्या होगा',
    deepDive: 'सहायक के साथ गहन चर्चा',
    stepNum: 'चरण {n} / {m}',
    phase: 'चरण',
    civicPulseIntel: 'सिविकपल्स खुफिया',
    guidanceMode: 'मार्गदर्शन मोड',
    realTimeSync: 'रियल-टाइम सिंक',
    directInput: 'सीधा इनपुट',
    sysInstruction: 'सिस्टम निर्देश',
    aiAnalysis: 'एआई विश्लेषण',
    suggestedQuestions: 'सुझाए गए प्रश्न',
    askQuestion: 'चुनाव प्रक्रिया के बारे में एक प्रश्न पूछें...',
    secureSession: 'सुरक्षित चुनाव सहायक सत्र',
    processing: 'गहराई से प्रक्रिया कर रहा है...',
    synthesizing: 'संश्लेषण कर रहा है...',
    assistant: 'सहायक',
    liveInfo: 'लाइव जानकारी',
    signIn: 'साइन इन करें',
    signOut: 'साइन आउट करें',
    findLocations: 'स्थान खोजें',
  },
  fr: {
    appName: 'CivicPulse',
    portal: 'Portail Électoral',
    step1: 'Étape 1: Identité',
    step2: 'Étape 2: Intelligence',
    step3: 'Étape 3: Action',
    simulator: 'Simulateur',
    initJourney: 'Démarrer le Parcours',
    quickDemo: 'Démo Rapide',
    roleSelection: 'Sélection du Rôle',
    chooseParticipate: 'Choisissez votre rôle',
    voterTitle: 'Je suis un Électeur',
    candidateTitle: 'Je suis un Candidat',
    volunteerTitle: 'Je suis un Bénévole',
    electionJourney: 'Parcours Électoral',
    electionAssistant: 'Assistant Électoral',
    pollingMap: 'Carte des bureaux',
    settings: 'Paramètres',
    portalPreferences: 'Préférences du Portail',
    systemAlerts: 'Alertes Système',
    liveUpdates: 'Mises à jour en direct',
    voterDesc: 'Découvrez comment vous inscrire, où voter et recherchez les candidats.',
    candidateDesc: 'Renseignez-vous sur les exigences de dépôt, les directives de campagne et la conformité.',
    volunteerDesc: 'Découvrez les opportunités de soutenir le processus électoral dans les bureaux de vote.',
    heroTitle: 'CENTRE D\'INTELLIGENCE ÉLECTORALE',
    heroSubtitle: 'Moteur de participation sécurisé, vérifiable et transparent.',
    electionRoadmap: 'Feuille de Route Électorale',
    participationPath: 'Voie de Participation',
    globalProgress: 'Progrès Global',
    journeySteps: 'Étapes du Parcours',
    currentStep: 'Étape Actuelle',
    completed: 'Terminé',
    scheduled: 'Programmé',
    whatToDo: 'Que faire',
    reqDocs: 'Documents Requis',
    estTime: 'Temps Estimé',
    interactiveSim: 'Simulation Interactive',
    guidanceContext: 'Orientation et Contexte',
    proceedNext: 'Passer à la Phase Suivante',
    strategicDebrief: 'Débriefing Stratégique',
    identityVerified: 'Identité Vérifiée: Ce que vous avez appris',
    whyMatters: 'Pourquoi cette étape est importante',
    whatHappensNext: 'Ce qui se passe ensuite',
    deepDive: 'Plongée en profondeur avec l\'Assistant',
    stepNum: 'Étape {n} sur {m}',
    phase: 'Phase',
    civicPulseIntel: 'Intelligence CivicPulse',
    guidanceMode: 'MODE ORIENTATION',
    realTimeSync: 'Synchronisation en temps réel',
    directInput: 'Entrée Directe',
    sysInstruction: 'Instruction Système',
    aiAnalysis: 'Analyse IA',
    suggestedQuestions: 'Questions Suggérées',
    askQuestion: 'Posez une question sur le processus électoral...',
    secureSession: 'Session Sécurisée de l\'Assistant Électoral',
    processing: 'TRAITEMENT EN PROFONDEUR...',
    synthesizing: 'SYNTHÈSE EN COURS...',
    assistant: 'Assistant',
    liveInfo: 'Informations en direct',
    signIn: 'Se connecter',
    signOut: 'Se déconnecter',
    findLocations: 'Trouver des lieux',
  },
};

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// ─── Context ─────────────────────────────────────────────────────────────────
interface SettingsContextValue {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
  saveSettings: () => void;
  t: (key: string) => string;
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

// ─── Font size map ────────────────────────────────────────────────────────────
const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: '13px',
  md: '16px',
  lg: '19px',
};

// ─── Detect system theme ──────────────────────────────────────────────────────
function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ─── Apply theme to DOM ───────────────────────────────────────────────────────
function applyTheme(theme: Theme) {
  const effective = theme === 'system' ? getSystemTheme() : theme;
  const html = document.documentElement;
  html.setAttribute('data-theme', effective);
  if (effective === 'light') {
    html.classList.add('light-theme');
    html.classList.remove('dark-theme');
  } else {
    html.classList.add('dark-theme');
    html.classList.remove('light-theme');
  }
}

function applyFontSize(size: FontSize) {
  document.documentElement.style.fontSize = FONT_SIZE_MAP[size];
}

function applyContrast(high: boolean) {
  document.documentElement.classList.toggle('high-contrast', high);
}

function applyReducedMotion(reduced: boolean) {
  document.documentElement.classList.toggle('reduce-motion', reduced);
}

// ─── Load from localStorage ───────────────────────────────────────────────────
function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem('civicpulse_settings');
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Apply all settings on mount
  useEffect(() => {
    applyTheme(settings.theme);
    applyFontSize(settings.fontSize);
    applyContrast(settings.highContrast);
    applyReducedMotion(settings.reducedMotion);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save to localStorage whenever settings change (and apply DOM changes)
  useEffect(() => {
    localStorage.setItem('civicpulse_settings', JSON.stringify(settings));
  }, [settings]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };

      // Apply real DOM changes immediately
      if (key === 'theme') {
        applyTheme(value as Theme);
      }
      if (key === 'fontSize') {
        applyFontSize(value as FontSize);
      }
      if (key === 'highContrast') {
        applyContrast(value as boolean);
      }
      if (key === 'reducedMotion') {
        applyReducedMotion(value as boolean);
      }

      // Location access: request browser geolocation
      if (key === 'locationAccess' && value === true) {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              addToast(`📍 Location access granted. Coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`, 'success');
            },
            (err) => {
              // Permission denied / unavailable — revert
              setSettings(s => ({ ...s, locationAccess: false }));
              addToast(`Location access denied by browser. Enable in browser site settings.`, 'error');
            },
            { timeout: 8000 }
          );
          addToast('Requesting location permission…', 'info');
        } else {
          addToast('Geolocation is not supported by your browser.', 'error');
          return prev; // revert
        }
      }
      if (key === 'locationAccess' && value === false) {
        addToast('Location access disabled.', 'info');
      }

      // Analytics sharing
      if (key === 'analyticsSharing') {
        if (value) {
          addToast('Analytics sharing enabled. Thank you for helping improve CivicPulse.', 'success');
        } else {
          addToast('Analytics sharing disabled. Your data will no longer be collected.', 'info');
        }
      }

      // Notifications
      if (key === 'notifications' && value === true) {
        if ('Notification' in window) {
          Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
              addToast('Push notifications enabled.', 'success');
            } else {
              setSettings(s => ({ ...s, notifications: false }));
              addToast('Notification permission denied. Enable in browser settings.', 'error');
            }
          });
        }
      }

      // Sound effects
      if (key === 'soundEffects') {
        addToast(value ? 'Sound effects enabled.' : 'Sound effects disabled.', 'info');
      }

      return next;
    });
  }, [addToast]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    applyTheme(DEFAULT_SETTINGS.theme);
    applyFontSize(DEFAULT_SETTINGS.fontSize);
    applyContrast(DEFAULT_SETTINGS.highContrast);
    applyReducedMotion(DEFAULT_SETTINGS.reducedMotion);
    addToast('Settings reset to defaults.', 'info');
  }, [addToast]);

  const saveSettings = useCallback(() => {
    localStorage.setItem('civicpulse_settings', JSON.stringify(settings));
    addToast('Settings saved successfully.', 'success');
  }, [settings, addToast]);

  const t = useCallback((key: string): string => {
    return TRANSLATIONS[settings.language]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  }, [settings.language]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, saveSettings, t, toasts, addToast }}>
      {children}
    </SettingsContext.Provider>
  );
}
