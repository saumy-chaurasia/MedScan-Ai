import { PrescriptionAnalysisResult, PrescriptionHistoryItem, Medication, ScheduleSlot, DrugInteraction } from '../types/prescription';
import { Lang } from '../i18n/translations';

// Comprehensive dictionary for clinical translations to Hindi
const CLINICAL_TRANSLATIONS: Record<string, string> = {
  // Patients
  'Arjun Verma': 'अर्जुन वर्मा',
  'Venkatesh Ramanathan': 'वेंकटेश रामनाथन',
  'Priyanka Chopra': 'प्रियंका चोपड़ा',
  'Rajiv Malhotra': 'राजीव मल्होत्रा',
  'Ananya Sen': 'अनन्या सेन',
  'Patient': 'मरीज़',

  // Doctors
  'Dr. Rajesh Sharma, MD (Pulmonology)': 'डॉ. राजेश शर्मा, एमडी (पल्मोनोलॉजी)',
  'Dr. Rajesh Sharma, MD (Chest Physician)': 'डॉ. राजेश शर्मा, एमडी (चेस्ट फिजिशियन)',
  'Dr. Rajesh Sharma, MD': 'डॉ. राजेश शर्मा, एमडी',
  'Dr. Sunita Deshmukh, MD, DM (Cardiology)': 'डॉ. सुनीता देशमुख, एमडी, डीएम (कार्डियोलॉजी)',
  'Dr. Sunita Deshmukh, DM (Cardiology)': 'डॉ. सुनीता देशमुख, डीएम (कार्डियोलॉजी)',
  'Dr. Sunita Deshmukh, DM': 'डॉ. सुनीता देशमुख, डीएम',
  'Dr. Anand Joshi, MD, DM (Gastroenterology)': 'डॉ. आनंद जोशी, एमडी, डीएम (गैस्ट्रोएंटरोलॉजी)',
  'Dr. Anand Joshi, DM (Gastroenterology)': 'डॉ. आनंद जोशी, डीएम (गैस्ट्रोएंटरोलॉजी)',
  'Dr. Anand Joshi, DM': 'डॉ. आनंद जोशी, डीएम',
  'Dr. Anita Roy, MD (Pediatrics)': 'डॉ. अनीता रॉय, एमडी (बाल रोग विशेषज्ञ)',
  'Medical Officer': 'चिकित्सा अधिकारी',

  // Hospitals & Clinics
  'Apex Multi-Specialty Hospital': 'एपेक्स मल्टी-स्पेशियलिटी अस्पताल',
  'Apex Pulmocare Clinic, New Delhi': 'एपेक्स पल्मोकेयर क्लिनिक, नई दिल्ली',
  'APEX PULMOCARE CLINIC': 'एपेक्स पल्मोकेयर क्लिनिक',
  'Fortis Escorts Heart Centre': 'फोर्टिस एस्कॉर्ट्स हार्ट सेंटर',
  'Fortis Escorts Heart & Metabolism Centre': 'फोर्टिस एस्कॉर्ट्स हार्ट व मेटाबॉलिज्म सेंटर',
  'FORTIS HEART & DIABETES': 'फोर्टिस हार्ट व डायबिटीज',
  'Apollo Hospitals': 'अपोलो हॉस्पिटल्स',
  'APOLLO GASTRO CLINIC': 'अपोलो गैस्ट्रो क्लिनिक',
  'Clinical Healthcare Facility': 'क्लिनिकल स्वास्थ्य केंद्र',

  // Diagnoses
  'Acute Lower Respiratory Tract Infection & Mild Bronchospasm': 'तीव्र निचला श्वसन संक्रमण और हल्का ब्रोन्कोस्पैज़्म',
  'Type 2 Diabetes Mellitus with Essential Hypertension & Hyperlipidemia': 'टाइप 2 डायबिटीज मेलिटस, उच्च रक्तचाप और हाइपरलिपिडिमिया',
  'Acute Bronchial Infection': 'तीव्र ब्रोंकियल संक्रमण',
  'Cardio-Metabolic Management': 'कार्डियो-मेटाबॉलिक प्रबंधन',
  'Gastroenteritis & Acid Peptic Disorder': 'गैस्ट्रोएंटेराइटिस और एसिड पेप्टिक विकार',

  // Doctor Notes
  'Patient presents with persistent productive cough, low-grade pyrexia (100.4°F), and nocturnal wheezing for 4 days. Chest auscultation reveals bilateral rhonchi.':
    'मरीज़ को 4 दिनों से लगातार बलगम वाली खांसी, हल्का बुखार (100.4°F), और रात में घरघराहट है। छाती की जांच में दोनों तरफ रोंकाई (rhonchi) पाई गई।',
  'HbA1c 8.2%, BP 142/88 mmHg. Baseline renal function normal. Advised strict carbohydrate moderation and 30 mins brisk walking.':
    'HbA1c 8.2%, बीपी 142/88 mmHg। प्रारंभिक किडनी कार्य सामान्य। सख्त कार्बोहाइड्रेट नियंत्रण और 30 मिनट तेज चलने की सलाह दी गई।',

  // Medicine Brand Names
  'Augmentin 625mg': 'ऑगमेंटिन 625mg (Augmentin)',
  'Augmentin': 'ऑगमेंटिन (Augmentin)',
  'Pantocid 40mg': 'पैंटोसिड 40mg (Pantocid)',
  'Pantocid': 'पैंटोसिड (Pantocid)',
  'Dolo 650mg': 'डोलो 650mg (Dolo)',
  'Dolo': 'डोलो (Dolo)',
  'Montair-LC': 'मोंटेयर-एलसी (Montair-LC)',
  'Glycomet-GP 1/500': 'ग्लाइकोमेट-जीपी 1/500 (Glycomet-GP)',
  'Telma 40mg': 'टेल्मा 40mg (Telma)',
  'Telma': 'टेल्मा (Telma)',
  'Ecosprin 75mg': 'इकोस्प्रिन 75mg (Ecosprin)',
  'Ecosprin': 'इकोस्प्रिन (Ecosprin)',
  'Rosuvas 10mg': 'रोसुवास 10mg (Rosuvas)',
  'Rosuvas': 'रोसुवास (Rosuvas)',
  'Ultracet': 'अल्ट्रासेट (Ultracet)',
  'Pan-D': 'पैन-डी (Pan-D)',
  'Shelcal 500': 'शेलकल 500 (Shelcal)',
  'Chymoral Forte': 'काइमोरल फोर्ट (Chymoral Forte)',
  'Pantocid-DSR': 'पैंटोसिड-डीएसआर (Pantocid-DSR)',
  'Cifran-TZ': 'सिफ्रान-टीजेड (Cifran-TZ)',
  'Sucrafil': 'सुक्राफिल (Sucrafil)',
  'Econorm': 'इकोनोर्म (Econorm)',

  // Medicine Generic Names
  'Amoxicillin (500mg) + Clavulanic Acid (125mg)': 'एमोक्सिसिलिन (500mg) + क्लावुलैनिक एसिड (125mg)',
  'Pantoprazole Sodium (40mg)': 'पैंटोप्राजोल सोडियम (40mg)',
  'Paracetamol / Acetaminophen (650mg)': 'पैरासिटामोल / एसिटामिनोफेन (650mg)',
  'Montelukast Sodium (10mg) + Levocetirizine Dihydrochloride (5mg)': 'मोंटेलुकास्ट सोडियम (10mg) + लेवोसेटिरिज़िन डाइहाइड्रोक्लोराइड (5mg)',
  'Glimepiride (1mg) + Metformin Hydrochloride (500mg SR)': 'ग्लिमेपिराइड (1mg) + मेटफॉर्मिन हाइड्रोक्लोराइड (500mg SR)',
  'Telmisartan (40mg)': 'टेल्मिसार्टन (40mg)',
  'Aspirin / Acetylsalicylic Acid (75mg Enteric Coated)': 'एस्पिरिन / एसिटाइलसैलिसिलिक एसिड (75mg)',
  'Rosuvastatin Calcium (10mg)': 'रोसुवास्टेटिन कैल्शियम (10mg)',

  // Special Instructions
  'Take immediately after food to prevent gastric irritation. Complete full 5-day course even if fever subsides.':
    'पेट में जलन से बचने के लिए भोजन के तुरंत बाद लें। बुखार कम होने पर भी 5 दिन का पूरा कोर्स अवश्य करें।',
  'Take 30 to 45 minutes before morning breakfast with lukewarm water.':
    'सुबह के नाश्ते से 30 से 45 मिनट पहले गुनगुने पानी के साथ लें।',
  'Take only when body temperature exceeds 99.5°F or severe body ache. Do not exceed 3 tablets (2000mg) in 24 hours.':
    'केवल तभी लें जब शरीर का तापमान 99.5°F से अधिक हो या तेज बदन दर्द हो। 24 घंटे में 3 गोलियों (2000mg) से अधिक न लें।',
  'Take 30 minutes before sleep. May cause mild drowsiness; avoid driving or operating heavy equipment.':
    'सोने से 30 मिनट पहले लें। इससे हल्की नींद आ सकती है; वाहन चलाने या भारी मशीनरी चलाने से बचें।',
  'Swallow whole immediately before or with the first bite of the main meal. Do not crush or chew sustained-release formulation.':
    'मुख्य भोजन के ठीक पहले या पहले निवाले के साथ पूरा निगल लें। सस्टेन्ड-रिलीज़ गोली को कुचलें या चबाएं नहीं।',
  'Take consistently at the same time each morning. Monitor blood pressure weekly.':
    'प्रतिदिन सुबह एक ही निश्चित समय पर लें। साप्ताहिक रूप से रक्तचाप की निगरानी करें।',
  'Take strictly after a solid lunch with plenty of water. Report any black stools or unusual gum bleeding.':
    'दोपहर के भोजन के बाद पर्याप्त पानी के साथ लें। काला मल या मसूड़ों से असामान्य खून बहने पर तुरंत डॉक्टर को सूचित करें।',
  'Take at night. Cholesterol synthesis in liver peaks between midnight and 4:00 AM.':
    'रात को लें। लीवर में कोलेस्ट्रॉल का निर्माण आधी रात और सुबह 4:00 बजे के बीच चरम पर होता है।',

  // Frequencies & Timings
  '2x Daily (Twice a day)': 'दिन में 2 बार (सुबह व रात)',
  '1x Daily (Once in morning)': 'दिन में 1 बार (सुबह)',
  'Up to 3x Daily (Min 6 hours gap)': 'दिन में 3 बार तक (कम से कम 6 घंटे का अंतर)',
  '1x Daily at night': 'दिन में 1 बार (रात को)',
  '2x Daily (Breakfast & Dinner)': 'दिन में 2 बार (नाश्ते व रात के खाने पर)',
  '1x Daily (Morning)': 'दिन में 1 बार (सुबह)',
  '1x Daily (After Lunch)': 'दिन में 1 बार (दोपहर के खाने के बाद)',
  '5 Days': '5 दिन',
  '7 Days': '7 दिन',
  '30 Days (Ongoing)': '30 दिन (नियमित)',
  '3 to 5 Days (SOS)': '3 से 5 दिन (ज़रूरत पर)',

  // Food relations
  'Before Meals': 'भोजन से पहले',
  'With Meals': 'भोजन के साथ',
  'After Meals': 'भोजन के बाद',
  'Empty Stomach': 'खाली पेट',
  'Anytime': 'कभी भी',

  // Drug Interactions
  'Amoxicillin-Clavulanate combined with Levocetirizine: Increased risk of mild GI upset and lethargy.':
    'एमोक्सिसिलिन-क्लावुलैनेट और लेवोसेटिरिज़िन का संयोजन: पेट में हल्की गड़बड़ी और सुस्ती का जोखिम।',
  'Separate dosing time: Augmentin with meals, Montair-LC strictly at bedtime.':
    'खुराक का समय अलग रखें: ऑगमेंटिन भोजन के साथ, मोंटेयर-एलसी केवल सोते समय लें।',
  'Pantoprazole may slightly delay gastric absorption peak of Paracetamol.':
    'पैंटोप्राजोल पैरासिटामोल के अवशोषण को थोड़ा धीमा कर सकता है।',
  'Ensure at least 45-60 minutes interval between Pantocid and morning analgesics.':
    'पैंटोसिड और सुबह के दर्द निवारक के बीच कम से कम 45-60 मिनट का अंतर रखें।',
  'Aspirin (Ecosprin) + Glimepiride (in Glycomet-GP): Salicylates can displace sulfonylureas from plasma protein binding sites, increasing hypoglycemia risk.':
    'एस्पिरिन (इकोस्प्रिन) + ग्लिमेपिराइड: यह संयोजन रक्त शर्करा (शुगर) बहुत कम होने का जोखिम बढ़ा सकता है।',
  'Never skip meals. Keep 3 glucose candies accessible in pocket at all times. Spaced dosing schedule applied.':
    'कभी भी भोजन न छोड़ें। जेब में हमेशा 3 ग्लूकोज कैंडी रखें। अनुशंसित समय सारणी का पालन करें।',
  'Telmisartan + Metformin: Caution in dehydration or dehydration-inducing illnesses to prevent renal hypoperfusion.':
    'टेल्मिसार्टन + मेटफॉर्मिन: डिहाइड्रेशन (पानी की कमी) में सावधानी बरतें।',
  'Maintain adequate baseline hydration. Temporarily pause metformin if acute gastroenteritis occurs.':
    'पर्याप्त मात्रा में पानी पिएं। पेट खराब होने पर डॉक्टर से संपर्क करें।',

  // Common titles
  'Augmentin 625mg Care Plan': 'ऑगमेंटिन 625mg देखभाल योजना',
  'Cardio-Metabolic Management Care Plan': 'कार्डियो-मेटाबॉलिक प्रबंधन योजना',
  'Acute Bronchial Infection Care Plan': 'तीव्र ब्रोंकियल संक्रमण देखभाल योजना',
  'Prescription Care Plan': 'प्रिस्क्रिप्शन देखभाल योजना',
};

