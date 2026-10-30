import React from 'react';
import { ShieldCheck, AlertOctagon, Wine, Milk, Droplets, Ban } from 'lucide-react';

interface DietaryGuardrailsProps {
  warnings: string[];
}

export const DietaryGuardrails: React.FC<DietaryGuardrailsProps> = ({ warnings }) => {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertOctagon className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          Dietary &amp; Lifestyle Guardrails
        </h4>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Specific food components, beverages, and minerals can drastically alter pharmacokinetic absorption or trigger serious adverse hepatic reactions.
      </p>

      {/* Bulleted Guardrail Items */}
      <ul className="space-y-2.5">
        {warnings && warnings.length > 0 ? (
          warnings.map((warning, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
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
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
          <Wine className="w-3 h-3 text-rose-400" />
          <span>Alcohol: Prohibited</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
          <Droplets className="w-3 h-3 text-cyan-400" />
          <span>Min 2.5L Water/Day</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <Ban className="w-3 h-3 text-amber-400" />
          <span>Grapefruit / Heavy Citrus</span>
        </span>
      </div>
    </div>
  );
};

