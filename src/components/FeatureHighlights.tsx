import React from 'react';
import { PenTool, Database, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

interface FeatureHighlightsProps {
  onScanClick: () => void;
}

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({ onScanClick }) => {
  const { t } = useLang();

  const features = [
    {
      icon: <PenTool className="w-6 h-6 text-cyan-400" />,
      title: t('feat_1_title'),
      description: t('feat_1_desc'),
      badge: t('feat_1_badge'),
    },
    {
      icon: <Database className="w-6 h-6 text-blue-400" />,
      title: t('feat_2_title'),
      description: t('feat_2_desc'),
      badge: t('feat_2_badge'),
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
      title: t('feat_3_title'),
      description: t('feat_3_desc'),
      badge: t('feat_3_badge'),
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      title: t('feat_4_title'),
      description: t('feat_4_desc'),
      badge: t('feat_4_badge'),
    },
  ];

  return (
    <section id="features-section" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-pill border border-white/10 text-cyan-300 text-xs font-mono font-bold mb-3">
            <span>{t('feat_badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <span className="liquid-chrome-text">{t('feat_h2_a')}</span>
            <span className="liquid-chrome-cyan-text">{t('feat_h2_b')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {features.map((f, i) => (
            <div key={i} className="group p-6 rounded-3xl glass-card-premium neu-flat flex flex-col gap-4 cursor-default">
              <div className="w-12 h-12 rounded-2xl neu-raised border border-white/10 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="inline-block text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-2.5 py-0.5 rounded-full mb-2">
                  {f.badge}
                </div>
                <h3 className="text-base font-black text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onScanClick}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl liquid-chrome-button text-slate-950 font-black text-sm cursor-pointer"
          >
            <span>{t('feat_cta')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