// Translate timing slot text (e.g. "07:15 AM (Pre-Breakfast)" -> "07:15 AM (नाश्ते से पहले)")
export function localizeTimingSlot(slot: string, lang: Lang): string {
  if (lang !== 'hi') return slot;
  return slot
    .replace(/\(Pre-Breakfast\)/gi, '(नाश्ते से पहले)')
    .replace(/\(Breakfast\)/gi, '(नाश्ता)')
    .replace(/\(Lunch - SOS\)/gi, '(दोपहर का भोजन - SOS)')
    .replace(/\(Lunch\)/gi, '(दोपहर का भोजन)')
    .replace(/\(Dinner\)/gi, '(रात का खाना)')
    .replace(/\(Bedtime\)/gi, '(सोते समय)')
    .replace(/\(Empty Stomach\)/gi, '(खाली पेट)')
    .replace(/\(Evening Empty Stomach\)/gi, '(शाम को खाली पेट)')
    .replace(/\(Post-Dinner\)/gi, '(रात के खाने के बाद)');
}

// Translate clinical text
export function localizeText(text: string | undefined, lang: Lang): string {
  if (!text) return '';
  if (lang !== 'hi') return text;
  return CLINICAL_TRANSLATIONS[text] || text;
}

// Localize Medication object
export function localizeMedication(med: Medication, lang: Lang): Medication {
  if (lang !== 'hi') return med;
  return {
    ...med,
    brand_name: CLINICAL_TRANSLATIONS[med.brand_name] || med.brand_name,
    generic_name: CLINICAL_TRANSLATIONS[med.generic_name] || med.generic_name,
    dosage: CLINICAL_TRANSLATIONS[med.dosage] || med.dosage,
    frequency: CLINICAL_TRANSLATIONS[med.frequency] || med.frequency,
    duration: CLINICAL_TRANSLATIONS[med.duration] || med.duration,
    special_instructions: med.special_instructions ? (CLINICAL_TRANSLATIONS[med.special_instructions] || med.special_instructions) : undefined,
    purpose: med.purpose ? (CLINICAL_TRANSLATIONS[med.purpose] || med.purpose) : undefined,
    food_relation: med.food_relation ? ((CLINICAL_TRANSLATIONS[med.food_relation] as any) || med.food_relation) : undefined,
    timing_slots: med.timing_slots?.map(s => {
      if (s === 'Morning') return 'सुबह';
      if (s === 'Afternoon') return 'दोपहर';
      if (s === 'Evening') return 'शाम';
      if (s === 'Bedtime') return 'रात';
      return s;
    })
  };
}

