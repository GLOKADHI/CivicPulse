import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Hash, 
  Camera, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Info,
  AlertCircle,
  FileText,
  Sparkles,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateIndianName } from '../lib/names';

type FormStep = 'basics' | 'address' | 'identity' | 'preview';

interface RegistrationData {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  address: string;
  idNumber: string;
  hasPhoto: boolean;
  declaration: boolean;
}

interface VoterRegistrationFormProps {
  onComplete?: (data?: RegistrationData) => void;
  addAssistantMessage?: (content: string, type?: 'standard' | 'guidance' | 'alert' | 'success') => void;
}

export default function VoterRegistrationForm({ onComplete, addAssistantMessage }: VoterRegistrationFormProps) {
  const [step, setStep] = useState<FormStep>('basics');
  const [data, setData] = useState<RegistrationData>({
    fullName: '',
    dob: '',
    gender: '',
    mobile: '',
    address: '',
    idNumber: '',
    hasPhoto: false,
    declaration: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAutoFill = () => {
    const sampleAddresses = [
      '12, MG Road, Bangalore, Karnataka, 560001',
      'Flat 402, Sunshine Apts, Sector 44, Gurgaon, Haryana, 122003',
      '78-B, Marine Drive, Mumbai, Maharashtra, 400020',
      'House No. 5, Anna Salai, Chennai, Tamil Nadu, 600002',
      'Plot 14, Salt Lake City, Kolkata, West Bengal, 700091'
    ];
    
    // Generate valid DOB (18+ years ago)
    const year = 1985 + Math.floor(Math.random() * 20); // 1985 - 2005
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const dob = `${year}-${month}-${day}`;

    const randomId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const randomMobile = (Math.floor(7000000000 + Math.random() * 2999999999)).toString();

    const newData = {
      fullName: generateIndianName().toUpperCase(),
      dob: dob,
      gender: ['male', 'female'][Math.floor(Math.random() * 2)],
      mobile: randomMobile,
      address: sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)],
      idNumber: randomId,
      hasPhoto: true,
      declaration: true
    };
    setData(newData);
    setErrors({});
    setIsAutoFilled(true);

    if (addAssistantMessage) {
      addAssistantMessage(`I've pre-filled your application with realistic sample credentials for ${newData.fullName}. This keeps the simulation moving while showing you the required format.`);
    }
  };

  const handleClear = () => {
    setData({
      fullName: '',
      dob: '',
      gender: '',
      mobile: '',
      address: '',
      idNumber: '',
      hasPhoto: false,
      declaration: false
    });
    setIsAutoFilled(false);
    setErrors({});
    if (addAssistantMessage) {
      addAssistantMessage(`Manual entry initiated. Please ensure your legal name matches your official documentation exactly.`);
    }
  };

  useEffect(() => {
    // Initial auto-fill for demo purposes
    const timer = setTimeout(() => {
      handleAutoFill();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const calculateAge = (dobString: string) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateStep = () => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};
    
    if (step === 'basics') {
      if (!data.fullName) newErrors.fullName = "Full name is required";
      if (!data.dob) {
         newErrors.dob = "DOB is required";
      } else if (calculateAge(data.dob) < 18) {
         newErrors.dob = "You must be at least 18 years old to register";
         if (addAssistantMessage) addAssistantMessage("Age threshold not met. Voting eligibility requires 18+ years of age.", 'alert');
      }
      if (!data.gender) newErrors.gender = "Please select your gender";
    }

    if (step === 'address') {
      if (!data.address) newErrors.address = "Detailed address is required";
      if (data.mobile.length < 10) newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (step === 'identity') {
      if (data.idNumber.length !== 12) newErrors.idNumber = "Identity number must be 12 digits";
      if (!data.hasPhoto) newErrors.hasPhoto = "Profile photo is mandatory";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 'basics') {
        setStep('address');
        if (addAssistantMessage) addAssistantMessage("Good. Identity basics recorded. Now, providing your address will help us locate your local polling station.");
      }
      else if (step === 'address') {
        setStep('identity');
        if (addAssistantMessage) addAssistantMessage("Excellent. Now for the cryptographic security phase—provide your 12-digit ID and a biometric photo.");
      }
      else if (step === 'identity') {
        setStep('preview');
        if (addAssistantMessage) addAssistantMessage("All fields complete. Please perform a final review of your application before sub-atomic transmission.");
      }
      else if (step === 'preview') handleFinalize();
    } else {
      if (addAssistantMessage) addAssistantMessage("We found some issues in your application. Please correct the highlighted fields.", 'alert');
    }
  };

  const handleFinalize = () => {
    setIsSubmitting(true);
    if (addAssistantMessage) addAssistantMessage("Transmitting application to the decentralized civic ledger... please do not disconnect.");
    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (addAssistantMessage) addAssistantMessage("Success! Your candidacy for the voter registry has been approved.", 'success');
      
      // Auto-navigate to next step after showing success message
      setTimeout(() => {
        if (onComplete) onComplete(data);
      }, 2000);
    }, 2000);
  };

  const handlePhotoSim = () => {
    setData(prev => ({ ...prev, hasPhoto: true }));
    setErrors(prev => ({ ...prev, hasPhoto: undefined }));
  };

  const steps: FormStep[] = ['basics', 'address', 'identity', 'preview'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="glass rounded-[2rem] border-white/5 bg-white/2 p-[2rem] space-y-[2rem] overflow-hidden">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1rem]">
          <div className="w-[2.5rem] h-[2.5rem] rounded-[1rem] bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="text-[0.75rem] font-black text-slate-100 uppercase tracking-widest">Registration Portal</h4>
            <p className="text-[0.5625rem] text-slate-500 font-bold uppercase tracking-widest mt-[0.125rem]">Mock Application Interface</p>
          </div>
        </div>
        <div className="flex items-center gap-[1rem]">
            <div className="flex items-center gap-[0.5rem] bg-white/5 p-[0.375rem] rounded-full border border-white/5">
                <button 
                   onClick={handleAutoFill}
                   className="p-[0.5rem] rounded-full hover:bg-gold/20 text-gold transition-all"
                   title="Regenerate Sample Data"
                >
                   <RefreshCw size={14} />
                </button>
                <button 
                   onClick={handleClear}
                   className="p-[0.5rem] rounded-full hover:bg-red-500/20 text-red-400 transition-all"
                   title="Clear Data / Fill Manually"
                >
                   <Trash2 size={14} />
                </button>
            </div>
            <div className="flex flex-col items-end gap-[0.5rem]">
                <span className="text-[0.5rem] font-black text-slate-500 uppercase tracking-widest">Progress: {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
                <div className="w-[6rem] h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-gold"
                        animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
      </div>

      {isAutoFilled && !isSubmitted && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-[1.25rem] py-[0.75rem] rounded-full bg-gold/10 border border-gold/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-[0.75rem]">
            <Sparkles size={14} className="text-gold" />
            <span className="text-[0.5625rem] font-black text-gold uppercase tracking-widest">AI Sample Entry Active - Fields can be edited</span>
          </div>
          <button 
            onClick={() => setIsAutoFilled(false)}
            className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest hover:text-white"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isSubmitted ? (
           <motion.div 
             key="success"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="p-[3rem] rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center gap-[1.5rem]"
           >
              <div className="w-[5rem] h-[5rem] rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-[0_0_2rem_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h5 className="text-[1.25rem] font-black text-emerald-400 uppercase tracking-[0.2em] mb-[0.5rem]">Application Submitted Successfully</h5>
                <p className="text-[0.75rem] text-slate-400 leading-relaxed font-medium">
                  Your registration token has been broadcast to the local node. <br />
                  <span className="text-gold font-bold">Proceed to Identity Verification...</span>
                </p>
              </div>
              <motion.div 
                className="w-12 h-1 bg-emerald-500/20 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 2 }}
              >
                 <motion.div 
                   className="h-full bg-emerald-500"
                   initial={{ x: "-100%" }}
                   animate={{ x: "0%" }}
                   transition={{ duration: 2 }}
                 />
              </motion.div>
           </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-[1.75rem]"
          >
            {step === 'basics' && (
              <div className="space-y-[1.5rem]">
                <div className="space-y-[0.75rem]">
                   <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                     <User size={12} className="text-gold" /> Full Legal Name
                   </label>
                   <input 
                      type="text"
                      value={data.fullName}
                      onChange={(e) => {
                        setData({...data, fullName: e.target.value.toUpperCase()});
                        setIsAutoFilled(false);
                      }}
                      placeholder="ENTER NAME (EX: AZAJA KRELO)"
                      className={cn(
                        "w-full bg-white/5 border rounded-[1.25rem] py-[1.25rem] px-[1.5rem] text-[0.875rem] text-slate-100 transition-all font-bold tracking-widest",
                        errors.fullName ? "border-red-500/40" : "border-white/10 focus:border-gold/40 outline-none",
                        isAutoFilled && data.fullName && "border-gold/20 bg-gold/[0.02]"
                      )}
                   />
                   {errors.fullName && <p className="text-[0.5rem] text-red-400 font-bold uppercase ml-2">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.5rem]">
                  <div className="space-y-[0.75rem]">
                     <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                       <Calendar size={12} className="text-gold" /> Date of Birth
                     </label>
                     <input 
                        type="date"
                        value={data.dob}
                        onChange={(e) => {
                          setData({...data, dob: e.target.value});
                          setIsAutoFilled(false);
                        }}
                        className={cn(
                          "w-full bg-white/5 border rounded-[1.25rem] py-[1.25rem] px-[1.5rem] text-[0.875rem] text-slate-100 transition-all",
                          errors.dob ? "border-red-500/40" : "border-white/10 focus:border-gold/40 outline-none",
                          isAutoFilled && data.dob && "border-gold/20 bg-gold/[0.02]"
                        )}
                     />
                  </div>
                  <div className="space-y-[0.75rem]">
                     <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                       Gender
                     </label>
                     <select 
                        value={data.gender}
                        onChange={(e) => {
                          setData({...data, gender: e.target.value});
                          setIsAutoFilled(false);
                        }}
                        className={cn(
                          "w-full bg-white/5 border border-white/10 rounded-[1.25rem] py-[1.25rem] px-[1.5rem] text-[0.875rem] text-slate-100 focus:border-gold/40 outline-none appearance-none cursor-pointer",
                          isAutoFilled && data.gender && "border-gold/20 bg-gold/[0.02]"
                        )}
                     >
                        <option value="" className="bg-slate-900">Select...</option>
                        <option value="male" className="bg-slate-900">Male</option>
                        <option value="female" className="bg-slate-900">Female</option>
                        <option value="other" className="bg-slate-900">Other</option>
                     </select>
                  </div>
                </div>
                {errors.dob && <p className="text-[0.625rem] text-red-400 font-bold uppercase ml-2 flex items-center gap-1"><AlertCircle size={10}/> {errors.dob}</p>}
              </div>
            )}

            {step === 'address' && (
              <div className="space-y-[1.5rem]">
                <div className="space-y-[0.75rem]">
                   <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                     <MapPin size={12} className="text-gold" /> Residential Address
                   </label>
                   <textarea 
                      value={data.address}
                      onChange={(e) => {
                        setData({...data, address: e.target.value});
                        setIsAutoFilled(false);
                      }}
                      placeholder="Street, Building, Flat No., City, Zip Code"
                      rows={3}
                      className={cn(
                        "w-full bg-white/5 border rounded-[1.25rem] py-[1.25rem] px-[1.5rem] text-[0.875rem] text-slate-100 transition-all resize-none",
                        errors.address ? "border-red-500/40" : "border-white/10 focus:border-gold/40 outline-none",
                        isAutoFilled && data.address && "border-gold/20 bg-gold/[0.02]"
                      )}
                   />
                </div>
                <div className="space-y-[0.75rem]">
                   <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                     <Phone size={12} className="text-gold" /> Mobile Number
                   </label>
                   <input 
                      type="tel"
                      value={data.mobile}
                      onChange={(e) => {
                        setData({...data, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)});
                        setIsAutoFilled(false);
                      }}
                      placeholder="10-digit mobile number"
                      className={cn(
                        "w-full bg-white/5 border rounded-[1.25rem] py-[1.25rem] px-[1.5rem] text-[0.875rem] text-slate-100 transition-all",
                        errors.mobile ? "border-red-500/40" : "border-white/10 focus:border-gold/40 outline-none",
                        isAutoFilled && data.mobile && "border-gold/20 bg-gold/[0.02]"
                      )}
                   />
                </div>
              </div>
            )}

            {step === 'identity' && (
              <div className="space-y-[1.75rem]">
                 <div className="space-y-[0.75rem]">
                   <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                     <Hash size={12} className="text-gold" /> 12-Digit Identity Number
                   </label>
                   <input 
                      type="text"
                      value={data.idNumber}
                      onChange={(e) => {
                        setData({...data, idNumber: e.target.value.replace(/\D/g, '').slice(0, 12)});
                        setIsAutoFilled(false);
                      }}
                      placeholder="EX: 4432 1109 8872"
                      className={cn(
                        "w-full bg-white/5 border rounded-[1.25rem] py-[1.25rem] px-[1.5rem] text-[1.125rem] font-mono text-gold tracking-widest transition-all",
                        errors.idNumber ? "border-red-500/40" : "border-white/10 focus:border-gold/40 outline-none",
                        isAutoFilled && data.idNumber && "border-gold/20 bg-gold/[0.02]"
                      )}
                   />
                </div>

                <div className="space-y-[1rem]">
                   <label className="text-[0.5625rem] font-black text-slate-500 uppercase tracking-[0.2em] ml-[0.5rem] flex items-center gap-2">
                     <Camera size={12} className="text-gold" /> Live Profile Capture
                   </label>
                   <div 
                      onClick={handlePhotoSim}
                      className={cn(
                        "w-full aspect-[16/9] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-[1rem] cursor-pointer transition-all",
                        data.hasPhoto ? "bg-emerald-500/5 border-emerald-500/40" : "bg-white/2 border-white/10 hover:border-gold/40"
                      )}
                   >
                      {data.hasPhoto ? (
                         <>
                           <CheckCircle2 size={32} className="text-emerald-500" />
                           <span className="text-[0.625rem] font-black text-emerald-500 uppercase tracking-widest">Image Processed Successfully</span>
                         </>
                      ) : (
                         <>
                           <Camera size={32} className="text-slate-700" />
                           <span className="text-[0.625rem] font-black text-slate-500 uppercase tracking-widest">Click to Simulate Capture</span>
                         </>
                      )}
                   </div>
                   {errors.hasPhoto && <p className="text-[0.5rem] text-red-400 font-bold uppercase text-center">{errors.hasPhoto}</p>}
                </div>
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-[1.5rem]">
                 <div className="p-[1.5rem] rounded-[2rem] bg-gold/5 border border-gold/10 space-y-[1.25rem]">
                    <h5 className="text-[0.625rem] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-[0.5rem]">
                       <ShieldCheck size={14} /> Application Summary
                    </h5>
                    <div className="grid grid-cols-2 gap-[1.5rem]">
                       <div className="space-y-[0.25rem]">
                          <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">Full Name</span>
                          <p className="text-[0.75rem] font-bold text-slate-200 tracking-wider">{data.fullName}</p>
                       </div>
                       <div className="space-y-[0.25rem]">
                          <span className="text-[0.5rem] font-black text-slate-600 uppercase tracking-widest">ID Reference</span>
                          <p className="text-[0.75rem] font-mono text-gold">{data.idNumber}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-[1rem]">
                    <label className="flex items-start gap-[1rem] cursor-pointer group">
                       <div 
                          onClick={() => setData({...data, declaration: !data.declaration})}
                          className={cn(
                            "w-[1.25rem] h-[1.25rem] rounded-md border flex-shrink-0 flex items-center justify-center transition-all mt-0.5",
                            data.declaration ? "bg-gold border-gold" : "bg-white/5 border-white/10 group-hover:border-gold/40"
                          )}
                       >
                          {data.declaration && <CheckCircle2 size={12} className="text-black" />}
                       </div>
                       <p className="text-[0.625rem] text-slate-500 leading-relaxed font-medium">
                          I hereby declare that I am a citizen of this nation, 18+ years of age, and all information provided is cryptographically accurate as per global standards.
                       </p>
                    </label>
                 </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      {!isSubmitted && (
         <div className="flex items-center gap-[1.25rem] pt-[1rem] border-t border-white/5">
            {currentStepIndex > 0 && (
              <button 
                onClick={() => setStep(steps[currentStepIndex - 1])}
                disabled={isSubmitting}
                className="px-[1.5rem] py-[1.25rem] rounded-[1.5rem] border border-white/10 text-slate-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            
            <button 
              onClick={nextStep}
              disabled={(step === 'preview' && !data.declaration) || isSubmitting}
              className="flex-1 flex items-center justify-center gap-[1rem] py-[1.25rem] rounded-[1.5rem] active-step text-white text-[0.75rem] font-black uppercase tracking-[0.3em] gold-glow transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                 <>
                   <RefreshCw size={16} className="animate-spin" />
                   Processing...
                 </>
              ) : (
                <>
                  {step === 'preview' ? 'Finalize Application' : 'Continue to Next Phase'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
         </div>
      )}

      {currentStepIndex < 3 && !isSubmitted && (
        <div className="p-[1.25rem] rounded-[1.5rem] bg-white/2 border border-white/5 flex items-start gap-[1rem]">
            <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
            <div>
              <h6 className="text-[0.5625rem] font-black text-slate-200 uppercase tracking-widest mb-1">AI Guidance</h6>
              <p className="text-[0.625rem] text-slate-500 leading-relaxed font-medium">
                {step === 'basics' && "Correct identity spelling is critical for localized ballot synchronization."}
                {step === 'address' && "Your address determines your assigned polling node and local representative choices."}
                {step === 'identity' && "ID verification ensures one-person, one-vote integrity across the neural grid."}
              </p>
            </div>
        </div>
      )}
    </div>
  );
}
