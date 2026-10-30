import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PrescriptionScanner } from './components/PrescriptionScanner';
import { SplitViewDashboard } from './components/SplitViewDashboard';
import { FeatureHighlights } from './components/FeatureHighlights';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HistoryModal } from './components/HistoryModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ReminderModal } from './components/ReminderModal';
import { DocsModal } from './components/DocsModal';
import { PrescriptionAnalysisResult, PrescriptionHistoryItem, UserProfile } from './types/prescription';
import { SAMPLE_PRESCRIPTIONS, SamplePrescriptionItem } from './services/sampleData';
import { 
  getStoredHistory, 
  addHistoryItem, 
  deleteHistoryItem, 
  getStoredApiKey, 
  getStoredUserProfile 
} from './services/storage';
import { analyzePrescriptionImage } from './services/gemini';

export const App: React.FC = () => {
  // Primary application state
  const [activeResult, setActiveResult] = useState<PrescriptionAnalysisResult | null>(
    SAMPLE_PRESCRIPTIONS[0].data
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    SAMPLE_PRESCRIPTIONS[0].imageThumbnail
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [statusMessage, setStatusMessage] = useState('Extracting handwritten text via AI Vision...');
  const [history, setHistory] = useState<PrescriptionHistoryItem[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Toast alert feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load local history & settings
    const storedHistory = getStoredHistory();
    setHistory(storedHistory);

    const key = getStoredApiKey();
    setApiKeyConfigured(!!key || !!import.meta.env.VITE_GEMINI_API_KEY);

    const profile = getStoredUserProfile();
    setUserProfile(profile);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Uploaded File Handler
  const handleAnalyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setCurrentStep(1);
    setStatusMessage('Extracting handwritten text via AI Vision...');

    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setIsSaved(false);

    try {
      const result = await analyzePrescriptionImage(file, (step, msg) => {
        setCurrentStep(step);
        setStatusMessage(msg);
      });

      setActiveResult(result);
      setIsAnalyzing(false);

      // Auto save to local history
      const savedItem = addHistoryItem(
        result,
        `${result.medications[0]?.brand_name || 'Prescription'} Care Plan`,
        tempUrl
      );
      setHistory((prev) => [savedItem, ...prev]);
      setIsSaved(true);

      showToast('✓ Prescription analyzed & care plan generated successfully!');

      // Smooth scroll to results
      setTimeout(() => {
        scrollTo('care-plan-section');
      }, 300);
    } catch (err: any) {
      console.error('Prescription processing error:', err);
      setIsAnalyzing(false);
      showToast('Processing encountered an issue. Loaded fallback clinical profile.');
    }
  };

  // Preset Sample Selection Handler
  const handleSelectSample = (sample: SamplePrescriptionItem) => {
    setIsAnalyzing(true);
    setCurrentStep(1);
    setStatusMessage('Loading sample clinical prescription...');
    setPreviewUrl(sample.imageThumbnail);
    setIsSaved(false);

    setTimeout(() => {
      setCurrentStep(2);
      setStatusMessage('Resolving trade brand names to generics...');
    }, 400);

    setTimeout(() => {
      setCurrentStep(3);
      setStatusMessage('Evaluating drug-drug interaction matrix...');
    }, 800);

    setTimeout(() => {
      setCurrentStep(4);
      setStatusMessage('Synthesizing 24-hour chronotherapeutic timeline...');
    }, 1200);

    setTimeout(() => {
      setActiveResult(sample.data);
      setIsAnalyzing(false);
      showToast(`Loaded ${sample.title} Care Plan!`);
      scrollTo('care-plan-section');
    }, 1600);
  };

  // Manual Save Action
  const handleSaveToProfile = () => {
    if (!activeResult) return;
    const item = addHistoryItem(
      activeResult,
      `${activeResult.medications[0]?.brand_name || 'Prescription'} Plan`,
      previewUrl || undefined
    );
    setHistory((prev) => [item, ...prev]);
    setIsSaved(true);
    showToast('✓ Saved care plan to patient history profile!');
  };

  // Delete History Item
  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    showToast('Record removed from history.');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900/95 border border-cyan-500/50 text-cyan-300 font-medium text-xs sm:text-sm shadow-[0_0_25px_rgba(0,242,254,0.3)] backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onSelectSample={(sampleId) => {
          const s = SAMPLE_PRESCRIPTIONS.find((p) => p.id === sampleId);
          if (s) handleSelectSample(s);
        }}
        hasActiveResult={!!activeResult}
        apiKeyConfigured={apiKeyConfigured}
        historyCount={history.length}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScanClick={() => scrollTo('scanner-section')}
          onDemoClick={() => handleSelectSample(SAMPLE_PRESCRIPTIONS[1])}
        />

        {/* Core Prescription Scanner & Upload Zone */}
        <PrescriptionScanner
          onAnalyzeFile={handleAnalyzeFile}
          onSelectSample={handleSelectSample}
          isAnalyzing={isAnalyzing}
          currentStep={currentStep}
          statusMessage={statusMessage}
          previewUrl={previewUrl}
        />

        {/* Split-View Output Dashboard */}
        {activeResult && (
          <SplitViewDashboard
            data={activeResult}
            onOpenReminders={() => setIsReminderOpen(true)}
            onSaveToProfile={handleSaveToProfile}
            isSaved={isSaved}
          />
        )}

        {/* Feature Highlights Grid */}
        <FeatureHighlights
          onScanClick={() => scrollTo('scanner-section')}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(profile) => {
          setUserProfile(profile);
          showToast(`Welcome back, ${profile.name}!`);
        }}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => {
          setActiveResult(item.data);
          if (item.thumbnail_url) setPreviewUrl(item.thumbnail_url);
          showToast(`Loaded ${item.prescription_name}!`);
          scrollTo('care-plan-section');
        }}
        onDeleteItem={handleDeleteHistory}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        onKeySaved={(hasKey) => {
          setApiKeyConfigured(hasKey);
          showToast(hasKey ? 'Gemini 2.0 API Key connected!' : 'Demo mode restored');
        }}
      />

      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        patientName={activeResult?.patient_info?.name || 'Patient'}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
};

export default App;

