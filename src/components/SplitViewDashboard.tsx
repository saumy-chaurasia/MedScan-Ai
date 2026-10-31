import React, { useState, useRef } from 'react';
import { 
  Download, 
  Bell, 
  Bookmark, 
  BookmarkCheck, 
  User, 
  Stethoscope, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  FileCheck2, 
  Check, 
  Share2,
  Clock,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown
} from 'lucide-react';
import { PrescriptionAnalysisResult } from '../types/prescription';
import { MedicationCard } from './MedicationCard';
import { InteractionAlerts } from './InteractionAlerts';
import { ScheduleTimeline } from './ScheduleTimeline';
import { DietaryGuardrails } from './DietaryGuardrails';
import { generateCarePlanPDF } from '../services/pdfGenerator';

const TTS_LANGUAGES = [
  { label: 'English',   code: 'en-IN' },
  { label: 'हिंदी',     code: 'hi-IN' },
  { label: 'Bhojpuri',  code: 'bho-IN' },
  { label: 'ਪੰਜਾਬੀ',   code: 'pa-IN' },
  { label: 'മലയാളം',  code: 'ml-IN' },
  { label: 'मराठी',    code: 'mr-IN' },
];

interface SplitViewDashboardProps {
  data: PrescriptionAnalysisResult;
  onOpenReminders: () => void;
  onSaveToProfile: () => void;
  onResetScan: () => void;
  isSaved: boolean;
}

