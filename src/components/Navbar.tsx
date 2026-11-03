import React, { useState } from 'react';
import { Shield, Sparkles, History, User, ArrowRight, Globe } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { UserProfile } from '../types/prescription';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onOpenApiKey: () => void;
  onSelectSample: (sampleId: string) => void;
  hasActiveResult: boolean;
  apiKeyConfigured: boolean;
  historyCount: number;
  userProfile?: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenHistory,
  onOpenApiKey,
  onSelectSample,
  hasActiveResult,
  apiKeyConfigured,
  historyCount,
  userProfile,
}) => {
  const { lang, t, toggleLang } = useLang();
  const [langOpen, setLangOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#06080F]/40 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl neu-raised border border-white/15 group-hover:border-cyan-400/60 transition-all duration-300">
            <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,242,254,0.6)]" />
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
              <span className="liquid-chrome-text">MedScan</span>
              <span className="liquid-chrome-cyan-text font-black">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse shadow-[0_0_8px_#00F2FE]" />
              <span className="text-slate-300 font-semibold">{t('nav_clinical_vision')}</span>
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-semibold text-slate-300">
          <button
            onClick={() => scrollTo('home-section')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>{t('nav_home')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => scrollTo('features-section')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>{t('nav_features')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => scrollTo('scanner-section')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>{t('nav_live_demo')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => scrollTo('history-section')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group flex items-center gap-1.5"
          >
            <span>{t('nav_history')}</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-mono border border-cyan-400/30 font-bold">
                {historyCount}
              </span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative p-2.5 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Scan History & Records"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-[9px] font-black text-slate-950 flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.8)]">
                {historyCount}
              </span>
            )}
          </button>

          {/* Language Toggle EN / HI */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'EN' : 'HI'}</span>
            </button>
            {langOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-28 rounded-2xl glass-card-premium border border-white/10 overflow-hidden z-50">
                  <button
                    onClick={() => { if (lang !== 'en') toggleLang(); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${lang === 'en' ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { if (lang !== 'hi') toggleLang(); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${lang === 'hi' ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    हिंदी
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sign In / User Profile Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
            title={userProfile ? `Account: ${userProfile.name}` : 'Sign In'}
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {userProfile ? userProfile.name.split(' ')[0] : t('nav_sign_in')}
            </span>
          </button>

          {/* Try Demo CTA */}
          <button
            onClick={() => {
              onSelectSample('sample-antibiotic-resp');
              scrollTo('scanner-section');
            }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl liquid-chrome-button text-slate-950 font-black text-xs sm:text-sm cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>{t('nav_try_demo')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-white/5 bg-[#06080F]/80 backdrop-blur-md px-4 py-2 flex items-center justify-around text-xs font-bold text-slate-300">
        <button
          type="button"
          onClick={() => scrollTo('home-section')}
          className="px-2.5 py-1 rounded-xl neu-raised text-slate-300 hover:text-cyan-300 transition-colors"
        >
          {t('nav_home')}
        </button>
        <button
          type="button"
          onClick={() => scrollTo('features-section')}
          className="px-2.5 py-1 rounded-xl neu-raised text-slate-300 hover:text-cyan-300 transition-colors"
        >
          {t('nav_features')}
        </button>
        <button
          type="button"
          onClick={() => scrollTo('scanner-section')}
          className="px-2.5 py-1 rounded-xl neu-raised text-slate-300 hover:text-cyan-300 transition-colors"
        >
          {t('nav_live_demo')}
        </button>
        <button
          type="button"
          onClick={() => scrollTo('history-section')}
          className="px-2.5 py-1 rounded-xl neu-raised text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          <span>{t('nav_history')}</span>
          {historyCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black flex items-center justify-center">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
