import React from 'react';
import { Camera, Sparkles, ShieldCheck, Database, AlertTriangle, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScanClick: () => void;
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScanClick, onDemoClick }) => {
  return (
    <section className="relative overflow-hidden pt-14 pb-18 md:pt-24 md:pb-28 border-b border-white/5">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        
        {/* Main Headline with Dynamic Liquid Chrome Sheen */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08] select-none">
          Decode Any Doctor's Handwriting.{' '}
          <span className="liquid-chrome-cyan-text block sm:inline">
            Formulate a 24-Hour Care Plan
          </span>{' '}
          in Seconds.
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Upload a photo of any handwritten prescription, clinic discharge summary, or pharmacy slip. Receive instant dosage structure, chemical generic conversions, drug-drug interaction safeguards, and hour-by-hour care schedules.
        </p>

        {/* Interactive Call-to-Actions (Liquid Chrome & Neumorphic Raised) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          {/* Primary Button */}
          <button
            onClick={onScanClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl liquid-chrome-button text-slate-950 font-black text-base cursor-pointer"
          >
            <Camera className="w-5 h-5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
            <span>Scan Prescription</span>
          </button>

          {/* Secondary Button */}
          <button
            onClick={onDemoClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl neu-raised border border-white/15 hover:border-cyan-400/50 text-white font-bold text-base transition-all duration-300 backdrop-blur-2xl cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(0,242,254,0.7)]" />
            <span className="liquid-chrome-silver-text font-black">Try Live Interactive Demo</span>
          </button>
        </div>

        {/* Social Proof Metric Bar in Neumorphic Glassy Cards */}
        <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Stat 1 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-5 rounded-3xl glass-card-premium neu-flat">
            <div className="w-13 h-13 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_10px_rgba(0,242,254,0.6)]" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white font-mono liquid-chrome-text">&gt;98.4%</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide">OCR Clinical Accuracy</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-5 rounded-3xl glass-card-premium neu-flat">
            <div className="w-13 h-13 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
              <Database className="w-6 h-6 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white font-mono liquid-chrome-text">120,000+</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide">Indian &amp; Global Generics</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-5 rounded-3xl glass-card-premium neu-flat">
            <div className="w-13 h-13 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-6 h-6 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white font-mono liquid-chrome-text">Real-Time</div>
              <div className="text-xs text-slate-400 font-semibold tracking-wide">Multi-Drug Hazard Matrix</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator with Neumorphic Ring */}
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
