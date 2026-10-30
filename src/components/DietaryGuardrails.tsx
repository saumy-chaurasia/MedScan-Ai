import React from 'react';
import { AlertOctagon, Wine, Droplets, Ban } from 'lucide-react';

interface DietaryGuardrailsProps {
  warnings: string[];
}

export const DietaryGuardrails: React.FC<DietaryGuardrailsProps> = ({ warnings }) => {
  return (
    <div className="rounded-3xl glass-card-premium neu-flat p-5 sm:p-6 shadow-md">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-2 rounded-xl neu-raised text-amber-400 border border-white/5">
          <AlertOctagon className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
          Dietary &amp; Lifestyle Guardrails
        </h4>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Specific food components, minerals, and beverages alter bioavailability or trigger toxic hepatic reactions.
      </p>

      {/* Bulleted Guardrail Items */}
      <ul className="space-y-2.5">
        {warnings && warnings.length > 0 ? (
          warnings.map((warning, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-200 neu-pressed p-3 rounded-xl border border-white/5 leading-relaxed"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              <span>{warning}</span>
            </li>
          ))
        ) : (
          <li className="text-xs text-slate-400">
            Maintain adequate hydration and take medications with a full glass of water.
          </li>
        )}
      </ul>

      {/* Common Guardrail Pills */}
      <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-raised border border-rose-500/30 text-rose-300">
          <Wine className="w-3 h-3 text-rose-400" />
          <span>Alcohol: Prohibited</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-raised border border-cyan-500/30 text-cyan-300">
          <Droplets className="w-3 h-3 text-cyan-400" />
          <span>Min 2.5L Water/Day</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-raised border border-amber-500/30 text-amber-300">
          <Ban className="w-3 h-3 text-amber-400" />
          <span>Avoid Grapefruit Juice</span>
        </span>
      </div>
    </div>
  );
};
