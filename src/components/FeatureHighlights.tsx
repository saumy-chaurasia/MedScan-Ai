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
        'Decodes low-contrast, messy doctor script and faded hospital discharge copies with clinical vision LLM weights.',
      badge: 'Vision OCR',
    },
    {
      icon: <Database className="w-6 h-6 text-blue-400" />,
      title: 'Indian & Global Brand Index',
      description:
        'Resolves trade brand names (e.g., Augmentin, Pantocid, Dolo, Glycomet-GP) into active international non-proprietary generic compounds.',
      badge: '120k+ Mappings',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
      title: 'Multi-Drug Hazard Matrix',
      description:
        'Evaluates concurrent drug-drug interactions, contraindications, and hepatic/renal metabolic cautions in real time.',
      badge: 'Real-Time Flags',
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      title: 'Smart Chrono-Scheduler',
      description:
        'Distributes dosages across 24 hours to maximize bio-absorption, minimize gastric irritation, and separate conflicting minerals.',
      badge: 'Chronotherapy',
    },
  ];

  return (
    <section id="features-section" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-pill border border-white/10 text-cyan-300 text-xs font-mono font-bold mb-3">
            <span>Safety &amp; Clinical Adherence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <span className="liquid-chrome-text">Engineered for </span>
            <span className="liquid-chrome-cyan-text">Clinical Intelligence</span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Eliminating medication errors from illegible scripts, unflagged interactions, and missed dosage schedules.
          </p>
        </div>

        {/* 4 Glowing Cards Grid (Neumorphic + Glassy) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-3xl glass-card-premium neu-flat p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:border-cyan-400/50"
              onClick={onScanClick}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl neu-raised border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full neu-pill border border-white/5 text-slate-300">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                <span>Scan Prescription</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
