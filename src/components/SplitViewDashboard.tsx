import React, { useState, useRef } from 'react';
import { 
  Download, 
  Bell, 
  Bookmark, 
  BookmarkCheck, 
  User, 
  Stethoscope, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  FileCheck2, 
  Check, 
  Share2,
  Clock,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown
} from 'lucide-react';
import { PrescriptionAnalysisResult } from '../types/prescription';
import { MedicationCard } from './MedicationCard';
import { InteractionAlerts } from './InteractionAlerts';
import { ScheduleTimeline } from './ScheduleTimeline';
import { DietaryGuardrails } from './DietaryGuardrails';
import { generateCarePlanPDF } from '../services/pdfGenerator';
import { useLang } from '../contexts/LanguageContext';

const TTS_LANGUAGES = [
  { label: 'English',   code: 'en-IN' },
  { label: 'हिंदी',     code: 'hi-IN' },
  { label: 'Bhojpuri',  code: 'bho-IN' },
  { label: 'ਪੰਜਾਬੀ',   code: 'pa-IN' },
  { label: 'മലയാളം',  code: 'ml-IN' },
  { label: 'मराठी',    code: 'mr-IN' },
];

interface SplitViewDashboardProps {
  data: PrescriptionAnalysisResult;
  onOpenReminders: () => void;
  onSaveToProfile: () => void;
  onResetScan: () => void;
  isSaved: boolean;
}

