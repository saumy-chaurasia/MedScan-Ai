import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Info, Flame } from 'lucide-react';
import { DrugInteraction, InteractionSeverity } from '../types/prescription';

interface InteractionAlertsProps {
  interactions: DrugInteraction[];
}

export const InteractionAlerts: React.FC<InteractionAlertsProps> = ({ interactions }) => {
  if (!interactions || interactions.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>No adverse drug-drug interactions detected between prescribed medications.</span>
      </div>
    );
  }

  const getSeverityBadge = (severity: InteractionSeverity) => {
    switch (severity) {
      case 'Critical':
        return {
          wrapper: 'bg-red-950/30 border-red-500/50 hover:border-red-400',
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: <Flame className="w-4 h-4 text-red-400" />,
          title: 'Critical Clinical Hazard',
        };
      case 'High':
        return {
          wrapper: 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
          title: 'High Risk Interaction',
        };
      case 'Moderate':
        return {
          wrapper: 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          title: 'Moderate Interaction Notice',
        };
      case 'Low':
      default:
        return {
          wrapper: 'bg-blue-950/20 border-blue-500/30 hover:border-blue-400',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          icon: <Info className="w-4 h-4 text-blue-400" />,
          title: 'Minor Clinical Observation',
        };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-xl neu-raised text-rose-400 border border-white/5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-white">
          Multi-Drug Hazard Matrix ({interactions.length})
        </h3>
      </div>

      {interactions.map((interaction, idx) => {
        const style = getSeverityBadge(interaction.severity);

        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl glass-card-premium neu-flat border transition-all duration-300 shadow-sm ${style.wrapper}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                {style.icon}
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  {style.title}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase ${style.badge}`}>
                {interaction.severity} Severity
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {interaction.description}
            </p>

            {interaction.action_recommended && (
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-start gap-1.5 text-xs text-amber-200/90 font-medium">
                <span className="text-amber-400 font-bold shrink-0">Guidance:</span>
                <span>{interaction.action_recommended}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
