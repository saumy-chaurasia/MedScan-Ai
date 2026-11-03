import React, { useState } from 'react';
import { 
  History, 
  Search, 
  X, 
  Trash2, 
  Eye, 
  Pill, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Maximize2, 
  Sparkles, 
  Camera, 
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { PrescriptionHistoryItem } from '../types/prescription';
import { useLang } from '../contexts/LanguageContext';

interface HistorySectionProps {
  history: PrescriptionHistoryItem[];
  onSelectHistoryItem: (item: PrescriptionHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onScanNewClick: () => void;
  onSelectSample: (sampleId: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onSelectHistoryItem,
  onDeleteItem,
  onScanNewClick,
  onSelectSample,
}) => {
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; patient: string } | null>(null);

  // Filter history items by search query and status filter
  const filteredHistory = history.filter((item) => {
    // Status filter
    if (statusFilter !== 'All' && item.status !== statusFilter) {
      return false;
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    
    const prescName = item.prescription_name?.toLowerCase() || '';
    const patientName = item.patient_name?.toLowerCase() || '';
    const doctorName = item.data.patient_info?.physician_name?.toLowerCase() || '';
    const hospital = item.data.patient_info?.hospital_clinic?.toLowerCase() || '';
    const diagnosis = item.data.patient_info?.diagnosis_impression?.toLowerCase() || '';
    const medsMatch = item.data.medications?.some(
      (m) =>
        m.brand_name?.toLowerCase().includes(q) ||
        m.generic_name?.toLowerCase().includes(q)
    );

    return (
      prescName.includes(q) ||
      patientName.includes(q) ||
      doctorName.includes(q) ||
      hospital.includes(q) ||
      diagnosis.includes(q) ||
      medsMatch
    );
  });

  const activeCount = history.filter((i) => i.status === 'Active').length;
  const completedCount = history.filter((i) => i.status === 'Completed').length;

  return (
    <section id="history-section" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-pill border border-white/10 text-cyan-300 text-xs font-mono font-bold mb-3.5">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('history_badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <span className="liquid-chrome-text">{t('history_title_a')}</span>
            <span className="liquid-chrome-cyan-text">{t('history_title_b')}</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            {t('history_subtitle')}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input Box */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('history_search_placeholder')}
              className="w-full pl-11 pr-10 py-3 rounded-2xl glass-card-premium neu-pressed border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-center">
            <button
              type="button"
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'All'
                  ? 'neu-raised border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                  : 'neu-pressed border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {t('history_filter_all')} ({history.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Active')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'Active'
                  ? 'neu-raised border border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'neu-pressed border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('history_filter_active')} ({activeCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Completed')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'Completed'
                  ? 'neu-raised border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                  : 'neu-pressed border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {t('history_filter_completed')} ({completedCount})
            </button>
          </div>
        </div>

        {/* History Cards Feed */}
        {filteredHistory.length === 0 ? (
          /* Empty State */
          <div className="max-w-2xl mx-auto rounded-3xl glass-card-premium neu-flat p-10 text-center border border-white/10 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl neu-raised border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <History className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery ? t('history_no_search_results') : t('history_no_records_title')}
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              {searchQuery
                ? 'Try searching with a different medication or patient keyword.'
                : t('history_no_records_desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onScanNewClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl liquid-chrome-button text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{t('history_scan_now_btn')}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectSample('sample-antibiotic-resp')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl neu-raised border border-white/10 text-white font-bold text-xs sm:text-sm hover:border-cyan-400/40 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{t('history_load_sample_btn')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-5xl mx-auto">
            {filteredHistory.map((item) => {
              const prescImg = item.thumbnail_url || item.data.source_image_url;
              const hasInteractions =
                item.data.drug_interactions && item.data.drug_interactions.length > 0;
              const hasCriticalOrHigh = item.data.drug_interactions?.some(
                (i) => i.severity === 'Critical' || i.severity === 'High'
              );

              return (
                <div
                  key={item.id}
                  className="rounded-3xl glass-card-premium neu-flat p-6 sm:p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-xl relative overflow-hidden group"
                >
                  {/* Glow accent */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                  {/* Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                          item.status === 'Active'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : 'neu-pill border-white/10 text-slate-400'
                        }`}
                      >
                        {item.status === 'Active' ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-500" />
                        )}
                        <span>{item.status === 'Active' ? t('history_filter_active') : t('history_filter_completed')}</span>
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl neu-raised text-cyan-300 font-mono text-xs border border-white/5">
                        <Pill className="w-3 h-3 text-cyan-400" />
                        <span>{item.medications_count} Meds</span>
                      </div>
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 rounded-xl neu-raised border border-white/5 hover:border-red-400/40 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title={t('history_delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content Grid: Left Uploaded Photo + Right Decoded Results */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6">
                    
                    {/* Left Column: Uploaded Photo / Document (4 cols on lg) */}
                    <div className="lg:col-span-4 flex flex-col">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t('history_uploaded_doc')}</span>
                        </span>
                        {prescImg && (
                          <span className="text-[10px] text-cyan-400">Click to Zoom</span>
                        )}
                      </div>

                      <div
                        onClick={() => {
                          if (prescImg) {
                            setSelectedImage({
                              url: prescImg,
                              title: item.prescription_name,
                              patient: item.patient_name,
                            });
                          }
                        }}
                        className={`relative rounded-2xl overflow-hidden bg-slate-950/90 border border-white/10 aspect-[3/4] max-h-72 sm:max-h-80 flex items-center justify-center neu-pressed group/img transition-all ${
                          prescImg ? 'cursor-pointer hover:border-cyan-400/50' : ''
                        }`}
                      >
                        {prescImg ? (
                          <>
                            <img
                              src={prescImg}
                              alt={item.prescription_name}
                              className="w-full h-full object-contain filter contrast-110 brightness-95 group-hover/img:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                              <Maximize2 className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]" />
                              <span>Enlarge Photo</span>
                            </div>
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                              <span>ORIGINAL RX SCAN</span>
                              <Maximize2 className="w-3 h-3 text-slate-400" />
                            </div>
                          </>
                        ) : (
                          <div className="p-6 text-center text-slate-500 flex flex-col items-center gap-2">
                            <FileText className="w-10 h-10 text-cyan-400/50" />
                            <span className="text-xs font-mono">Prescription Scan Document</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Inspect Button under photo */}
                      {prescImg && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedImage({
                              url: prescImg,
                              title: item.prescription_name,
                              patient: item.patient_name,
                            })
                          }
                          className="mt-3 w-full py-2 px-3 rounded-xl neu-raised border border-white/5 hover:border-cyan-400/30 text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t('history_view_image')}</span>
                        </button>
                      )}
                    </div>

                    {/* Right Column: Decoded Results Provided by Website (8 cols on lg) */}
                    <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
                      
                      {/* Clinical & Patient Header */}
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-xl sm:text-2xl font-black text-white liquid-chrome-text">
                            {item.prescription_name}
                          </h3>
                        </div>

                        {/* Metadata row */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl neu-pressed border border-white/5 flex items-center gap-2 text-slate-300">
                            <User className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className="text-slate-400">{t('history_patient_label')}:</span>
                            <span className="font-bold text-white">{item.patient_name}</span>
                            {item.data.patient_info?.age_gender && (
                              <span className="text-slate-500 font-mono text-[11px]">
                                ({item.data.patient_info.age_gender})
                              </span>
                            )}
                          </div>

                          <div className="p-2.5 rounded-xl neu-pressed border border-white/5 flex items-center gap-2 text-slate-300">
                            <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className="text-slate-400">{t('history_doctor_label')}:</span>
                            <span className="font-bold text-white truncate">
                              {item.data.patient_info?.physician_name || 'Medical Officer'}
                            </span>
                          </div>
                        </div>

                        {/* Diagnosis if available */}
                        {item.data.patient_info?.diagnosis_impression && (
                          <div className="mt-2 p-2.5 rounded-xl neu-pressed border border-white/5 flex items-start gap-2 text-xs text-slate-300">
                            <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-slate-400 font-bold">{t('history_diagnosis_label')}: </span>
                              <span className="text-cyan-200">{item.data.patient_info.diagnosis_impression}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Decoded Medications Summary Chips */}
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t('history_meds_label')} ({item.data.medications?.length || 0})</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.data.medications?.slice(0, 4).map((med, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-3 rounded-2xl neu-pressed border border-white/5 bg-slate-900/30 flex flex-col justify-between"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-white text-xs text-cyan-100">
                                  {med.brand_name}
                                </span>
                                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                                  {med.dosage}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                                {med.generic_name}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                                <span>{med.frequency}</span>
                                {med.food_relation && (
                                  <span className="text-slate-400 font-bold">{med.food_relation}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {item.data.medications?.length > 4 && (
                          <p className="text-[11px] text-slate-500 font-mono mt-1 text-right">
                            + {item.data.medications.length - 4} more medicines in care plan
                          </p>
                        )}
                      </div>

                      {/* Safety & Hazard Check */}
                      <div>
                        {hasInteractions ? (
                          <div
                            className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs ${
                              hasCriticalOrHigh
                                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            }`}
                          >
                            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                            <span className="font-bold">
                              {item.data.drug_interactions.length} {t('history_interactions_alert')}:
                            </span>
                            <span className="truncate">
                              {item.data.drug_interactions[0]?.description}
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span className="font-bold">{t('history_interactions_safe')}</span>
                          </div>
                        )}
                      </div>

                      {/* 24h Schedule Timeline Snippet */}
                      {item.data.schedule_24h && item.data.schedule_24h.length > 0 && (
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{t('history_schedule_label')} ({item.data.schedule_24h.length} Timing Slots)</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.data.schedule_24h.slice(0, 4).map((slot, sIdx) => (
                              <div
                                key={sIdx}
                                className="px-3 py-1.5 rounded-xl neu-pressed border border-white/5 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                <span className="font-bold text-white">{slot.time_slot.split(' ')[0]}</span>
                                <span className="text-slate-400">({slot.medications_to_take?.length || 1} meds)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onSelectHistoryItem(item)}
                          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl liquid-chrome-button text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-[0_0_25px_rgba(0,242,254,0.3)] hover:scale-[1.01] transition-transform"
                        >
                          <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                          <span>{t('history_view_full_plan')}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Enlarged Photo Modal Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full rounded-3xl glass-card-premium neu-flat p-4 sm:p-6 border border-white/10 flex flex-col items-center shadow-2xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-xl neu-raised text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="w-full text-left mb-3 pr-10">
              <h4 className="text-lg font-bold text-white liquid-chrome-text">{selectedImage.title}</h4>
              <p className="text-xs text-slate-400 font-mono">Patient: {selectedImage.patient}</p>
            </div>

            {/* Image Preview */}
            <div className="w-full max-h-[72vh] overflow-auto rounded-2xl bg-black/90 border border-cyan-400/30 flex items-center justify-center p-2">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain filter contrast-125 brightness-95"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

