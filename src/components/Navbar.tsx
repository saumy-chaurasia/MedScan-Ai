import React, { useState, useEffect } from 'react';
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

type SectionId = 'home' | 'scanner' | 'features' | 'history';

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
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  // Scroll Spy to detect which section the user is currently looking at
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Top of page is always 'home'
      if (scrollY < 180) {
        setActiveSection('home');
        return;
      }

      // If scrolled near bottom of page, highlight the last section
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('features');
        return;
      }

      // Check sections from bottom to top of page
      const sections: { id: SectionId; elementId: string }[] = [
        { id: 'features', elementId: 'features-section' },
        { id: 'history', elementId: 'history-section' },
        { id: 'scanner', elementId: 'scanner-section' },
        { id: 'home', elementId: 'home-section' },
      ];

      const navOffset = 220;
      for (const sec of sections) {
        const el = document.getElementById(sec.elementId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            setActiveSection(sec.id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (sectionId: SectionId, elementId: string) => {
    setActiveSection(sectionId);
    scrollTo(elementId);
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

        {/* Navigation Links with Curved Rectangular Active Indicator */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 p-1.5 rounded-2xl glass-card-premium neu-pressed border border-white/10 text-sm font-semibold text-slate-300">
          <button
            type="button"
            onClick={() => handleNavClick('home', 'home-section')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'home'
                ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.35)] font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {activeSection === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00F2FE]" />
            )}
            <span>{t('nav_home')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('scanner', 'scanner-section')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'scanner'
                ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.35)] font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {activeSection === 'scanner' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00F2FE]" />
            )}
            <span>{t('nav_scan_prescription')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('features', 'features-section')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'features'
                ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.35)] font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {activeSection === 'features' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00F2FE]" />
            )}
            <span>{t('nav_features')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('history', 'history-section')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'history'
                ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.35)] font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {activeSection === 'history' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00F2FE]" />
            )}
            <span>{t('nav_history')}</span>
            {historyCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono border font-bold ${
                  activeSection === 'history'
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                    : 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30'
                }`}
              >
                {historyCount}
              </span>
            )}
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

      {/* Mobile Sub-Navigation Bar with Curved Rectangular Active Indicator */}
      <div className="md:hidden border-t border-white/10 bg-[#06080F]/90 backdrop-blur-md px-3 py-1.5 flex items-center justify-around text-xs font-bold text-slate-300">
        <button
          type="button"
          onClick={() => handleNavClick('home', 'home-section')}
          className={`px-3 py-1 rounded-xl transition-all duration-300 ${
            activeSection === 'home'
              ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.35)] font-black'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          {t('nav_home')}
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('scanner', 'scanner-section')}
          className={`px-3 py-1 rounded-xl transition-all duration-300 ${
            activeSection === 'scanner'
              ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.35)] font-black'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          {t('nav_scan_prescription')}
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('features', 'features-section')}
          className={`px-3 py-1 rounded-xl transition-all duration-300 ${
            activeSection === 'features'
              ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.35)] font-black'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          {t('nav_features')}
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('history', 'history-section')}
          className={`px-3 py-1 rounded-xl transition-all duration-300 flex items-center gap-1 ${
            activeSection === 'history'
              ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.35)] font-black'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <span>{t('nav_history')}</span>
          {historyCount > 0 && (
            <span
              className={`w-3.5 h-3.5 rounded-full text-[9px] font-black flex items-center justify-center ${
                activeSection === 'history'
                  ? 'bg-cyan-400 text-slate-950'
                  : 'bg-cyan-400/30 text-cyan-200'
              }`}
            >
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
