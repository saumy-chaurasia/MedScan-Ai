import React from 'react';
import { Camera, Sparkles, ShieldCheck, Database, AlertTriangle, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScanClick: () => void;
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScanClick, onDemoClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/60">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/5 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_18px_rgba(6,182,212,0.15)] animate-pulse-subtle">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>✨ Powered by Gemini 1.5/2.0 Vision OCR</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Decode Any Doctor's Handwriting.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
            Formulate a 24-Hour Care Plan
          </span>{' '}
          in Seconds.
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Upload a photo of any prescription or discharge summary. Get instant, easy-to-read medical breakdown, drug interaction alerts, and timed care schedules.
        </p>

        {/* Interactive Call-to-Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          {/* Primary Button */}
          <button
            onClick={onScanClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-base shadow-[0_0_30px_rgba(0,242,254,0.35)] hover:shadow-[0_0_40px_rgba(0,242,254,0.55)] transition-all duration-300 cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>Scan Prescription</span>
          </button>

          {/* Secondary Button */}
          <button
            onClick={onDemoClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border border-slate-700 hover:border-cyan-500/50 bg-slate-900/80 hover:bg-slate-800/90 text-white font-semibold text-base transition-all duration-300 backdrop-blur-md cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Try Live Interactive Demo</span>
          </button>
        </div>

        {/* Social Proof Metric Bar */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Stat 1 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white font-mono">&gt;98.4%</div>
              <div className="text-xs text-slate-400">OCR Clinical Accuracy</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white font-mono">120,000+</div>
              <div className="text-xs text-slate-400">Indian &amp; Global Generics</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white font-mono">Real-Time</div>
              <div className="text-xs text-slate-400">Instant Hazard Flags</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onScanClick}
            className="text-slate-500 hover:text-cyan-400 transition-colors p-2 rounded-full cursor-pointer animate-bounce"
            title="Scroll down to scanner"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

