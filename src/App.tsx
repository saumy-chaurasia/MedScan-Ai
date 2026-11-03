import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PrescriptionScanner } from './components/PrescriptionScanner';
import { SplitViewDashboard } from './components/SplitViewDashboard';
import { FeatureHighlights } from './components/FeatureHighlights';
import { HistorySection } from './components/HistorySection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HistoryModal } from './components/HistoryModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ReminderModal } from './components/ReminderModal';
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
import { LanguageProvider } from './contexts/LanguageContext';

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
  const [statusMessage, setStatusMessage] = useState('Extracting handwritten script and clinical typography...');
  const [history, setHistory] = useState<PrescriptionHistoryItem[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

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

  // Create a persistent compressed base64 data URL for uploaded prescription images
  const createPersistentThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const maxDim = 800;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.8));
              return;
            }
          } catch {
            // fallback
          }
          resolve((e.target?.result as string) || '');
        };
        img.onerror = () => resolve((e.target?.result as string) || '');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Uploaded File Handler
  const handleAnalyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setCurrentStep(1);
    setStatusMessage('Extracting handwritten script and clinical typography...');

    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setIsSaved(false);

    try {
      // Generate persistent thumbnail in parallel
      const thumbPromise = createPersistentThumbnail(file);

      const result = await analyzePrescriptionImage(file, (step, msg) => {
        setCurrentStep(step);
        setStatusMessage(msg);
      });

      const persistentThumb = await thumbPromise;

      setActiveResult(result);
      setIsAnalyzing(false);

      // Auto save to local history with persistent image
      const savedItem = addHistoryItem(
        result,
        `${result.medications[0]?.brand_name || 'Prescription'} Care Plan`,
        persistentThumb || tempUrl
      );
      setHistory((prev) => [savedItem, ...prev]);
      setIsSaved(true);

      showToast('✓ MedScan AI: Prescription decoded successfully!');

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
    setStatusMessage('Loading clinical scenario...');
    setPreviewUrl(sample.imageThumbnail);
    setIsSaved(false);

    setTimeout(() => {
      setCurrentStep(2);
      setStatusMessage('Resolving trade brand names to generics...');
    }, 400);

    setTimeout(() => {
      setCurrentStep(3);
      setStatusMessage('Evaluating multi-drug interaction matrix...');
    }, 800);

    setTimeout(() => {
      setCurrentStep(4);
      setStatusMessage('Synthesizing 24-hour chronotherapeutic timeline...');
    }, 1200);

    setTimeout(() => {
      setActiveResult(sample.data);
      setIsAnalyzing(false);
      showToast(`Loaded ${sample.title} Care Plan!`);
      setTimeout(() => scrollTo('care-plan-section'), 120);
    }, 1600);
  };

  // Reset Scan
  const handleResetScan = () => {
    setActiveResult(null);
    setPreviewUrl(null);
    setIsSaved(false);
    setIsAnalyzing(false);
    scrollTo('scanner-section');
    showToast('Ready for new prescription scan.');
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
    <LanguageProvider>
    <div className="min-h-screen text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* Global Video Background — visible on every page */}
      <video autoPlay loop muted playsInline className="vid-bg" style={{ zIndex: -1 }}>
        <source src="/zbg.mp4" type="video/mp4" />
      </video>
      
      {/* Toast Notification (Neumorphic Liquid Toast) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl glass-card-premium neu-flat border border-cyan-400/40 text-cyan-300 font-bold text-xs sm:text-sm shadow-[0_0_30px_rgba(0,242,254,0.3)] backdrop-blur-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => scrollTo('history-section')}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onSelectSample={(sampleId) => {
          const s = SAMPLE_PRESCRIPTIONS.find((p) => p.id === sampleId);
          if (s) handleSelectSample(s);
        }}
        hasActiveResult={!!activeResult}
        apiKeyConfigured={apiKeyConfigured}
        historyCount={history.length}
        userProfile={userProfile}
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
          onResetScan={handleResetScan}
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
            onResetScan={handleResetScan}
            isSaved={isSaved}
          />
        )}

        {/* Expanded History Section */}
        <HistorySection
          history={history}
          onSelectHistoryItem={(item) => {
            setActiveResult(item.data);
            if (item.thumbnail_url) setPreviewUrl(item.thumbnail_url);
            setIsSaved(true);
            showToast(`Loaded ${item.prescription_name}!`);
            setTimeout(() => scrollTo('care-plan-section'), 120);
          }}
          onDeleteItem={handleDeleteHistory}
          onScanNewClick={() => scrollTo('scanner-section')}
          onSelectSample={(sampleId) => {
            const s = SAMPLE_PRESCRIPTIONS.find((p) => p.id === sampleId);
            if (s) handleSelectSample(s);
          }}
        />

        {/* Feature Highlights Grid */}
        <FeatureHighlights
          onScanClick={() => scrollTo('scanner-section')}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenApiKey={() => setIsApiKeyOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={userProfile}
        onLoginSuccess={(profile) => {
          setUserProfile(profile);
          showToast(`Welcome back, ${profile.name}!`);
        }}
        onLogout={() => {
          setUserProfile(null);
          localStorage.removeItem('medscan_user_profile_v2');
          showToast('Signed out of MedScan AI.');
        }}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => {
          setActiveResult(item.data);
          if (item.thumbnail_url) setPreviewUrl(item.thumbnail_url);
          setIsSaved(true);
          showToast(`Loaded ${item.prescription_name}!`);
          setTimeout(() => scrollTo('care-plan-section'), 120);
        }}
        onDeleteItem={handleDeleteHistory}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        onKeySaved={(hasKey) => {
          setApiKeyConfigured(hasKey);
          showToast(hasKey ? 'Vision AI Engine connected!' : 'Demo mode active');
        }}
      />

      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        patientName={activeResult?.patient_info?.name || 'Patient'}
      />
    </div>
    </LanguageProvider>
  );
};

export default App;
