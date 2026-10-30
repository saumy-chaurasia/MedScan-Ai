import React, { useState } from 'react';
import { CheckCircle2, Sun, CloudSun, Moon, Sunrise } from 'lucide-react';
import { ScheduleSlot } from '../types/prescription';
import confetti from 'canvas-confetti';

interface ScheduleTimelineProps {
  schedule: ScheduleSlot[];
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ schedule }) => {
  const [completedSlots, setCompletedSlots] = useState<Record<number, boolean>>({});

  const toggleSlot = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !completedSlots[idx];
    setCompletedSlots((prev) => ({ ...prev, [idx]: nextState }));

    if (nextState) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 32,
        spread: 50,
        origin: { x, y },
        colors: ['#00F2FE', '#38BDF8', '#10B981', '#FFFFFF'],
        disableForReducedMotion: true,
      });
    }
  };

  const getSlotIcon = (timeSlot: string) => {
    const s = timeSlot.toLowerCase();
    if (s.includes('breakfast') || s.includes('07:') || s.includes('08:') || s.includes('morning')) {
      return <Sunrise className="w-4 h-4 text-amber-400" />;
    }
    if (s.includes('lunch') || s.includes('afternoon') || s.includes('12:') || s.includes('13:') || s.includes('14:') || s.includes('01:') || s.includes('02:')) {
      return <Sun className="w-4 h-4 text-cyan-400" />;
    }
    if (s.includes('dinner') || s.includes('18:') || s.includes('19:') || s.includes('20:') || s.includes('08:00 pm') || s.includes('08:30 pm')) {
      return <CloudSun className="w-4 h-4 text-indigo-400" />;
    }
    return <Moon className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="relative">
      {/* Liquid Chrome Timeline Vertical Guide Line */}
      <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(0,242,254,0.4)]" />

      <div className="space-y-4">
        {schedule.map((slot, index) => {
          const isTaken = !!completedSlots[index];

          return (
            <div
              key={index}
              onClick={(e) => toggleSlot(index, e)}
              className={`relative pl-14 pr-4 py-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                isTaken
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                  : 'glass-card-premium neu-flat border-white/5 hover:border-cyan-400/40'
              }`}
            >
              {/* Timeline Node Point / Interactive Neumorphic Checkbox */}
              <div
                className={`absolute left-3.5 top-5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  isTaken
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                    : 'neu-raised border border-cyan-400 text-transparent group-hover:scale-110 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                }`}
              >
                {isTaken ? (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-90" />
                )}
              </div>

              {/* Time Slot Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg neu-raised border border-white/5">
                    {getSlotIcon(slot.time_slot)}
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                    {slot.time_slot}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full transition-colors ${
                      isTaken
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'neu-pill text-slate-400 border border-white/5'
                    }`}
                  >
                    {isTaken ? '✓ Taken' : 'Tap to Mark Taken'}
                  </span>
                </div>
              </div>

              {/* Medications to Take in This Window */}
              <div className="mb-2.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Medications to Take:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {slot.medications_to_take.map((med, mIdx) => (
                    <span
                      key={mIdx}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${
                        isTaken
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200 line-through opacity-70'
                          : 'neu-raised border-cyan-400/30 text-cyan-200'
                      }`}
                    >
                      {med}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dietary & Food Timing Instructions */}
              <div className="text-xs text-slate-300 neu-pressed p-3 rounded-xl border border-white/5 flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0 font-mono">Dietary Note:</span>
                <span className="leading-relaxed">{slot.dietary_note}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