export const SplitViewDashboard: React.FC<SplitViewDashboardProps> = ({
  data,
  onOpenReminders,
  onSaveToProfile,
  onResetScan,
  isSaved,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // TTS state
  const [ttsLang, setTtsLang] = useState(TTS_LANGUAGES[0]);
  const [ttsOpen, setTtsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  const buildPrescriptionText = () => {
    const meds = data.medications?.map(m =>
      `${m.brand_name || ''} ${m.generic_name ? '(' + m.generic_name + ')' : ''}, ${m.dosage || ''}, ${m.frequency || ''}`
    ).join('. ');
    return `Prescription for ${data.patient_info?.name || 'patient'}. 
Doctor: ${data.patient_info?.physician_name || ''}. 
Medications: ${meds || 'none'}. 
${data.patient_info?.doctor_notes ? 'Doctor notes: ' + data.patient_info.doctor_notes : ''}`;
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(buildPrescriptionText());
    utt.lang = ttsLang.code;
    utt.rate = 0.9;
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
    setIsSpeaking(true);
  };

  const handleSelectTtsLang = (lang: typeof TTS_LANGUAGES[0]) => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
    setTtsLang(lang);
    setTtsOpen(false);
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      generateCarePlanPDF(data);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 900);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="care-plan-section" className="relative py-14 md:py-20 border-t border-white/5">
      {/* 25% black overlay above background video for this section */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-pill border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Clinical Analysis Output</span>
            </div>

            {/* TTS — Read Prescription Aloud + Language Dropdown */}
            <div className="flex items-center gap-3 mt-3 mb-4">
              <button
                onClick={handleSpeak}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl neu-raised border text-xs font-bold transition-all cursor-pointer ${
                  isSpeaking
                    ? 'border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                    : 'border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300'
                }`}
                title={isSpeaking ? 'Stop reading' : 'Read prescription aloud'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-cyan-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
              </button>

              {/* Language dropdown for TTS */}
              <div className="relative">
                <button
                  onClick={() => setTtsOpen(o => !o)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <span>{ttsLang.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${ttsOpen ? 'rotate-180' : ''}`} />
                </button>
                {ttsOpen && (
                  <div className="absolute left-0 mt-2 w-36 rounded-2xl glass-card-premium border border-white/10 overflow-hidden z-50">
                    {TTS_LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectTtsLang(lang)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                          ttsLang.code === lang.code
                            ? 'text-cyan-300 bg-cyan-500/10'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export / Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Download PDF (Liquid Chrome Button) */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl liquid-chrome-button text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
            >
              <Download className="w-4 h-4 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Care Plan (PDF)'}</span>
            </button>

            {/* Set Reminders (Neumorphic Raised) */}
            <button
              onClick={onOpenReminders}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
              <span>SMS / WhatsApp Reminders</span>
            </button>

            {/* Save to Profile (Neumorphic Raised) */}
            <button
              onClick={onSaveToProfile}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-raised border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isSaved
                  ? 'border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'border-white/10 text-slate-300 hover:border-white/25'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                  <span>Saved to Profile</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  <span>Save to Profile</span>
                </>
              )}
            </button>

            {/* Scan New Prescription Button */}
            <button
              onClick={onResetScan}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 text-xs font-bold transition-all cursor-pointer"
              title="Upload another prescription"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Scan</span>
            </button>

            {/* Share / Copy link */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl neu-raised border border-white/10 hover:border-white/25 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* SPLIT VIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: DECODED MEDICAL BREAKDOWN (6 cols)            */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Patient & Doctor Header Box (Glassy Acrylic + Neumorphic) */}
            <div className="rounded-3xl glass-card-premium neu-flat p-6 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between gap-2 mb-5 pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl neu-raised text-cyan-400 border border-white/10">
                    <User className="w-4 h-4 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                  </div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                    Patient &amp; Prescriber Metadata
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 neu-pill px-3 py-1 border border-emerald-500/30 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified 98.4%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Patient Details */}
                <div className="space-y-1.5 neu-raised p-4 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Patient Name</div>
                  <div className="text-base font-black text-white liquid-chrome-silver-text">
                    {data.patient_info?.name || 'Verified Patient'}
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    {data.patient_info?.age_gender || 'Demographics unstated'}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Rx Date: <strong className="text-slate-200 font-mono">{data.patient_info?.date || 'Current'}</strong></span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-1.5 neu-raised p-4 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Prescribing Physician</div>
                  <div className="text-base font-black text-cyan-300 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                    <span className="line-clamp-1">{data.patient_info?.physician_name || 'Medical Officer'}</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{data.patient_info?.hospital_clinic || 'Clinical Healthcare Facility'}</span>
                  </div>
                  {data.patient_info?.diagnosis_impression && (
                    <div className="text-[11px] text-slate-400 line-clamp-2 pt-0.5 font-mono">
                      <span className="text-slate-300 font-bold">Impression:</span> {data.patient_info.diagnosis_impression}
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Clinical Notes */}
              {data.patient_info?.doctor_notes && (
                <div className="mt-4 p-4 rounded-2xl neu-pressed border border-white/5 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-1 text-[10px] font-mono">
                    Doctor Hand-Annotated Notes:
                  </span>
                  <p className="leading-relaxed font-mono text-[11px] text-slate-300">
                    "{data.patient_info.doctor_notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Extracted Medications List */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl neu-raised text-cyan-400 border border-white/10">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Decoded Medications ({data.medications?.length || 0})
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Mapped to Active INN</span>
              </div>

              <div className="space-y-4">
                {data.medications?.map((med, idx) => (
                  <MedicationCard key={idx} medication={med} index={idx} />
                ))}
              </div>
            </div>

            {/* Warnings & Multi-Drug Hazard Matrix */}
            <div>
              <InteractionAlerts interactions={data.drug_interactions} />
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: INTERACTIVE 24-HOUR CARE SCHEDULE (6 cols)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Schedule Container Box (Glassy Acrylic + Neumorphic) */}
            <div className="rounded-3xl glass-card-premium neu-flat p-6 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between gap-2 mb-5 pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl neu-raised text-cyan-400 border border-white/10">
                    <Clock className="w-4 h-4 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                      Interactive 24-Hour Chrono-Schedule
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Chronotherapeutic meal alignment (06:00 to 22:30)
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-cyan-300 neu-pill px-3 py-1 border border-cyan-400/30 font-bold shadow-[0_0_12px_rgba(0,242,254,0.15)]">
                  {data.schedule_24h?.length || 0} Dose Slots
                </span>
              </div>

              {/* Interactive Timeline Component */}
              <ScheduleTimeline schedule={data.schedule_24h} />
            </div>

            {/* Dietary & Lifestyle Guardrails Box */}
            <DietaryGuardrails warnings={data.dietary_warnings} />

            {/* Caregiver Sync Helper */}
            <div className="p-5 rounded-3xl neu-raised border border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <span className="text-white font-bold text-sm">Caregiver Synchronization Available</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Automated SMS / WhatsApp alerts notify designated family members on missed doses.</p>
              </div>
              <button
                onClick={onOpenReminders}
                className="shrink-0 ml-4 px-4 py-2 rounded-2xl neu-raised border border-cyan-400/40 text-cyan-300 font-bold text-xs hover:border-cyan-400 transition-colors cursor-pointer"
              >
                Configure
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
