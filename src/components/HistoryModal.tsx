import React from 'react';
import { X, History, Trash2, Eye, Pill } from 'lucide-react';
import { PrescriptionHistoryItem } from '../types/prescription';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PrescriptionHistoryItem[];
  onSelectHistoryItem: (item: PrescriptionHistoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl glass-card-premium neu-flat p-6 sm:p-8 shadow-2xl flex flex-col border border-white/10"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl neu-raised text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="p-3 rounded-2xl neu-raised border border-cyan-400/30 text-cyan-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white liquid-chrome-text">Historical Prescription Records</h3>
            <p className="text-xs text-slate-400">
              Audit log of all analyzed prescriptions, active courses, and chronotherapeutic plans
            </p>
          </div>
        </div>

        {/* Records Table / List */}
        <div className="overflow-y-auto flex-1 pr-1">
          {history.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No past prescriptions recorded yet.</p>
              <p className="text-xs text-slate-600 mt-1">Upload a prescription to begin tracking.</p>
            </div>
          ) : (
            <div className="border border-white/5 rounded-2xl overflow-hidden neu-pressed">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-900/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Prescription / Patient</th>
                    <th className="py-3 px-4 text-center">Medications</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-900/40 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Prescription Name & Patient */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.prescription_name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Patient: {item.patient_name}
                        </div>
                      </td>

                      {/* Medications Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl neu-raised text-cyan-300 font-mono text-xs border border-white/5">
                          <Pill className="w-3 h-3 text-cyan-400" />
                          <span>{item.medications_count} Meds</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            item.status === 'Active'
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'neu-pill border-white/5 text-slate-400'
                          }`}
                        >
                          {item.status === 'Active' ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          )}
                          <span>{item.status}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              onSelectHistoryItem(item);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-raised border border-cyan-400/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Plan</span>
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
          <span>Total records: {history.length}</span>
          <span>Encrypted Local Storage Layer</span>
        </div>
      </div>
    </div>
  );
};
