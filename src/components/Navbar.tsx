import React from 'react';
import { Shield, Sparkles, History, Key, User, FileText, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onOpenApiKey: () => void;
  onOpenDocs: () => void;
  onSelectSample: (sampleId: string) => void;
  hasActiveResult: boolean;
  apiKeyConfigured: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenHistory,
  onOpenApiKey,
  onOpenDocs,
  onSelectSample,
  hasActiveResult,
  apiKeyConfigured,
  historyCount,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm group-hover:bg-cyan-400/20 transition-colors" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>MediLens</span>
              <span className="text-cyan-400 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Clinical Vision OCR
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollTo('features-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo('scanner-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Live Demo
          </button>
          <button
            onClick={() => scrollTo('care-plan-section')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              hasActiveResult ? 'text-cyan-400 font-semibold' : 'hover:text-cyan-400'
            }`}
          >
            <span>Care Plan</span>
            {hasActiveResult && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={onOpenDocs}
            className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Docs / API</span>
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:text-white text-slate-300 transition-all cursor-pointer"
            title="Scan History & Records"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950 flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Gemini API Key Settings */}
          <button
            onClick={onOpenApiKey}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              apiKeyConfigured
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
            }`}
            title="Configure Gemini 1.5/2.0 API Key"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">
              {apiKeyConfigured ? 'Gemini 2.0 Live' : 'API Key'}
            </span>
          </button>

          {/* Sign In / Register (Ghost button style with light gray border) */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700/80 hover:border-slate-500 text-sm font-medium text-slate-200 hover:text-white bg-transparent transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign In</span>
          </button>

          {/* Try Demo CTA Button (Cyan/blue gradient fill with dark text, bold hover state) */}
          <button
            onClick={() => {
              onSelectSample('sample-antibiotic-resp');
              scrollTo('scanner-section');
            }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Try Demo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

