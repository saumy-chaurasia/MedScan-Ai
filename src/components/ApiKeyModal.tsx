import React, { useState } from 'react';
import { X, Key, Check, ShieldCheck, Sparkles, ExternalLink, Cpu } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (hasKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setSaveSuccess(true);
    onKeySaved(!!apiKey.trim());

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    onKeySaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl glass-card-premium neu-flat p-6 sm:p-8 shadow-2xl border border-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl neu-raised text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl neu-raised border border-cyan-400/30 text-cyan-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white liquid-chrome-text">Clinical Vision AI Engine</h3>
            <p className="text-xs text-slate-400">
              Configure multimodal vision reasoning for doctor handwriting &amp; pharmacology
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Settings saved successfully! Clinical vision engine is active.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Active Engine Indicator */}
          <div className="p-4 rounded-2xl neu-raised border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multimodal Clinical Vision Engine</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sub-second handwriting transcription, INN generic formulation, and 24-hour chronotherapy calculation.
            </p>
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Google AI Studio API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-2xl neu-pressed border border-white/5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed font-mono">
              * Note: Pre-configured keys or presets run immediately. Custom keys are encrypted locally in your private browser storage.
            </p>
          </div>

          {/* Security Note */}
          <div className="p-3.5 rounded-2xl neu-pressed border border-white/5 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Keys remain private to your local browser session and are never transmitted to any third-party logging server.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer font-semibold"
              >
                Clear Saved Key
              </button>
            ) : <span />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl neu-raised text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl liquid-chrome-button text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
