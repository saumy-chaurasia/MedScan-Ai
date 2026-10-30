# MediLens AI — Clinical Prescription Vision & 24-Hour Care Scheduler

> **Decodes Doctor Handwriting. Maps Brand Names to Generics. Formulates a 24-Hour Patient Care Schedule in Seconds.**  
> Powered by Google Gemini 1.5 Flash / Gemini 2.0 API with Structured Outputs (JSON Schema).

---

## 🌟 Overview & Key Capabilities

**MediLens AI** is a production-ready healthcare web application engineered to ingest prescription images (handwritten or typed) via Optical Character Recognition (OCR) and Generative AI, standardize brand-name pharmaceuticals to generic chemical formulas, evaluate multi-drug interaction hazards, and compute a chronotherapeutic 24-hour care schedule.

- **Handwriting AI Engine**: Utilizes Gemini Vision with medical domain prompting to transcribe messy clinician handwriting, low-contrast ink, and hospital discharge summaries.
- **Indian & Global Brand-to-Generic Database**: Automatically resolves regional trade names (*e.g., Augmentin, Pantocid, Dolo, Glycomet-GP, Ultracet, Shelcal*) into their active international non-proprietary active ingredients (INN).
- **Multi-Drug Hazard Matrix**: Real-time cross-checking for drug-drug interactions, contraindications, and hepatic/renal metabolic cautions with severity grading (*Low, Moderate, High, Critical*).
- **24-Hour Chrono-Scheduler**: Spreads out dosages across 06:00 to 22:00 bio-windows (*Breakfast, Lunch, Dinner, Bedtime*) with explicit dietary guidance (*e.g., empty stomach, take with meals, avoid dairy within 2 hours*).
- **Interactive Patient Portal**:
  - Download Care Plan as a high-fidelity **Medical PDF**.
  - Configure **SMS & WhatsApp dosage reminders** with advance lead time.
  - Interactive dosage checkboxes with completion feedback.
  - Historical records audit log stored with local encryption fallback.
  - Tabbed authentication modal with Google OAuth simulation.

---

## 🚀 Quick Start

### 1. Development Mode
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
npm run preview
```

---

## 🔑 Google Gemini API Configuration

MediLens AI works out-of-the-box with **pre-loaded clinical scenarios** even without an API key.

To enable live inference on your own uploaded prescriptions:
1. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **API Key** in the top navigation header and paste your key, or set the environment variable:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Toggle between **Gemini 1.5 Flash** (ultra-fast transcription) and **Gemini 2.0 Flash** (multimodal clinical reasoning).

---

## 📋 Structured Outputs API Schema

MediLens enforces Google Gemini JSON Schema validation:

```json
{
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
}
```

---

## 🛡️ Clinical Disclaimer
MediLens AI is an artificial intelligence-assisted decision support system. It is not intended to replace professional medical diagnosis, clinical judgment, or physician consultation.

