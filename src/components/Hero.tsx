import React from 'react';
import { Camera, Sparkles, ShieldCheck, Database, AlertTriangle, ArrowDown } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

interface HeroProps {
  onScanClick: () => void;
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScanClick, onDemoClick }) => {
  const { t } = useLang();
  return (
    <section id="home-section" className="relative overflow-hidden pt-14 pb-18 md:pt-24 md:pb-28 border-b border-white/5">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08] select-none">
          {t('hero_h1_a')}{' '}
          <span className="liquid-chrome-cyan-text block sm:inline">
            {t('hero_h1_b')}
          </span>{' '}
          {t('hero_h1_c')}
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          {t('hero_sub')}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <button
            onClick={onScanClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl liquid-chrome-button text-slate-950 font-black text-base cursor-pointer"
          >
            <Camera className="w-5 h-5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
            <span>{t('hero_scan_btn')}</span>
          </button>

          <button
            onClick={onDemoClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl neu-raised border border-white/15 hover:border-cyan-400/50 text-white font-bold text-base transition-all duration-300 backdrop-blur-2xl cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(0,242,254,0.7)]" />
            <span className="liquid-chrome-silver-text font-black">{t('hero_demo_btn')}</span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center sm:justify-start gap-4 p-5 rounded-3xl glass-card-premium neu-flat">
            <div className="w-13 h-13 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_10px_rgba(0,242,254,0.6)]" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white font-mono liquid-chrome-text">&gt;98.4%</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide">{t('hero_stat1_label')}</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 p-5 rounded-3xl glass-card-premium neu-flat">
            <div className="w-13 h-13 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
              <Database className="w-6 h-6 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white font-mono liquid-chrome-text">{t('hero_stat2_val')}</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide">{t('hero_stat2_label')}</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 p-5 rounded-3xl glass-card-premium neu-flat">
            <div className="w-13 h-13 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-6 h-6 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white font-mono liquid-chrome-text">{t('hero_stat3_val')}</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide">{t('hero_stat3_label')}</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onScanClick}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-3 rounded-full neu-raised cursor-pointer animate-bounce border border-white/10"
            title="Scroll down to scanner"
          >
            <ArrowDown className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
