import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  CheckCircle2, 
  Globe, 
  LogOut, 
  Stethoscope, 
  Heart,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types/prescription';
import { useLang } from '../contexts/LanguageContext';
import { 
  isAccountRegistered, 
  registerAccount, 
  saveUserProfile, 
  getRegisteredAccounts,
  getStoredHistory
} from '../services/storage';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout?: () => void;
  currentUser?: UserProfile | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBack,
  onLoginSuccess,
  onLogout,
  currentUser,
}) => {
  const { t, lang, toggleLang } = useLang();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'patient' | 'clinician'>('clinician');
  const [showPassword, setShowPassword] = useState(false);
  const [autoNotice, setAutoNotice] = useState<'auto_signup' | 'auto_login' | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Email change handler with automatic shift to Sign Up if new account detected
  const handleEmailChange = (val: string) => {
    setEmail(val);
    setAutoNotice(null);

    const clean = val.trim().toLowerCase();
    // Validate email pattern
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);

    if (isEmailValid) {
      const registered = isAccountRegistered(clean);
      if (!registered && mode === 'login') {
        // Automatically shift to signup for new accounts
        setMode('signup');
        setAutoNotice('auto_signup');
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 150);
      } else if (registered && mode === 'signup') {
        // Recognized existing account
        setMode('login');
        setAutoNotice('auto_login');
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase() || 'user@medscan.health';
    const registered = isAccountRegistered(cleanEmail);

    // If attempting to login with an unknown account, auto shift to Sign Up
    if (mode === 'login' && !registered) {
      setMode('signup');
      setAutoNotice('auto_signup');
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
      return;
    }

    // Process Login or Registration
    const displayName = fullName.trim() || (cleanEmail.split('@')[0].replace(/[._]/g, ' ') || 'User');
    const userRole = role;

    if (mode === 'signup') {
      registerAccount({
        email: cleanEmail,
        name: displayName,
        role: userRole,
      });
    }

    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: displayName,
      email: cleanEmail,
      role: userRole,
    };

    saveUserProfile(profile);
    onLoginSuccess(profile);
  };

  // Demo 1-Click Login — logs in as Patient Demo and guarantees history is saved on user's device
  const handleDemoLogin = () => {
    const demoProfile: UserProfile = {
      id: 'demo-patient-local',
      name: 'Patient Demo',
      email: 'patient.demo@medscan.ai',
      phone: '+91 98765 43210',
      blood_group: 'B+ Positive',
      known_allergies: ['Penicillin (Mild rash)'],
      role: 'patient',
    };

    registerAccount({
      email: demoProfile.email,
      name: demoProfile.name,
      role: 'patient',
    });
    saveUserProfile(demoProfile);

    // Initialize & persist history on the user's laptop or device
    getStoredHistory();

    onLoginSuccess(demoProfile);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden relative flex flex-col justify-between p-3 sm:p-4 md:p-5 text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Video using Login.mp4 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover select-none pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="/Login.mp4" type="video/mp4" />
      </video>

      {/* Dark Blur Overlay for readability */}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-[#06080F]/70 via-[#06080F]/60 to-[#06080F]/85 backdrop-blur-[2px]" 
        style={{ zIndex: 1 }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-1 shrink-0">
        
        {/* Brand Logo & Back to Home */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-raised border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer group"
            title={t('login_back_home')}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">{t('login_back_home')}</span>
          </button>

          <div 
            onClick={onBack}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-xl neu-raised border border-white/15 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/50 transition-colors">
              <Shield className="w-4 h-4 drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
            </div>
            <div className="hidden xs:block">
              <div className="text-base font-black tracking-tight text-white flex items-center gap-1 leading-none">
                <span className="liquid-chrome-text">MedScan</span>
                <span className="liquid-chrome-cyan-text font-black">AI</span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider mt-0.5">
                CLINICAL VISION PORTAL
              </p>
            </div>
          </div>
        </div>

        {/* Language Selector & Skip to Dashboard */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-cyan-400/30 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            title={lang === 'en' ? 'Explore without signing in' : 'बिना साइन इन किए देखें'}
          >
            <span>{lang === 'en' ? 'Guest Explore' : 'अतिथि प्रवेश'}</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-raised border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all cursor-pointer"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{lang === 'en' ? 'EN' : 'HI'}</span>
            </button>

            {langOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 w-28 rounded-xl glass-card-premium border border-white/10 overflow-hidden z-50 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      if (lang !== 'en') toggleLang();
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      lang === 'en' ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (lang !== 'hi') toggleLang();
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      lang === 'hi' ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Center Auth Card — Sized for Single Screen view with Zero Scrolling in Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto flex-1 flex flex-col justify-center py-1 sm:py-2 min-h-0">
        <div className="rounded-2xl sm:rounded-3xl glass-card-premium neu-flat p-3.5 sm:p-5 shadow-2xl border border-white/15 relative overflow-hidden backdrop-blur-2xl">
          
          {/* Subtle glowing ambient pulse */}
          <div className="absolute -top-24 -right-24 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Current User Session Overview (if signed in) */}
          {currentUser && (
            <div className="mb-2.5 p-2 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg neu-raised border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  {(currentUser.name.includes('Alistair') ? 'Patient Demo' : currentUser.name).charAt(0)}
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 font-mono uppercase leading-none">{t('login_active_session')}</div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentUser.name.includes('Alistair') ? 'Patient Demo' : currentUser.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-2.5 py-1 rounded-lg liquid-chrome-button text-slate-950 text-xs font-black cursor-pointer"
                >
                  Continue
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1 rounded-lg neu-raised text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
                    title={t('login_switch_profile')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Compact Header Icon & Title */}
          <div className="text-center mb-2.5">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl neu-raised border border-cyan-400/30 text-cyan-400 mb-1 shadow-[0_0_12px_rgba(0,242,254,0.25)]">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white liquid-chrome-text leading-tight">
              {mode === 'login' ? t('login_title_signin') : t('login_title_signup')}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto line-clamp-1">
              {mode === 'login' ? t('login_subtitle_signin') : t('login_subtitle_signup')}
            </p>
          </div>

          {/* Auto-Shift Dynamic Notification Pill */}
          {autoNotice && (
            <div className="mb-2 p-1.5 rounded-xl bg-cyan-950/50 border border-cyan-400/40 text-cyan-200 text-xs flex items-center gap-2 animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-semibold text-[11px]">
                {autoNotice === 'auto_signup' ? t('login_auto_shift_msg') : t('login_auto_login_msg')}
              </span>
            </div>
          )}

          {/* Single Dedicated Demo Login Button — Patient Demo Login */}
          <div className="mb-2.5">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-teal-500/20 hover:from-cyan-500/35 hover:via-blue-600/35 hover:to-teal-500/35 border border-cyan-400/60 hover:border-cyan-300 text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-[0_0_15px_rgba(0,242,254,0.25)] hover:shadow-[0_0_25px_rgba(0,242,254,0.45)] transition-all duration-300 cursor-pointer group hover:scale-[1.01]"
              title="Patient Demo Login"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    <span className="liquid-chrome-cyan-text">{t('login_demo_btn')}</span>
                    <span className="px-1 py-0.2 rounded text-[8px] font-mono uppercase bg-cyan-400 text-slate-950 font-bold tracking-wider">
                      PATIENT DEMO
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-300 font-sans leading-none mt-0.5">
                    {t('login_demo_sub')}
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-lg bg-white/10 group-hover:bg-cyan-400/30 flex items-center justify-center transition-colors shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-2.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-2.5 bg-[#0a0f1d] text-[10px] font-mono text-slate-400 uppercase tracking-wider backdrop-blur-md rounded-full border border-white/5">
              {t('login_or')}
            </span>
          </div>

          {/* Tab Switcher (Sign In vs Sign Up) */}
          <div className="grid grid-cols-2 p-1 rounded-xl neu-pressed border border-white/5 mb-2.5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setAutoNotice(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'liquid-chrome-button text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('nav_sign_in')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setAutoNotice(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'liquid-chrome-button text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Core Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            
            {/* Full Name field (Only shown on Sign Up mode) */}
            {mode === 'signup' && (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  {t('login_fullname_label')}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl neu-pressed border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all font-sans"
                  />
                </div>
              </div>
            )}

            {/* Email Address field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {t('login_email_label')}
                </label>
                {mode === 'login' && email && !isAccountRegistered(email) && (
                  <span className="text-[9px] text-cyan-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>New account</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="name@clinic.com or user@gmail.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl neu-pressed border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all font-sans"
                />
              </div>
            </div>

            {/* Healthcare Role Selector (Sign Up only) */}
            {mode === 'signup' && (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  {t('login_role_label')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('clinician')}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'clinician'
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.25)]'
                        : 'neu-raised border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{t('login_role_clinician')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'patient'
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                        : 'neu-raised border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{t('login_role_patient')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                {t('login_password_label')}
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2 rounded-xl neu-pressed border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl liquid-chrome-button text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:scale-[1.01] transition-transform cursor-pointer"
              >
                {mode === 'login' ? t('login_signin_btn') : t('login_signup_btn')}
              </button>
            </div>
          </form>

          {/* Toggle link below form */}
          <div className="mt-2.5 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setAutoNotice(null);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer text-xs"
              >
                {t('login_need_acc')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setAutoNotice(null);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer text-xs"
              >
                {t('login_already_have_acc')}
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Compact Footer */}
      <footer className="relative z-10 text-center py-1 text-[10px] text-slate-500 font-mono shrink-0">
        <span>© {new Date().getFullYear()} MedScan AI • HIPAA &amp; ISO-27799 Compliant Health Security</span>
      </footer>

    </div>
  );
};

