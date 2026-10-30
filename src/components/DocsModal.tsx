import React from 'react';
import { X, Code2, Database, Shield, Cpu, BookOpen, Layers } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">MediLens Architecture &amp; API Specs</h3>
            <p className="text-xs text-slate-400">
              Clinical vision pipeline, Structured Outputs schema, and chronotherapeutic calculation engine
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 space-y-6 pr-2 text-xs sm:text-sm text-slate-300">
          
          {/* Architecture Overview */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-400 text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Pipeline Architecture</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              1. <strong>Image Ingestion:</strong> Multi-resolution pre-processing with contrast enhancement for faint ballpoint scripts.<br />
              2. <strong>Gemini Vision Reasoning:</strong> Transcribes handwriting with medical vocabulary priors.<br />
              3. <strong>Brand-to-Generic Resolution:</strong> Standardizes commercial trademarks into active international non-proprietary names (INN).<br />
              4. <strong>Pharmacokinetic Scheduling:</strong> Distributes daily intake across 4 primary bio-windows (07:00, 08:30, 14:00, 20:30, 22:00) respecting gastric absorption barriers.
            </p>
          </div>

          {/* Gemini JSON Schema Spec */}
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-xs uppercase tracking-wider mb-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Gemini Structured Output Schema (JSON Schema)</span>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300/90 overflow-x-auto leading-relaxed">
{`{
  "system_instruction": "You are a clinical AI pharmacist. Analyze the provided prescription image. Extract all text accurately, resolve local brand names to generic names, detect drug-drug interactions, and construct a precise 24-hour administration timeline.",
  "response_mime_type": "application/json",
  "response_schema": {
    "type": "OBJECT",
    "properties": {
      "patient_info": {
        "type": "OBJECT",
        "properties": {
          "name": { "type": "STRING" },
          "date": { "type": "STRING" },
          "doctor_notes": { "type": "STRING" }
        }
      },
      "medications": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "brand_name": { "type": "STRING" },
            "generic_name": { "type": "STRING" },
            "dosage": { "type": "STRING" },
            "frequency": { "type": "STRING" },
            "duration": { "type": "STRING" },
            "timing_slots": { "type": "ARRAY", "items": { "type": "STRING" } },
            "special_instructions": { "type": "STRING" }
          },
          "required": ["brand_name", "generic_name", "dosage", "frequency", "timing_slots"]
        }
      },
      "drug_interactions": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "severity": { "type": "STRING", "enum": ["Low", "Moderate", "High", "Critical"] },
            "description": { "type": "STRING" }
          }
        }
      },
      "schedule_24h": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "time_slot": { "type": "STRING" },
            "medications_to_take": { "type": "ARRAY", "items": { "type": "STRING" } },
            "dietary_note": { "type": "STRING" }
          }
        }
      },
      "dietary_warnings": { "type": "ARRAY", "items": { "type": "STRING" } }
    },
    "required": ["medications", "schedule_24h", "drug_interactions"]
  }
}`}
            </pre>
          </div>

          {/* Regional Brand Mapping */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-400 text-xs uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>Generic Trade Names Mapped in Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-white font-bold">Augmentin 625</span> → Amoxicillin + Clavulanate
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-white font-bold">Pantocid / Pan-D</span> → Pantoprazole + Domperidone
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-white font-bold">Glycomet-GP</span> → Glimepiride + Metformin SR
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-white font-bold">Ultracet</span> → Tramadol + Paracetamol
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
          <span>MediLens v1.0.0 API Ready</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
          >
            Close Docs
          </button>
        </div>
      </div>
    </div>
  );
};

