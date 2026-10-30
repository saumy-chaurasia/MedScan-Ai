import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenApiKey: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApiKey }) => {
  return (
    <footer className="border-t border-white/5 bg-[#05070D] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl neu-raised border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                <span className="liquid-chrome-text">MedScan</span> <span className="liquid-chrome-cyan-text">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Clinical prescription vision platform. Translates illegible doctor handwriting into structured dosages, generic chemical mappings, and chronotherapeutic 24-hour schedules.
            </p>
          </div>

          {/* Quick Links (Docs removed per user request) */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3 font-mono">Platform</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#scanner-section" className="hover:text-cyan-400 transition-colors">
                  Prescription Scanner
                </a>
              </li>
              <li>
                <a href="#care-plan-section" className="hover:text-cyan-400 transition-colors">
                  24-Hour Care Plan
                </a>
              </li>
              <li>
                <a href="#features-section" className="hover:text-cyan-400 transition-colors">
                  Clinical Features
                </a>
              </li>
              <li>
                <button onClick={onOpenApiKey} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  AI Engine Configuration
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3 font-mono">Clinical Safety</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li>WHO INN Chemical Standardization</li>
              <li>ISO-27799 Health Informatics</li>
              <li>Local Browser-Side Encryption</li>
              <li>Zero Data Transmission Mode</li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer Box (Neumorphic Inset) */}
        <div className="p-4 rounded-2xl neu-pressed border border-white/5 text-[11px] text-slate-400 leading-relaxed mb-8">
          <strong className="text-slate-200">Clinical Decision Support Disclaimer:</strong> MedScan AI is an artificial intelligence-assisted decision support system designed to assist patients, caregivers, and clinicians in understanding prescriptions and organizing medication schedules. It is not intended to replace professional clinical diagnosis, prescription alterations, or physician advice. Always consult a qualified medical practitioner or pharmacist before modifying any treatment regimen.
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} MedScan AI Healthcare Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span>Precision Medical Vision &amp; Chronotherapy Engine</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
