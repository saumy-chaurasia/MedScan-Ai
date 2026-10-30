import React from 'react';
import { PenTool, Database, ShieldAlert, Clock, ArrowRight } from 'lucide-react';

interface FeatureHighlightsProps {
  onScanClick: () => void;
}

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({ onScanClick }) => {
  const features = [
    {
      icon: <PenTool className="w-6 h-6 text-cyan-400" />,
      title: 'Handwriting AI Engine',
      description:
        'Handles low-contrast, messy doctor script and faded carbon copies with fine-tuned contextual clinical LLM vision models.',
      badge: 'Vision 2.0',
      glowClass: 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    },
    {
      icon: <Database className="w-6 h-6 text-blue-400" />,
      title: 'Indian & Global Brand Index',
      description:
        'Resolves regional trade brand names (e.g., Crocin, Pantocid, Shelcal, Augmentin) to exact generic active compounds automatically.',
      badge: '120k+ Mappings',
      glowClass: 'hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
      title: 'Multi-Drug Hazard Matrix',
      description:
        'Automatically evaluates concurrent drug interactions, contraindications, and hepatic/renal risks across multiple prescriptions.',
      badge: 'Real-Time Flags',
      glowClass: 'hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      title: 'Smart Chrono-Scheduler',
      description:
        'Spreads out dosages across 24 hours to maximize bioavailability, minimize gastric distress, and separate conflicting minerals.',
      badge: 'Chronotherapy',
      glowClass: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    },
  ];

  return (
    <section id="features-section" className="py-16 md:py-24 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-3">
            <span>Safety &amp; Clinical Adherence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Precision Medical Intelligence
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Eliminating medication errors from illegible scripts, conflicting timing, and unflagged drug interactions.
          </p>
        </div>

        {/* 4 Glowing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`rounded-3xl bg-[#111827] border border-slate-800 p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer group ${feature.glowClass}`}
              onClick={onScanClick}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Explore feature</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

