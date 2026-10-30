# MedScan AI — Clinical Prescription Vision & 24-Hour Care Scheduler

> **Decodes Doctor Handwriting. Maps Brand Names to Generics. Formulates a 24-Hour Patient Care Schedule in Seconds.**  
> Powered by Multimodal Clinical Vision OCR with Structured JSON Outputs.

---

## 🌟 Overview & Key Capabilities

**MedScan AI** is a production-grade healthcare application designed with a combination of **Neumorphic depth**, **Liquid Chrome reflections**, and **Glassmorphic cards**. It ingests prescription images (handwritten or typed) via Optical Character Recognition (OCR) and Generative AI, maps brand-name pharmaceuticals to generic chemical formulas, evaluates multi-drug interaction hazards, and calculates a chronotherapeutic 24-hour care schedule.

- **Handwriting AI Engine**: Utilizes multimodal clinical vision models to transcribe messy clinician handwriting, low-contrast ink, and hospital discharge summaries.
- **Indian & Global Brand-to-Generic Database**: Automatically resolves regional trade names (*e.g., Augmentin, Pantocid, Dolo, Glycomet-GP, Ultracet, Shelcal*) into their active international non-proprietary active ingredients (INN).
- **Multi-Drug Hazard Matrix**: Real-time cross-checking for drug-drug interactions, contraindications, and hepatic/renal metabolic cautions with severity grading (*Low, Moderate, High, Critical*).
- **24-Hour Chrono-Scheduler**: Spreads out dosages across 06:00 to 22:30 bio-windows (*Breakfast, Lunch, Dinner, Bedtime*) with explicit dietary guidance (*e.g., empty stomach, take with meals, avoid dairy within 2 hours*).
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

## 🔑 AI Vision Engine Configuration

MedScan AI works out-of-the-box with **pre-loaded clinical scenarios** even without an API key.

To enable live inference on your own uploaded prescriptions:
1. Obtain an API key from Google AI Studio.
2. Click **Engine Key** in the top navigation header and paste your key, or set the environment variable in `.env.local`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

---

## 🛡️ Clinical Disclaimer
MedScan AI is an artificial intelligence-assisted decision support system. It is not intended to replace professional medical diagnosis, clinical judgment, or physician consultation.
