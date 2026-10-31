import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Image as ImageIcon, AlertCircle, RefreshCw, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS, SamplePrescriptionItem } from '../services/sampleData';
import { useLang } from '../contexts/LanguageContext';

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
  isAnalyzing,
  currentStep,
  statusMessage,
  previewUrl,
}) => {
  const { t } = useLang();
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { num: 1, label: t('scanner_step_1') },
    { num: 2, label: t('scanner_step_2') },
    { num: 3, label: t('scanner_step_3') },
    { num: 4, label: t('scanner_step_4') },
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
    <div id="scanner-section" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-pill border border-white/10 text-cyan-300 text-xs font-mono font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('scanner_badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <span className="liquid-chrome-text">{t('scanner_title_a')}</span>
            <span className="liquid-chrome-cyan-text">{t('scanner_title_b')}</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal">
            {t('scanner_subtitle')}
          </p>
        </div>

        {/* Scanner Card (Glassy Acrylic + Neumorphic Outer Frame) */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-card-premium neu-flat p-6 md:p-10 shadow-2xl relative">
          
          {/* STATE 2: PROCESSING / SCANNING LASER HUD */}
          {isAnalyzing ? (
            <div className="flex flex-col md:flex-row items-center gap-8 py-4">
              
              {/* Image Preview with Liquid Laser Line */}
              <div className="relative w-full md:w-1/2 aspect-[4/5] max-h-96 rounded-2xl overflow-hidden bg-black/90 border border-cyan-400/40 shadow-[0_0_35px_rgba(0,242,254,0.25)] flex items-center justify-center">
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
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-cyan-500/15 pointer-events-none" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_6px_#00F2FE]" />
                  <span className="font-bold">MEDSCAN AI VISION ACTIVE</span>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  {t('scanner_target')}
                </div>
              </div>

              {/* Progress Steps List */}
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl neu-raised border border-cyan-400/30 text-cyan-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white liquid-chrome-text">{t('scanner_analyzing_title')}</h3>
                    <p className="text-xs text-cyan-400 font-mono">{statusMessage}</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  {steps.map((step) => {
                    const isDone = currentStep > step.num;
                    const isCurrent = currentStep === step.num;

                    return (
                      <div
                        key={step.num}
                        className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : isCurrent
                            ? 'neu-raised border-cyan-400/50 text-cyan-200 shadow-[0_0_20px_rgba(0,242,254,0.2)]'
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
                        <div className="text-xs sm:text-sm font-semibold">
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-2xl neu-pressed border border-white/5 text-xs text-slate-400 leading-relaxed">
                  <span className="text-cyan-400 font-bold">{t('scanner_safeguard_label')}</span> {t('scanner_safeguard')}
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
                className={`relative flex flex-col items-center justify-center py-14 px-6 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center group ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_40px_rgba(0,242,254,0.3)]'
                    : 'border-white/15 hover:border-cyan-400/80 neu-pressed hover:bg-slate-900/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-18 h-18 rounded-3xl neu-raised border border-white/15 group-hover:border-cyan-400/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-all duration-300 mb-5 shadow-[0_0_25px_rgba(0,242,254,0.25)]">
                  <Upload className="w-8 h-8 drop-shadow-[0_0_10px_rgba(0,242,254,0.7)]" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {t('scanner_drop_title')}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md font-normal leading-relaxed">
                  {t('scanner_drop_desc')}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                  <span className="px-3 py-1 rounded-full neu-pill text-[11px] font-mono text-slate-300 border border-white/10 font-bold">
                    PNG / JPG / WEBP
                  </span>
                  <span className="px-3 py-1 rounded-full neu-pill text-[11px] font-mono text-slate-300 border border-white/10 font-bold">
                    {t('scanner_max_size')}
                  </span>
                  <span className="px-3 py-1 rounded-full neu-pill text-[11px] font-mono text-cyan-300 border border-cyan-400/30 font-bold">
                    {t('scanner_hd_ocr')}
                  </span>
                </div>
              </div>

              {/* Error Callout */}
              {errorMsg && (
                <div className="mt-4 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quick Sample Prescription Action Bar */}
              <div className="mt-10 pt-6 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{t('scanner_samples_title')}</span>
                  </div>
                  <span className="text-[11px] text-cyan-400/80 font-mono">{t('scanner_samples_subtitle')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {SAMPLE_PRESCRIPTIONS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSample(sample);
                      }}
                      className="flex flex-col text-left p-4 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
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