// Localize ScheduleSlot object
export function localizeScheduleSlot(slot: ScheduleSlot, lang: Lang): ScheduleSlot {
  if (lang !== 'hi') return slot;
  return {
    ...slot,
    time_slot: localizeTimingSlot(slot.time_slot, lang),
    dietary_note: CLINICAL_TRANSLATIONS[slot.dietary_note] || slot.dietary_note,
    medications_to_take: slot.medications_to_take?.map(m => {
      for (const [en, hi] of Object.entries(CLINICAL_TRANSLATIONS)) {
        if (m.includes(en)) {
          return m.replace(en, hi);
        }
      }
      return m;
    })
  };
}

// Localize DrugInteraction object
export function localizeDrugInteraction(item: DrugInteraction, lang: Lang): DrugInteraction {
  if (lang !== 'hi') return item;
  return {
    ...item,
    description: CLINICAL_TRANSLATIONS[item.description] || item.description,
    action_recommended: item.action_recommended ? (CLINICAL_TRANSLATIONS[item.action_recommended] || item.action_recommended) : undefined,
    interacting_drugs: item.interacting_drugs?.map(d => CLINICAL_TRANSLATIONS[d] || d),
  };
}

// Localize entire PrescriptionAnalysisResult
export function localizePrescriptionResult(result: PrescriptionAnalysisResult, lang: Lang): PrescriptionAnalysisResult {
  if (lang !== 'hi') return result;

  return {
    ...result,
    patient_info: {
      ...result.patient_info,
      name: CLINICAL_TRANSLATIONS[result.patient_info?.name] || result.patient_info?.name,
      physician_name: CLINICAL_TRANSLATIONS[result.patient_info?.physician_name || ''] || result.patient_info?.physician_name,
      hospital_clinic: CLINICAL_TRANSLATIONS[result.patient_info?.hospital_clinic || ''] || result.patient_info?.hospital_clinic,
      diagnosis_impression: CLINICAL_TRANSLATIONS[result.patient_info?.diagnosis_impression || ''] || result.patient_info?.diagnosis_impression,
      doctor_notes: CLINICAL_TRANSLATIONS[result.patient_info?.doctor_notes || ''] || result.patient_info?.doctor_notes,
    },
    medications: result.medications?.map(m => localizeMedication(m, lang)) || [],
    schedule_24h: result.schedule_24h?.map(s => localizeScheduleSlot(s, lang)) || [],
    drug_interactions: result.drug_interactions?.map(i => localizeDrugInteraction(i, lang)) || [],
    dietary_warnings: result.dietary_warnings?.map(w => CLINICAL_TRANSLATIONS[w] || w) || [],
  };
}

// Localize PrescriptionHistoryItem
export function localizeHistoryItem(item: PrescriptionHistoryItem, lang: Lang): PrescriptionHistoryItem {
  if (lang !== 'hi') return item;

  return {
    ...item,
    prescription_name: CLINICAL_TRANSLATIONS[item.prescription_name] || item.prescription_name,
    patient_name: CLINICAL_TRANSLATIONS[item.patient_name] || item.patient_name,
    data: localizePrescriptionResult(item.data, lang),
  };
}

