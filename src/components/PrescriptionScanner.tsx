import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Image as ImageIcon, AlertCircle, RefreshCw, CheckCircle2, ChevronRight, FileText, RotateCcw } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS, SamplePrescriptionItem } from '../services/sampleData';

interface PrescriptionScannerProps {
  onAnalyzeFile: (file: File) => Promise<void>;
  onSelectSample: (sample: SamplePrescriptionItem) => void;
  onResetScan?: () => void;
  isAnalyzing: boolean;
  currentStep: number;
  statusMessage: string;
  previewUrl: string | null;
}

export const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({
  onAnalyzeFile,
  onSelectSample,
  onResetScan,
  isAnalyzing,
  currentStep,
  statusMessage,
  previewUrl,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { num: 1, label: 'Extracting handwritten script and clinical typography...' },
    { num: 2, label: 'Resolving trade brand names to generic pharmaceutical compounds...' },
    { num: 3, label: 'Cross-referencing multi-drug interactions & metabolic timing hazards...' },
    { num: 4, label: 'Synthesizing 24-hour patient care schedule & dietary guardrails...' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMsg(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcess(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Please upload a valid image file (.png, .jpg, .jpeg, or .webp).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }
    onAnalyzeFile(file);
  };

  return (
    <div id="scanner-section" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-pill border border-white/10 text-cyan-300 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>MedScan Vision Ingestion</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Prescription Vision &amp; Ingestion Engine
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Upload an image of a doctor's handwritten script, clinic summary, or pick an instant pre-loaded case below.
          </p>
        </div>

        {/* Scanner Card (Neumorphic + Glassy) */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-card-premium neu-flat p-6 md:p-8 shadow-2xl relative">
          
          {/* STATE 2: PROCESSING / SCANNING LASER HUD */}
          {isAnalyzing ? (
            <div className="flex flex-col md:flex-row items-center gap-8 py-6">
              
              {/* Image Preview with Liquid Laser Line */}
              <div className="relative w-full md:w-1/2 aspect-[4/5] max-h-96 rounded-2xl overflow-hidden bg-black/80 border border-cyan-400/30 shadow-[0_0_30px_rgba(0,242,254,0.2)] flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Scanning Prescription"
                    className="w-full h-full object-contain filter contrast-125 brightness-95"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-500">
                    <FileText className="w-12 h-12 text-cyan-400" />
                    <span className="text-xs font-mono">Prescription Scan Preview</span>
                  </div>
                )}

                {/* Animated Laser Scanning Line */}
                <div className="animate-laser-line" />

                {/* Tactical HUD Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>MEDSCAN AI VISION ACTIVE</span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  Resolution: Enhanced
                </div>
              </div>

              {/* Progress Steps List */}
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl neu-raised border border-cyan-400/30 text-cyan-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white liquid-chrome-text">Analyzing Prescription</h3>
                    <p className="text-xs text-cyan-400 font-mono">{statusMessage}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {steps.map((step) => {
                    const isDone = currentStep > step.num;
                    const isCurrent = currentStep === step.num;

                    return (
                      <div
                        key={step.num}
                        className={`flex items-start gap-3.5 p-3 rounded-2xl border transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : isCurrent
                            ? 'neu-raised border-cyan-400/40 text-cyan-200 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                            : 'neu-pressed border-white/5 text-slate-500'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold">
                              {step.num}
                            </div>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm font-medium">
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-2xl neu-pressed border border-white/5 text-xs text-slate-400 leading-relaxed">
                  <span className="text-cyan-400 font-bold">Clinical Safeguard:</span> Image data is processed with clinical pharmacovigilance validation and local encryption.
                </div>
              </div>
            </div>
          ) : (
            /* STATE 1: DROPZONE */
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center py-12 px-6 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center group ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_40px_rgba(0,242,254,0.25)]'
                    : 'border-slate-700/70 hover:border-cyan-400/80 bg-black/40 hover:bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-16 h-16 rounded-2xl neu-raised border border-white/10 group-hover:border-cyan-400/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-all duration-300 mb-4 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                  <Upload className="w-8 h-8 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Drag &amp; Drop your prescription here, or click to browse
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md">
                  Supports doctor handwriting, typed clinic discharge summaries, and OPD slips in PNG, JPG, JPEG, or WEBP up to 10MB.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full neu-pill text-[11px] font-mono text-slate-300 border border-white/5">
                    PNG / JPG / WEBP
                  </span>
                  <span className="px-3 py-1 rounded-full neu-pill text-[11px] font-mono text-slate-300 border border-white/5">
                    Max 10MB
                  </span>
                  <span className="px-3 py-1 rounded-full neu-pill text-[11px] font-mono text-cyan-300 border border-cyan-500/20">
                    High-Def OCR
                  </span>
                </div>
              </div>

              {/* Error Callout */}
              {errorMsg && (
                <div className="mt-4 p-3 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quick Sample Prescription Action Bar */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Instant Pre-Loaded Prescriptions (Click to Test)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">1-Click Clinical Demos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SAMPLE_PRESCRIPTIONS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSample(sample);
                      }}
                      className="flex flex-col text-left p-4 rounded-2xl neu-raised border border-white/5 hover:border-cyan-400/40 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                          {sample.tag}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {sample.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                        {sample.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
