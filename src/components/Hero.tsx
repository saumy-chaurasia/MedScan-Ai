import React from 'react';
import { Camera, Sparkles, ShieldCheck, Database, AlertTriangle, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScanClick: () => void;
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScanClick, onDemoClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-white/5">
      {/* Liquid Chrome Ambient Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-12 right-12 w-80 h-80 bg-cyan-400/5 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Neumorphic / Liquid Chrome Pill Badge (Gemini 2.0 removed) */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full neu-pill border border-white/10 text-cyan-300 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(0,242,254,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="liquid-chrome-text font-bold">Next-Gen Clinical Vision OCR</span>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            MedScan AI
          </span>
        </div>

        {/* Main Headline with Liquid Chrome Shine */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Decode Any Doctor's Handwriting.{' '}
          <span className="liquid-chrome-cyan-text block sm:inline">
            Formulate a 24-Hour Care Plan
          </span>{' '}
          in Seconds.
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Upload a photo of any handwritten prescription, hospital discharge summary, or pharmacy slip. Receive instant dosage structure, chemical generic conversions, drug-drug interaction safeguards, and hour-by-hour care schedules.
        </p>

        {/* Interactive Call-to-Actions (Liquid Chrome & Neumorphic Raised) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          {/* Primary Button */}
          <button
            onClick={onScanClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl liquid-chrome-button text-slate-950 font-black text-base cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>Scan Prescription</span>
          </button>

          {/* Secondary Button */}
          <button
            onClick={onDemoClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-white font-bold text-base transition-all duration-300 backdrop-blur-xl cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
            <span className="liquid-chrome-text">Try Live Interactive Demo</span>
          </button>
        </div>

        {/* Social Proof Metric Bar in Neumorphic Glassy Cards */}
        <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Stat 1 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-3xl glass-card-premium neu-flat">
            <div className="w-12 h-12 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-white font-mono liquid-chrome-text">&gt;98.4%</div>
              <div className="text-xs text-slate-400 font-medium">OCR Clinical Accuracy</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-3xl glass-card-premium neu-flat">
            <div className="w-12 h-12 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
              <Database className="w-6 h-6 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-white font-mono liquid-chrome-text">120,000+</div>
              <div className="text-xs text-slate-400 font-medium">Indian &amp; Global Generics</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-3xl glass-card-premium neu-flat">
            <div className="w-12 h-12 rounded-2xl neu-raised border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-white font-mono liquid-chrome-text">Real-Time</div>
              <div className="text-xs text-slate-400 font-medium">Multi-Drug Hazard Matrix</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onScanClick}
            className="text-slate-500 hover:text-cyan-400 transition-colors p-2.5 rounded-full neu-raised cursor-pointer animate-bounce border border-white/5"
            title="Scroll down to scanner"
          >
            <ArrowDown className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
