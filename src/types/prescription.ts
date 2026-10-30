export type InteractionSeverity = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface Medication {
  brand_name: string;
  generic_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing_slots: string[]; // e.g. ["Morning", "Afternoon", "Evening", "Bedtime"]
  special_instructions?: string;
  purpose?: string;
  food_relation?: 'Before Meals' | 'With Meals' | 'After Meals' | 'Empty Stomach' | 'Anytime';
}

export interface DrugInteraction {
  severity: InteractionSeverity;
  description: string;
  interacting_drugs?: string[];
  action_recommended?: string;
}

export interface ScheduleSlot {
  time_slot: string; // e.g. "08:00 AM (Breakfast)"
  medications_to_take: string[];
  dietary_note: string;
  time_category?: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
}

export interface PatientInfo {
  name: string;
  date: string;
  doctor_notes?: string;
  physician_name?: string;
  hospital_clinic?: string;
  diagnosis_impression?: string;
  age_gender?: string;
}

export interface PrescriptionAnalysisResult {
  patient_info: PatientInfo;
  medications: Medication[];
  drug_interactions: DrugInteraction[];
  schedule_24h: ScheduleSlot[];
  dietary_warnings: string[];
  raw_extracted_text?: string;
  confidence_score?: number;
  processed_at?: string;
  source_image_url?: string;
  prescription_id?: string;
}

export interface PrescriptionHistoryItem {
  id: string;
  created_at: string;
  prescription_name: string;
  patient_name: string;
  medications_count: number;
  status: 'Active' | 'Completed' | 'Pending Review';
  data: PrescriptionAnalysisResult;
  thumbnail_url?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  blood_group?: string;
  known_allergies?: string[];
  role: 'patient' | 'caretaker' | 'clinician';
}

