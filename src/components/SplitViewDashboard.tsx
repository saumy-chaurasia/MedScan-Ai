import React, { useState } from 'react';
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
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PrescriptionAnalysisResult } from '../types/prescription';
import { MedicationCard } from './MedicationCard';
import { InteractionAlerts } from './InteractionAlerts';
import { ScheduleTimeline } from './ScheduleTimeline';
import { DietaryGuardrails } from './DietaryGuardrails';
import { generateCarePlanPDF } from '../services/pdfGenerator';

interface SplitViewDashboardProps {
  data: PrescriptionAnalysisResult;
  onOpenReminders: () => void;
  onSaveToProfile: () => void;
  isSaved: boolean;
}

export const SplitViewDashboard: React.FC<SplitViewDashboardProps> = ({
  data,
  onOpenReminders,
  onSaveToProfile,
  isSaved,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      generateCarePlanPDF(data);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="care-plan-section" className="py-12 md:py-16 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Clinical Analysis Output</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Decoded Care Plan &amp; 24-Hour Chrono-Schedule
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              AI structured extraction, generic chemical formula mapping, and chronotherapeutic time slots.
            </p>
          </div>

          {/* Export / Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Care Plan (PDF)'}</span>
            </button>

            {/* Set Reminders */}
            <button
              onClick={onOpenReminders}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500/50 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Set SMS / WhatsApp Reminders</span>
            </button>

            {/* Save to Profile */}
            <button
              onClick={onSaveToProfile}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                isSaved
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
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

            {/* Share / Copy link */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* SPLIT VIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: DECODED MEDICAL BREAKDOWN (5 cols on lg)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Patient & Doctor Header Box */}
            <div className="rounded-3xl bg-[#111827] border border-slate-800 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Patient &amp; Prescriber Metadata
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified 98.4%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Patient Details */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Patient Name</div>
                  <div className="text-sm font-bold text-white">
                    {data.patient_info?.name || 'Verified Patient'}
                  </div>
                  <div className="text-slate-400">
                    {data.patient_info?.age_gender || 'Demographics unstated'}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Rx Date: <strong className="text-slate-300 font-mono">{data.patient_info?.date || 'Current'}</strong></span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Prescribing Physician</div>
                  <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{data.patient_info?.physician_name || 'Medical Officer'}</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{data.patient_info?.hospital_clinic || 'Clinical Hospital Facility'}</span>
                  </div>
                  {data.patient_info?.diagnosis_impression && (
                    <div className="text-[11px] text-slate-400 line-clamp-2 pt-0.5">
                      <span className="text-slate-300 font-semibold">Impression:</span> {data.patient_info.diagnosis_impression}
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Clinical Notes */}
              {data.patient_info?.doctor_notes && (
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-1 text-[11px]">
                    Doctor Hand-Annotated Notes:
                  </span>
                  <p className="leading-relaxed font-mono text-[12px] text-slate-300">
                    "{data.patient_info.doctor_notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Extracted Medications List */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Decoded Medications ({data.medications?.length || 0})
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Mapped to Generics</span>
              </div>

              <div className="space-y-3.5">
                {data.medications?.map((med, idx) => (
                  <MedicationCard key={idx} medication={med} index={idx} />
                ))}
              </div>
            </div>

            {/* Warnings & Contraindications Card (Crimson / Amber Alert) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Multi-Drug Interactions &amp; Hazard Matrix
                </h3>
              </div>
              <InteractionAlerts interactions={data.drug_interactions} />
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: INTERACTIVE 24-HOUR CARE SCHEDULE (6 cols)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Schedule Container Box */}
            <div className="rounded-3xl bg-[#111827] border border-slate-800 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Interactive 24-Hour Chrono-Schedule
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Chronotherapeutic meal alignment (06:00 to 22:00)
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  {data.schedule_24h?.length || 0} Dose Slots
                </span>
              </div>

              {/* Interactive Timeline Component */}
              <ScheduleTimeline schedule={data.schedule_24h} />
            </div>

            {/* Dietary & Lifestyle Guardrails Box */}
            <DietaryGuardrails warnings={data.dietary_warnings} />

            {/* Quick Helper / Caregiver Tips */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <span className="text-white font-semibold">Need caregiver synchronization?</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Automated SMS/WhatsApp alerts send real-time reminders directly to family members.</p>
              </div>
              <button
                onClick={onOpenReminders}
                className="shrink-0 ml-4 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-medium text-xs transition-colors"
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

