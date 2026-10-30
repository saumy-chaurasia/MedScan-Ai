import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Image as ImageIcon, AlertCircle, RefreshCw, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS, SamplePrescriptionItem } from '../services/sampleData';

interface PrescriptionScannerProps {
  onAnalyzeFile: (file: File) => Promise<void>;
  onSelectSample: (sample: SamplePrescriptionItem) => void;
  isAnalyzing: boolean;
  currentStep: number;
  statusMessage: string;
  previewUrl: string | null;
}

export const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({
  onAnalyzeFile,
  onSelectSample,
  isAnalyzing,
  currentStep,
  statusMessage,
  previewUrl,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { num: 1, label: 'Extracting handwritten text via AI Vision...' },
    { num: 2, label: 'Resolving local brand names to generic compounds...' },
    { num: 3, label: 'Cross-checking drug-drug interactions & timing hazards...' },
    { num: 4, label: 'Building 24-hour chronotherapeutic care plan...' },
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
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Prescription Vision &amp; Ingestion Engine
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Drop an image of a doctor's handwritten or printed prescription, or select a pre-loaded clinical scenario to see the engine in action.
          </p>
        </div>

        {/* Scanner Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#111827] border border-slate-800 p-6 md:p-8 shadow-2xl relative">
          
          {/* STATE 2: PROCESSING / LOADING SKELETON */}
          {isAnalyzing ? (
            <div className="flex flex-col md:flex-row items-center gap-8 py-6">
              {/* Image Preview with Laser Scanning Animation */}
              <div className="relative w-full md:w-1/2 aspect-[4/5] max-h-96 rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Scanning Prescription"
                    className="w-full h-full object-contain filter contrast-125 brightness-90"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-500">
                    <FileText className="w-12 h-12 text-cyan-400" />
                    <span className="text-xs font-mono">Prescription Scan Preview</span>
                  </div>
                )}

                {/* Animated Scanning Laser Beam Effect */}
                <div className="animate-laser-line" />

                {/* HUD Overlay Grids */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/10 pointer-events-none" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>OCR SCANNING IN PROGRESS</span>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300">
                  Target: Handwritten Rx
                </div>
              </div>

              {/* Progress Steps List */}
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Analyzing Medical Document</h3>
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
                        className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : isCurrent
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
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

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <span className="text-cyan-400 font-semibold">Security Note:</span> Image data is processed in compliance with healthcare HIPAA/GDPR clinical inference standards.
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
                className={`relative flex flex-col items-center justify-center py-12 px-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center group ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_35px_rgba(0,242,254,0.25)]'
                    : 'border-slate-700/80 hover:border-cyan-400/70 bg-slate-950/40 hover:bg-slate-900/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 group-hover:border-cyan-400 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] mb-4">
                  <Upload className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Drag &amp; Drop your prescription here, or click to browse
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md">
                  Supports doctor handwriting, typed clinic discharge summaries, and OPD slips in PNG, JPG, JPEG, or WEBP up to 10MB.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                    PNG / JPG / WEBP
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                    Max 10MB
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                    Auto OCR Vision
                  </span>
                </div>
              </div>

              {/* Error Callout */}
              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quick Sample Prescription Action Bar */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Or Try Instant Pre-Loaded Prescriptions (No Upload Needed)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Click any preset to test</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SAMPLE_PRESCRIPTIONS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => onSelectSample(sample)}
                      className="flex flex-col text-left p-3.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 bg-slate-900/60 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                          {sample.tag}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {sample.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
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

