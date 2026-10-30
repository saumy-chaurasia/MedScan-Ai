import { PrescriptionAnalysisResult, PrescriptionHistoryItem, UserProfile } from '../types/prescription';
import { SAMPLE_PRESCRIPTIONS } from './sampleData';

const STORAGE_KEYS = {
  HISTORY: 'medscan_history_v2',
  ACTIVE_RESULT: 'medscan_active_result_v2',
  API_KEY: 'medscan_gemini_api_key',
  SELECTED_MODEL: 'medscan_gemini_model',
  USER_PROFILE: 'medscan_user_profile_v2',
  REMINDERS: 'medscan_reminders_v2',
};

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  }
}

export function getStoredModel(): string {
  if (typeof window === 'undefined') return 'gemini-1.5-flash';
  return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'gemini-1.5-flash';
}

export function setStoredModel(model: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, model);
}

export function getStoredHistory(): PrescriptionHistoryItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
  if (!raw) {
    // Seed with high quality sample prescriptions
    const initialHistory: PrescriptionHistoryItem[] = SAMPLE_PRESCRIPTIONS.slice(0, 3).map((sample, idx) => ({
      id: `hist-${sample.id}`,
      created_at: new Date(Date.now() - (idx + 1) * 86400000 * 2).toISOString(),
      prescription_name: sample.title,
      patient_name: sample.data.patient_info.name,
      medications_count: sample.data.medications.length,
      status: idx === 0 ? 'Active' : 'Completed',
      data: sample.data,
      thumbnail_url: sample.imageThumbnail,
    }));
    saveHistory(initialHistory);
    return initialHistory;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse history', err);
    return [];
  }
}

export function saveHistory(items: PrescriptionHistoryItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items));
}

export function addHistoryItem(result: PrescriptionAnalysisResult, title?: string, thumb?: string): PrescriptionHistoryItem {
  const history = getStoredHistory();
  const newItem: PrescriptionHistoryItem = {
    id: `presc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
    prescription_name: title || `${result.medications[0]?.brand_name || 'Prescription'} Care Plan`,
    patient_name: result.patient_info?.name || 'Patient',
    medications_count: result.medications?.length || 0,
    status: 'Active',
    data: result,
    thumbnail_url: thumb || result.source_image_url,
  };
  const updated = [newItem, ...history];
  saveHistory(updated);
  return newItem;
}

export function deleteHistoryItem(id: string): PrescriptionHistoryItem[] {
  const history = getStoredHistory();
  const updated = history.filter((item) => item.id !== id);
  saveHistory(updated);
  return updated;
}

export function getStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return {
      id: 'demo-user-1',
      name: 'Dr. Alistair Vance',
      email: 'alistair.vance@medscan.health',
      role: 'clinician',
    };
  }
  const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  const defaultProfile: UserProfile = {
    id: 'user-default-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '+1 (555) 019-2834',
    blood_group: 'B+ Positive',
    known_allergies: ['Penicillin (Mild rash)', 'Sulfa Drugs'],
    role: 'patient',
  };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
  return defaultProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}
