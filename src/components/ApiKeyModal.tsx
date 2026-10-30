import React, { useState } from 'react';
import { X, Key, Check, ShieldCheck, Sparkles, ExternalLink, Cpu } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, getStoredModel, setStoredModel } from '../services/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (hasKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [model, setModel] = useState(getStoredModel());
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setStoredModel(model);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Google Gemini Engine Settings</h3>
            <p className="text-xs text-slate-400">
              Configure live AI Vision models for handwriting transcription &amp; pharmacology
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Settings saved successfully! Live Gemini vision is active.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* AI Model Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Vision AI Model
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModel('gemini-1.5-flash')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  model === 'gemini-1.5-flash'
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gemini 1.5 Flash</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Sub-second handwriting OCR &amp; structured JSON
                </div>
              </button>

              <button
                type="button"
                onClick={() => setModel('gemini-2.0-flash')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  model === 'gemini-2.0-flash'
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>Gemini 2.0 Flash</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Advanced multimodal reasoning &amp; complex scripts
                </div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
              * Optional: If no key is entered, MediLens seamlessly runs with its built-in high-fidelity clinical intelligence engine and sample scenarios.
            </p>
          </div>

          {/* Security Note */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Keys are strictly saved in your browser's private local storage and never transmitted to any third-party analytics servers.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                Clear Saved Key
              </button>
            ) : <span />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
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