export const SplitViewDashboard: React.FC<SplitViewDashboardProps> = ({
  data,
  onOpenReminders,
  onSaveToProfile,
  onResetScan,
  isSaved,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { t } = useLang();

  // TTS state
  const [ttsLang, setTtsLang] = useState(TTS_LANGUAGES[0]);
  const [ttsOpen, setTtsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  const buildPrescriptionText = () => {
    const name = data.patient_info?.name || '';
    const doctor = data.patient_info?.physician_name || '';
    const notes = data.patient_info?.doctor_notes || '';
    const medsList = data.medications || [];
    const code = ttsLang.code;

    // Helper to translate frequency into everyday simple words
    const getPlainFreq = (freq: string | undefined, food: string | undefined, lang: string) => {
      const f = (freq || '').toLowerCase();
      const fd = (food || '').toLowerCase();
      const isBeforeFood = fd.includes('before') || fd.includes('empty');
      const is3x = f.includes('3') || f.includes('thrice') || f.includes('tds') || f.includes('tid');
      const is2x = f.includes('2') || f.includes('twice') || f.includes('bd') || f.includes('bid');
      const isNight = f.includes('night') || f.includes('bedtime') || f.includes('hs');

      if (lang === 'hi') {
        const timeStr = is3x ? 'दिन में तीन बार (सुबह, दोपहर और रात)' : is2x ? 'दिन में दो बार (सुबह और रात)' : isNight ? 'रात को सोने से पहले' : 'दिन में एक बार';
        const foodStr = isBeforeFood ? 'खाना खाने से पहले' : 'खाना खाने के बाद';
        return `${timeStr}, ${foodStr}`;
      } else if (lang === 'bho') {
        const timeStr = is3x ? 'दिन में तीन बेर (सबेरे, दुपहरिया आ रात)' : is2x ? 'दिन में दु बेर (सबेरे आ साँझ)' : isNight ? 'रात के सूते से पहिले' : 'दिन में एक बेर';
        const foodStr = isBeforeFood ? 'खाना खइला से पहिले' : 'खाना खइला के बाद';
        return `${timeStr}, ${foodStr}`;
      } else if (lang === 'pa') {
        const timeStr = is3x ? 'ਦਿਨ ਵਿੱਚ ਤਿੰਨ ਵਾਰ (ਸਵੇਰੇ, ਦੁਪਹਿਰੇ ਅਤੇ ਰਾਤ)' : is2x ? 'ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ (ਸਵੇਰੇ ਅਤੇ ਸ਼ਾਮ)' : isNight ? 'ਰਾਤ ਨੂੰ ਸੌਣ ਤੋਂ ਪਹਿਲਾਂ' : 'ਦਿਨ ਵਿੱਚ ਇੱਕ ਵਾਰ';
        const foodStr = isBeforeFood ? 'ਖਾਣਾ ਖਾਣ ਤੋਂ ਪਹਿਲਾਂ' : 'ਖਾਣਾ ਖਾਣ ਤੋਂ ਬਾਅਦ';
        return `${timeStr}, ${foodStr}`;
      } else if (lang === 'mr') {
        const timeStr = is3x ? 'दिवसातून तीन वेळा (सकाळी, दुपारी आणि रात्री)' : is2x ? 'दिवसातून दोन वेळा (सकाळी आणि संध्याकाळी)' : isNight ? 'रात्री झोपण्यापूर्वी' : 'दिवसातून एकदा';
        const foodStr = isBeforeFood ? 'जेवणापूर्वी' : 'जेवणानंतर';
        return `${timeStr}, ${foodStr}`;
      } else if (lang === 'ml') {
        const timeStr = is3x ? 'ദിവസത്തിൽ മൂന്ന് തവണ (രാവിലെ, ഉച്ചയ്ക്ക്, രാത്രി)' : is2x ? 'ദിവസത്തിൽ രണ്ട് തവണ (രാവിലെയും രാത്രിയും)' : isNight ? 'രാത്രി ഉറങ്ങുന്നതിന് മുൻപ്' : 'ദിവസത്തിൽ ഒരിക്കൽ';
        const foodStr = isBeforeFood ? 'ഭക്ഷണത്തിന് മുൻപ്' : 'ഭക്ഷണത്തിന് ശേഷം';
        return `${timeStr}, ${foodStr}`;
      } else {
        const timeStr = is3x ? '3 times a day (morning, afternoon, and night)' : is2x ? '2 times a day (morning and night)' : isNight ? 'at bedtime' : 'once daily';
        const foodStr = isBeforeFood ? 'before meals' : 'after meals';
        return `${timeStr}, ${foodStr}`;
      }
    };

    if (code === 'hi-IN') {
      let speech = `नमस्ते। यह आपके पर्चे की आसान समझाइश है। `;
      if (name) speech += `मरीज़ का नाम ${name} है। `;
      if (doctor) speech += `यह पर्चा डॉक्टर ${doctor} ने लिखा है। `;
      speech += `इसमें कुल ${medsList.length} दवाइयां हैं। `;
      medsList.forEach((m, i) => {
        const timing = getPlainFreq(m.frequency, m.food_relation || m.special_instructions, 'hi');
        speech += `दवाई नंबर ${i + 1}: ${m.brand_name}। खुराक है ${m.dosage || 'निर्देशानुसार'}। इसे ${timing} लेना है। `;
      });
      if (notes) speech += `डॉक्टर की सलाह है: ${notes}। `;
      speech += `कृपया समय पर दवाइयां लें और खूब पानी पिएं। धन्यवाद।`;
      return speech;
    }

    if (code === 'bho-IN') {
      let speech = `प्रणाम। ई रउआ दवाई के परचा के आसान समझाइश बा। `;
      if (name) speech += `मरीज के नाम ${name} बा। `;
      if (doctor) speech += `ई परचा डॉक्टर ${doctor} लिखले बाड़न। `;
      speech += `एह में कुल ${medsList.length} गो दवाई बा। `;
      medsList.forEach((m, i) => {
        const timing = getPlainFreq(m.frequency, m.food_relation || m.special_instructions, 'bho');
        speech += `दवाई नंबर ${i + 1}: ${m.brand_name}। खुराक बा ${m.dosage || 'बतावल अनुसार'}। एका ${timing} लेवे के बा। `;
      });
      if (notes) speech += `डॉक्टर साहेब के सलाह बा: ${notes}। `;
      speech += `सभ दवाई बेरा पर लीं आ भरपूर पानी पीहीं। रउआ जल्दी नीक हो जाईं। प्रणाम।`;
      return speech;
    }

    if (code === 'pa-IN') {
      let speech = `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ। ਇਹ ਤੁਹਾਡੇ ਨੁਸਖੇ ਦੀ ਆਸਾਨ ਜਾਣਕਾਰੀ ਹੈ। `;
      if (name) speech += `ਮਰੀਜ਼ ਦਾ ਨਾਮ ${name} ਹੈ। `;
      if (doctor) speech += `ਇਹ ਨੁਸਖਾ ਡਾਕਟਰ ${doctor} ਨੇ ਲਿਖਿਆ ਹੈ। `;
      speech += `ਇਸ ਵਿੱਚ ਕੁੱਲ ${medsList.length} ਦਵਾਈਆਂ ਹਨ। `;
      medsList.forEach((m, i) => {
        const timing = getPlainFreq(m.frequency, m.food_relation || m.special_instructions, 'pa');
        speech += `ਦਵਾਈ ਨੰਬਰ ${i + 1}: ${m.brand_name}। ਖੁਰਾਕ ਹੈ ${m.dosage || 'ਨਿਰਦੇਸ਼ ਮੁਤਾਬਕ'}। ਇਸਨੂੰ ${timing} ਲੈਣਾ ਹੈ। `;
      });
      if (notes) speech += `ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਹੈ: ${notes}। `;
      speech += `ਕਿਰਪਾ ਕਰਕੇ ਦਵਾਈਆਂ ਸਮੇਂ ਸਿਰ ਲਵੋ ਅਤੇ ਖੂਬ ਪਾਣੀ ਪੀਓ। ਧੰਨਵਾਦ।`;
      return speech;
    }

    if (code === 'mr-IN') {
      let speech = `नमस्कार. ही आपल्या औषधांच्या चिठ्ठीची सोपी माहिती आहे. `;
      if (name) speech += `रुग्णाचे नाव ${name} आहे. `;
      if (doctor) speech += `हे प्रिस्क्रिप्शन डॉक्टर ${doctor} यांनी दिले आहे. `;
      speech += `यात एकूण ${medsList.length} औषधे आहेत. `;
      medsList.forEach((m, i) => {
        const timing = getPlainFreq(m.frequency, m.food_relation || m.special_instructions, 'mr');
        speech += `औषध क्रमांक ${i + 1}: ${m.brand_name}। डोस आहे ${m.dosage || 'सल्ल्यानुसार'}। हे ${timing} घ्यायचे आहे. `;
      });
      if (notes) speech += `डॉक्टरांचा सल्ला आहे: ${notes}। `;
      speech += `कृपया सर्व औषधे वेळेवर घ्या आणि भरपूर पाणी प्या. धन्यवाद.`;
      return speech;
    }

    if (code === 'ml-IN') {
      let speech = `നമസ്കാരം. നിങ്ങളുടെ കുറിപ്പടിയുടെ ലളിതമായ വിവരണം ഇതാ. `;
      if (name) speech += `രോഗിയുടെ പേര് ${name}. `;
      if (doctor) speech += `ഡോക്ടർ ${doctor} ആണ് ഈ കുറിപ്പടി നൽകിയിട്ടുള്ളത്. `;
      speech += `ആകെ ${medsList.length} മരുന്നുകൾ ഉണ്ട്. `;
      medsList.forEach((m, i) => {
        const timing = getPlainFreq(m.frequency, m.food_relation || m.special_instructions, 'ml');
        speech += `മരുന്ന് ${i + 1}: ${m.brand_name}. അളവ്: ${m.dosage || 'നിർദ്ദേശപ്രകാരം'}. ഇത് ${timing} കഴിക്കുക. `;
      });
      if (notes) speech += `ഡോക്ടറുടെ നിർദ്ദേശം: ${notes}. `;
      speech += `എല്ലാ മരുന്നുകളും കൃത്യസമയത്ത് കഴിക്കുക. നന്ദി.`;
      return speech;
    }

    // Default: English
    let speech = `Hello. Here is a simple explanation of your prescription. `;
    if (name) speech += `Patient name is ${name}. `;
    if (doctor) speech += `Prescribed by Doctor ${doctor}. `;
    speech += `There are ${medsList.length} medicines in total. `;
    medsList.forEach((m, i) => {
      const timing = getPlainFreq(m.frequency, m.food_relation || m.special_instructions, 'en');
      speech += `Medicine ${i + 1}: ${m.brand_name}. Dosage is ${m.dosage || 'as directed'}. Take it ${timing}. `;
    });
    if (notes) speech += `Doctor note: ${notes}. `;
    speech += `Please take your medications on time and stay well hydrated. Wishing you a healthy recovery.`;
    return speech;
  };

  const getBestVoice = (targetCode: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    let match = voices.find(v => v.lang.toLowerCase() === targetCode.toLowerCase() || v.lang.toLowerCase().replace('_', '-') === targetCode.toLowerCase());
    if (match) return match;

    const prefix = targetCode.split('-')[0].toLowerCase();
    match = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;

    if (['bho-IN', 'mr-IN', 'pa-IN'].includes(targetCode)) {
      match = voices.find(v => v.lang.toLowerCase().startsWith('hi'));
      if (match) return match;
    }

    match = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
    return match || null;
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(buildPrescriptionText());
    utt.lang = ttsLang.code;
    const voice = getBestVoice(ttsLang.code);
    if (voice) {
      utt.voice = voice;
    }
    utt.rate = 0.88;
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
    setIsSpeaking(true);
  };

  const handleSelectTtsLang = (lang: typeof TTS_LANGUAGES[0]) => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
    setTtsLang(lang);
    setTtsOpen(false);
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      generateCarePlanPDF(data);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 900);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="care-plan-section" className="relative py-14 md:py-20 border-t border-white/5">
      {/* 25% black overlay above background video for this section */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-pill border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('dash_badge')}</span>
            </div>

            {/* TTS — Read Prescription Aloud + Language Dropdown */}
            <div className="flex items-center gap-3 mt-3 mb-4">
              <button
                onClick={handleSpeak}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl neu-raised border text-xs font-bold transition-all cursor-pointer ${
                  isSpeaking
                    ? 'border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                    : 'border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300'
                }`}
                title={isSpeaking ? 'Stop reading' : 'Read prescription aloud'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-cyan-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                <span>{isSpeaking ? t('dash_stop') : t('dash_read_aloud')}</span>
              </button>

              {/* Language dropdown for TTS */}
              <div className="relative">
                <button
                  onClick={() => setTtsOpen(o => !o)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <span>{ttsLang.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${ttsOpen ? 'rotate-180' : ''}`} />
                </button>
                {ttsOpen && (
                  <div className="absolute left-0 mt-2 w-36 rounded-2xl glass-card-premium border border-white/10 overflow-hidden z-50">
                    {TTS_LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectTtsLang(lang)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                          ttsLang.code === lang.code
                            ? 'text-cyan-300 bg-cyan-500/10'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export / Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Download PDF (Liquid Chrome Button) */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl liquid-chrome-button text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
            >
              <Download className="w-4 h-4 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]" />
              <span>{isExporting ? t('dash_pdf_loading') : t('dash_pdf')}</span>
            </button>

            {/* Set Reminders (Neumorphic Raised) */}
            <button
              onClick={onOpenReminders}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
              <span>{t('dash_reminders')}</span>
            </button>

            {/* Save to Profile (Neumorphic Raised) */}
            <button
              onClick={onSaveToProfile}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-raised border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isSaved
                  ? 'border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'border-white/10 text-slate-300 hover:border-white/25'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t('dash_saved')}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  <span>{t('dash_save')}</span>
                </>
              )}
            </button>

            {/* Scan New Prescription Button */}
            <button
              onClick={onResetScan}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl neu-raised border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 text-xs font-bold transition-all cursor-pointer"
              title="Upload another prescription"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('dash_new_scan')}</span>
            </button>

            {/* Share / Copy link */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl neu-raised border border-white/10 hover:border-white/25 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* SPLIT VIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: DECODED MEDICAL BREAKDOWN (6 cols)            */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Patient & Doctor Header Box (Glassy Acrylic + Neumorphic) */}
            <div className="rounded-3xl glass-card-premium neu-flat p-6 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between gap-2 mb-5 pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl neu-raised text-cyan-400 border border-white/10">
                    <User className="w-4 h-4 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                  </div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                    {t('dash_patient_header')}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 neu-pill px-3 py-1 border border-emerald-500/30 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('dash_verified_pct')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Patient Details */}
                <div className="space-y-1.5 neu-raised p-4 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">{t('dash_patient_name')}</div>
                  <div className="text-base font-black text-white liquid-chrome-silver-text">
                    {data.patient_info?.name || t('dash_verified_patient')}
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    {data.patient_info?.age_gender || t('dash_demographics')}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('dash_rx_date')} <strong className="text-slate-200 font-mono">{data.patient_info?.date || t('dash_current')}</strong></span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-1.5 neu-raised p-4 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">{t('dash_prescribing_doc')}</div>
                  <div className="text-base font-black text-cyan-300 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                    <span className="line-clamp-1">{data.patient_info?.physician_name || t('dash_medical_officer')}</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{data.patient_info?.hospital_clinic || t('dash_healthcare_facility')}</span>
                  </div>
                  {data.patient_info?.diagnosis_impression && (
                    <div className="text-[11px] text-slate-400 line-clamp-2 pt-0.5 font-mono">
                      <span className="text-slate-300 font-bold">{t('dash_impression')}</span> {data.patient_info.diagnosis_impression}
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Clinical Notes */}
              {data.patient_info?.doctor_notes && (
                <div className="mt-4 p-4 rounded-2xl neu-pressed border border-white/5 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-1 text-[10px] font-mono">
                    {t('dash_doctor_notes')}
                  </span>
                  <p className="leading-relaxed font-mono text-[11px] text-slate-300">
                    "{data.patient_info.doctor_notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Extracted Medications List */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl neu-raised text-cyan-400 border border-white/10">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {t('dash_decoded_meds')} ({data.medications?.length || 0})
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">{t('dash_mapped_inn')}</span>
              </div>

              <div className="space-y-4">
                {data.medications?.map((med, idx) => (
                  <MedicationCard key={idx} medication={med} index={idx} />
                ))}
              </div>
            </div>

            {/* Warnings & Multi-Drug Hazard Matrix */}
            <div>
              <InteractionAlerts interactions={data.drug_interactions} />
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: INTERACTIVE 24-HOUR CARE SCHEDULE (6 cols)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Schedule Container Box (Glassy Acrylic + Neumorphic) */}
            <div className="rounded-3xl glass-card-premium neu-flat p-6 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between gap-2 mb-5 pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl neu-raised text-cyan-400 border border-white/10">
                    <Clock className="w-4 h-4 drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                      {t('dash_schedule_title')}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {t('dash_schedule_sub')}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-cyan-300 neu-pill px-3 py-1 border border-cyan-400/30 font-bold shadow-[0_0_12px_rgba(0,242,254,0.15)]">
                  {data.schedule_24h?.length || 0} {t('dash_dose_slots')}
                </span>
              </div>

              {/* Interactive Timeline Component */}
              <ScheduleTimeline schedule={data.schedule_24h} />
            </div>

            {/* Dietary & Lifestyle Guardrails Box */}
            <DietaryGuardrails warnings={data.dietary_warnings} />

            {/* Caregiver Sync Helper */}
            <div className="p-5 rounded-3xl neu-raised border border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <span className="text-white font-bold text-sm">{t('dash_caregiver_title')}</span>
                <p className="text-slate-400 text-[11px] mt-0.5">{t('dash_caregiver_desc')}</p>
              </div>
              <button
                onClick={onOpenReminders}
                className="shrink-0 ml-4 px-4 py-2 rounded-2xl neu-raised border border-cyan-400/40 text-cyan-300 font-bold text-xs hover:border-cyan-400 transition-colors cursor-pointer"
              >
                {t('dash_configure')}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
