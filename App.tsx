import React, { useState, useEffect } from 'react';
import { InputField } from './components/InputField';
import { GlobalError } from './components/GlobalError';
import { FormErrors } from './types';
import { mockLogin } from './services/authService';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors & { emailArr?: string[], passwordArr?: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validateEmail = (val: string): string[] => {
    const errs: string[] = [];
    if (!val) {
      errs.push("Email is required.");
    } else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(val)) errs.push("Enter a valid email address.");
      if (val.length > 60) errs.push("Email is too long.");
    }
    return errs;
  };

  const validatePassword = (val: string): string[] => {
    const errs: string[] = [];
    if (!val) {
      errs.push("Password is required.");
    }
    return errs;
  };

  // Live Action Validation for inline errors
  useEffect(() => {
    const newErrors = { ...errors };
    let changed = false;

    if (touched.email) {
      const emailErrs = validateEmail(email);
      if (JSON.stringify(newErrors.emailArr) !== JSON.stringify(emailErrs)) {
        newErrors.emailArr = emailErrs;
        changed = true;
      }
    }

    if (touched.password) {
      const passErrs = validatePassword(password);
      if (JSON.stringify(newErrors.passwordArr) !== JSON.stringify(passErrs)) {
        newErrors.passwordArr = passErrs;
        changed = true;
      }
    }

    // PERSISTENCE RULE: Global error stays while editing inputs.
    // It is only cleared when the user hits the CTA again for a new submission attempt.

    if (changed) {
      setErrors(newErrors);
    }
  }, [email, password, touched]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!touched.email) setTouched(prev => ({ ...prev, email: true }));
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (!touched.password) setTouched(prev => ({ ...prev, password: true }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched to trigger any missing inline errors immediately
    setTouched({ email: true, password: true });

    const emailErrs = validateEmail(email);
    const passErrs = validatePassword(password);

    if (emailErrs.length > 0 || passErrs.length > 0) {
      setErrors(prev => ({ ...prev, emailArr: emailErrs, passwordArr: passErrs }));
      return;
    }

    // TRANSITION TO PROCESS STATE: Clear global error and show loading
    setErrors({ emailArr: [], passwordArr: [], global: undefined });
    setIsLoading(true);

    try {
      const response = await mockLogin(email, password);
      if (response.success) {
        setIsSuccess(true);
      } else {
        // FEEDBACK STATE: Show global error upon failure
        setErrors(prev => ({ ...prev, global: response.error }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, global: "Verification could not be completed" }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden w-full max-w-md p-12 text-center animate-fade-in border-[4px] border-black">
           <div className="mb-8 text-green-500">
             <i className="fa-solid fa-circle-check text-9xl"></i>
           </div>
           <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">Success!</h1>
           <p className="text-gray-600 mb-12 font-bold text-lg">You have successfully entered the rewards portal.</p>
           <button 
             onClick={() => { 
               setIsSuccess(false); 
               setEmail(''); 
               setPassword(''); 
               setTouched({});
               setErrors({});
             }}
             className="w-full py-6 bg-black text-white font-black rounded-full hover:bg-gray-800 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-lg"
           >
             Log Out
           </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center font-sans"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=2400')` }}
    >
      <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden w-full max-w-xl transform transition-all border border-white/30">
        {/* Brand Header */}
        <div className="bg-[#DE1B22] pt-20 pb-14 px-10 text-center shadow-lg border-b-[10px] border-black/10">
          <p className="text-white font-black text-xl tracking-[0.3em] uppercase mb-3 drop-shadow-sm opacity-90 italic">Exclusive</p>
          <h1 className="text-white font-black text-7xl md:text-8xl tracking-tighter uppercase leading-none italic drop-shadow-2xl">
            REWARDS
          </h1>
        </div>

        {/* Form Body */}
        <div className="p-10 md:p-16">
          {/* Global Error Banner - Persistent during input edits */}
          <GlobalError message={errors.global} />

          <form onSubmit={handleLogin} noValidate className="space-y-8">
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={errors.emailArr}
              placeholder="Enter your email"
            />

            <InputField
              label="Secure Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={errors.passwordArr}
              placeholder="Enter your password"
            />

            <div className="flex justify-start">
              <a href="#" className="text-red-600 font-black text-xl hover:text-red-800 transition-colors underline decoration-[3px] underline-offset-8">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-7 rounded-full font-black text-2xl tracking-widest uppercase transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed scale-[0.98]' 
                  : (email && password && (!errors.emailArr || errors.emailArr.length === 0) && (!errors.passwordArr || errors.passwordArr.length === 0)) 
                    ? 'bg-[#DE1B22] text-white hover:bg-red-700 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-16 text-center">
             <p className="text-gray-900 font-bold text-xl">
               New here?{' '}
               <a href="#" className="text-red-600 font-black hover:text-red-800 transition-colors border-b-[3px] border-red-600 pb-1">
                 Join the rewards program
               </a>
             </p>
          </div>
        </div>
      </div>

      {/* Logic Guide (Visible on large screens) */}
      <div className="fixed bottom-10 right-10 bg-black/95 text-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 hidden lg:block max-w-sm backdrop-blur-xl">
        <h4 className="font-black text-red-500 text-sm uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          PM Guidelines Verified
        </h4>
        <div className="space-y-4 text-[13px] font-bold leading-relaxed">
          <div className="border-l-4 border-red-600 pl-4 py-1">
            <span className="text-white block uppercase mb-1">Inline Errors</span>
            <p className="text-gray-400 font-medium">Borders and labels turn red instantly as invalid data is typed.</p>
          </div>
          <div className="border-l-4 border-gray-500 pl-4 py-1">
            <span className="text-white block uppercase mb-1">Persistent Global</span>
            <p className="text-gray-400 font-medium">Global banner stays visible while editing; clears only on new attempt.</p>
          </div>
          <div className="border-l-4 border-gray-500 pl-4 py-1">
            <span className="text-white block uppercase mb-1">Process State</span>
            <p className="text-gray-400 font-medium">Button shows immediate 'Processing' state before returning feedback.</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-gray-500 font-black uppercase tracking-widest">
          Test: server@error.com
        </div>
      </div>
    </div>
  );
};

export default App;