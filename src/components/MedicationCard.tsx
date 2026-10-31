import React from 'react';
import { Sparkles, Calendar, Info } from 'lucide-react';
import { Medication } from '../types/prescription';
import { useLang } from '../contexts/LanguageContext';

interface MedicationCardProps {
  medication: Medication;
  index: number;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, index }) => {
  const { t } = useLang();
  const getSlotBadgeColor = (slot: string) => {
    const s = slot.toLowerCase();
    if (s.includes('morning') || s.includes('breakfast')) {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    }
    if (s.includes('afternoon') || s.includes('lunch')) {
      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
    }
    if (s.includes('evening') || s.includes('dinner')) {
      return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    }
    if (s.includes('bedtime') || s.includes('night')) {
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
    return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  };

  return (
    <div className="rounded-2xl glass-card-premium neu-flat p-4 sm:p-5 transition-all duration-300 group shadow-md hover:border-cyan-400/40">
      {/* Top Row: Index, Brand Name & Generic Formula */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl neu-raised border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0 mt-0.5">
            0{index + 1}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                {medication.brand_name}
              </h4>
              {medication.food_relation && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono neu-pill border border-white/5 text-slate-300">
                  {medication.food_relation}
                </span>
              )}
            </div>

            {/* Generic Chemical Mapping: Green badge showing exact active ingredient */}
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{t('med_generic')} {medication.generic_name}</span>
            </div>
          </div>
        </div>

        {/* Dosage & Frequency Badges */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 mt-2 sm:mt-0 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-xl neu-raised text-slate-100 font-bold border border-white/10">
            {medication.dosage}
          </span>
          <span className="text-[11px] text-cyan-400 font-bold">
            {medication.frequency}
          </span>
        </div>
      </div>

      {/* Middle Row: Duration & Designated Timing Slots */}
      <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{t('med_duration')} <strong className="text-slate-200 font-mono">{medication.duration || 'As prescribed'}</strong></span>
        </div>

        {/* Categorized pill tags for Morning, Afternoon, Evening, Bedtime */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-500 uppercase font-mono mr-1">Slots:</span>
          {medication.timing_slots && medication.timing_slots.length > 0 ? (
            medication.timing_slots.map((slot, sIdx) => (
              <span
                key={sIdx}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${getSlotBadgeColor(
                  slot
                )}`}
              >
                {slot}
              </span>
            ))
          ) : (
            <span className="text-slate-500 text-xs">As advised</span>
          )}
        </div>
      </div>

      {/* Special Instructions / Advice Box */}
      {medication.special_instructions && (
        <div className="mt-3 p-3 rounded-xl neu-pressed border border-white/5 text-xs text-slate-300 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{medication.special_instructions}</span>
        </div>
      )}
    </div>
  );
};
