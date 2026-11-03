import { PrescriptionAnalysisResult } from '../types/prescription';

export interface SamplePrescriptionItem {
  id: string;
  title: string;
  subtitle: string;
  doctor: string;
  specialty: string;
  hospital: string;
  tag: string;
  imageThumbnail: string;
  data: PrescriptionAnalysisResult;
}

// Helper to generate SVG thumbnail data URLs for realistic prescription previews
function generatePrescriptionSVG(
  doctor: string,
  hospital: string,
  date: string,
  medicines: string[],
  patient = 'Patient',
  ageSex = 'Adult',
  diagnosis = 'Clinical Evaluation'
): string {
  const medLines = medicines
    .map(
      (m, i) => `
    <g transform="translate(45, ${250 + i * 48})">
      <circle cx="10" cy="10" r="10" fill="#0284C7" fill-opacity="0.12"/>
      <text x="10" y="14" font-family="'Courier New', Courier, monospace" font-size="11" font-weight="bold" fill="#0369A1" text-anchor="middle">${i + 1}</text>
      <text x="32" y="12" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="700" fill="#0F172A">${m}</text>
      <line x1="32" y1="24" x2="510" y2="24" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3 3"/>
    </g>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840" fill="none">
    <defs>
      <linearGradient id="header-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0369A1"/>
        <stop offset="100%" stop-color="#0284C7"/>
      </linearGradient>
    </defs>

    <!-- Paper Sheet Background -->
    <rect width="600" height="840" rx="8" fill="#FDFBF7"/>
    <rect x="12" y="12" width="576" height="816" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>

    <!-- Watermark -->
    <g transform="translate(300, 470) rotate(-35)" opacity="0.04" pointer-events="none">
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="52" font-weight="900" fill="#0F172A" text-anchor="middle">OFFICIAL CLINICAL RX</text>
    </g>

    <!-- Clinic Letterhead Header -->
    <rect x="12" y="12" width="576" height="105" rx="6" fill="url(#header-grad)"/>
    <circle cx="58" cy="64" r="28" fill="#FFFFFF" fill-opacity="0.2"/>
    <path d="M58 46v36M40 64h36" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    
    <text x="100" y="52" font-family="'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" letter-spacing="0.5">${hospital}</text>
    <text x="100" y="72" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="500" fill="#E0F2FE">DEPARTMENT OF CLINICAL PHARMACOTHERAPY &amp; INTERNAL MEDICINE</text>
    <text x="100" y="90" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="400" fill="#BAE6FD">24x7 Emergency Care • ISO 9001:2015 Certified Health Center • Ph: +91 11 4982 0000</text>

    <!-- Doctor Details Row -->
    <rect x="30" y="128" width="540" height="42" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="44" y="146" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="700" fill="#0F172A">Physician: ${doctor}</text>
    <text x="44" y="161" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" fill="#64748B">Reg. No: MCI-74892/2018 | Specialty: Internal Medicine &amp; Clinical Care</text>
    <text x="450" y="152" font-family="'Courier New', Courier, monospace" font-size="11" font-weight="700" fill="#0369A1">DATE: ${date}</text>

    <!-- Patient Metadata Row -->
    <rect x="30" y="178" width="540" height="38" rx="6" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="44" y="195" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="700" fill="#334155">Patient: <tspan fill="#0F172A" font-weight="800">${patient}</tspan></text>
    <text x="260" y="195" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#475569">Age/Sex: ${ageSex}</text>
    <text x="420" y="195" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="600" fill="#64748B">OPD Ref: #RX-${date.replace(/[^0-9]/g, '')}</text>
    <text x="44" y="209" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" fill="#64748B">Diagnosis: <tspan fill="#0369A1" font-weight="600">${diagnosis}</tspan></text>

    <!-- Classic Prescription Symbol Rx -->
    <text x="42" y="248" font-family="'Georgia', serif" font-size="32" font-weight="bold" font-style="italic" fill="#0284C7">℞</text>
    <line x1="72" y1="242" x2="565" y2="242" stroke="#CBD5E1" stroke-width="1.5"/>

    <!-- Prescribed Medicines -->
    ${medLines}

    <!-- Precautions & Dietary Notes Box -->
    <rect x="30" y="650" width="540" height="74" rx="6" fill="#FEF2F2" stroke="#FECACA"/>
    <text x="45" y="670" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="700" fill="#DC2626">Precautions &amp; Patient Dietary Guardrails:</text>
    <text x="45" y="688" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" fill="#475569">• Complete full antibiotic and therapeutic cycle without interrupting dosages.</text>
    <text x="45" y="703" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" fill="#475569">• Avoid alcohol, tobacco, and high-fat meals. Consume 2.5L+ fluids daily.</text>
    <text x="45" y="718" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" fill="#475569">• Contact hospital immediately if rash, breathing discomfort, or fever &gt; 101°F develops.</text>

    <!-- Clinic Rubber Stamp & Signature -->
    <g transform="translate(80, 770)">
      <circle cx="35" cy="0" r="30" fill="none" stroke="#DC2626" stroke-width="2" stroke-opacity="0.85" stroke-dasharray="4 2"/>
      <circle cx="35" cy="0" r="26" fill="none" stroke="#DC2626" stroke-width="1" stroke-opacity="0.7"/>
      <text x="35" y="-6" font-family="'Helvetica Neue', Arial, sans-serif" font-size="7" font-weight="bold" fill="#DC2626" text-anchor="middle">APEX HEALTH COUNCIL</text>
      <text x="35" y="4" font-family="'Helvetica Neue', Arial, sans-serif" font-size="8" font-weight="900" fill="#DC2626" text-anchor="middle">★ VERIFIED ★</text>
      <text x="35" y="14" font-family="'Helvetica Neue', Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#DC2626" text-anchor="middle">CLINICAL AUDIT</text>
    </g>

    <g transform="translate(420, 780)">
      <path d="M-40 -10 C-10 -30, 20 -5, 50 -25 C70 -40, 90 -10, 110 -20" stroke="#0369A1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="-50" y1="0" x2="110" y2="0" stroke="#94A3B8" stroke-width="1"/>
      <text x="30" y="15" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="700" fill="#475569" text-anchor="middle">Authorized Clinician Signature</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PRESCRIPTIONS: SamplePrescriptionItem[] = [
  {
    id: 'sample-antibiotic-resp',
    title: 'Acute Bronchial Infection',
    subtitle: 'Augmentin 625mg + Dolo 650mg + Pantocid + Montair-LC',
    doctor: 'Dr. Rajesh Sharma, MD (Pulmonology)',
    specialty: 'Chest & Respiratory Care',
    hospital: 'Apex Multi-Specialty Hospital',
    tag: 'Antibiotic & Fever Care',
    imageThumbnail: generatePrescriptionSVG('Dr. Rajesh Sharma, MD', 'APEX PULMOCARE CLINIC', '14 Oct 2026', [
      'Augmentin 625mg (1-0-1) x 5 days',
      'Dolo 650mg (SOS max 3x daily)',
      'Pantocid 40mg (1-0-0) empty stomach',
      'Montair-LC (0-0-1) at bedtime'
    ], 'Arjun Verma', '34 Y / Male', 'Acute Lower Respiratory Infection'),
    data: {
      patient_info: {
        name: 'Arjun Verma',
        date: '2026-10-14',
        physician_name: 'Dr. Rajesh Sharma, MD (Chest Physician)',
        hospital_clinic: 'Apex Pulmocare Clinic, New Delhi',
        age_gender: '34 Y / Male',
        diagnosis_impression: 'Acute Lower Respiratory Tract Infection & Mild Bronchospasm',
        doctor_notes: 'Patient presents with persistent productive cough, low-grade pyrexia (100.4°F), and nocturnal wheezing for 4 days. Chest auscultation reveals bilateral rhonchi.'
      },
      medications: [
        {
          brand_name: 'Augmentin 625mg',
          generic_name: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
          dosage: '1 Tablet (625mg)',
          frequency: '2x Daily (Twice a day)',
          duration: '5 Days',
          timing_slots: ['Morning', 'Evening'],
          food_relation: 'After Meals',
          special_instructions: 'Take immediately after food to prevent gastric irritation. Complete full 5-day course even if fever subsides.',
          purpose: 'Broad-spectrum beta-lactamase resistant antibacterial'
        },
        {
          brand_name: 'Pantocid 40mg',
          generic_name: 'Pantoprazole Sodium (40mg)',
          dosage: '1 Tablet',
          frequency: '1x Daily (Once in morning)',
          duration: '5 Days',
          timing_slots: ['Morning'],
          food_relation: 'Empty Stomach',
          special_instructions: 'Take 30 to 45 minutes before morning breakfast with lukewarm water.',
          purpose: 'Proton Pump Inhibitor (Gastric acid suppression)'
        },
        {
          brand_name: 'Dolo 650mg',
          generic_name: 'Paracetamol / Acetaminophen (650mg)',
          dosage: '1 Tablet as needed (SOS)',
          frequency: 'Up to 3x Daily (Min 6 hours gap)',
          duration: '3 to 5 Days (SOS)',
          timing_slots: ['Morning', 'Afternoon', 'Evening'],
          food_relation: 'After Meals',
          special_instructions: 'Take only when body temperature exceeds 99.5°F or severe body ache. Do not exceed 3 tablets (2000mg) in 24 hours.',
          purpose: 'Antipyretic and non-opioid analgesic'
        },
        {
          brand_name: 'Montair-LC',
          generic_name: 'Montelukast Sodium (10mg) + Levocetirizine Dihydrochloride (5mg)',
          dosage: '1 Tablet',
          frequency: '1x Daily at night',
          duration: '7 Days',
          timing_slots: ['Bedtime'],
          food_relation: 'Anytime',
          special_instructions: 'Take 30 minutes before sleep. May cause mild drowsiness; avoid driving or operating heavy equipment.',
          purpose: 'Leukotriene receptor antagonist + H1 antihistamine for airway allergy'
        }
      ],
      drug_interactions: [
        {
          severity: 'Moderate',
          description: 'Amoxicillin-Clavulanate combined with Levocetirizine: Increased risk of mild GI upset and lethargy.',
          interacting_drugs: ['Augmentin 625mg', 'Montair-LC'],
          action_recommended: 'Separate dosing time: Augmentin with meals, Montair-LC strictly at bedtime.'
        },
        {
          severity: 'Low',
          description: 'Pantoprazole may slightly delay gastric absorption peak of Paracetamol.',
          interacting_drugs: ['Pantocid 40mg', 'Dolo 650mg'],
          action_recommended: 'Ensure at least 45-60 minutes interval between Pantocid and morning analgesics.'
        }
      ],
      schedule_24h: [
        {
          time_slot: '07:15 AM (Pre-Breakfast)',
          medications_to_take: ['Pantocid 40mg (Pantoprazole)'],
          dietary_note: 'Take on an empty stomach with a full glass of lukewarm water. Wait 45 minutes before having breakfast.',
          time_category: 'Morning'
        },
        {
          time_slot: '08:30 AM (Breakfast)',
          medications_to_take: ['Augmentin 625mg (Amoxicillin + Clavulanate)'],
          dietary_note: 'Take mid-meal or immediately post-breakfast. Pair with probiotic curd or yogurt to protect intestinal microflora.',
          time_category: 'Morning'
        },
        {
          time_slot: '02:00 PM (Lunch - SOS)',
          medications_to_take: ['Dolo 650mg (Only if fever > 99.5°F or body pain)'],
          dietary_note: 'Take after lunch. Drink plenty of warm fluids (soups, herbal tea, electrolyte water).',
          time_category: 'Afternoon'
        },
        {
          time_slot: '08:30 PM (Dinner)',
          medications_to_take: ['Augmentin 625mg (Amoxicillin + Clavulanate)'],
          dietary_note: 'Take strictly within 15 minutes of concluding dinner to optimize systemic absorption and minimize nausea.',
          time_category: 'Evening'
        },
        {
          time_slot: '10:00 PM (Bedtime)',
          medications_to_take: ['Montair-LC (Montelukast + Levocetirizine)'],
          dietary_note: 'Take with a glass of water right before sleep. Sleep in a slightly elevated head position to ease breathing.',
          time_category: 'Bedtime'
        }
      ],
      dietary_warnings: [
        'Strictly avoid alcoholic beverages while on antibiotic and antihistamine therapy (risk of CNS depression and hepatic strain).',
        'Incorporate probiotic foods (fresh curd, kefir) at least 2 hours away from Augmentin to restore beneficial gut bacteria.',
        'Avoid cold drinks, citrus fruits with high acidity at night, and excessive caffeine which can exacerbate bronchospasm.',
        'Maintain daily fluid intake above 2.5 to 3 Liters to facilitate bronchial mucus clearance.'
      ],
      confidence_score: 0.985,
      processed_at: '2026-10-30T10:15:00Z'
    }
  },
  {
    id: 'sample-cardio-diabetic',
    title: 'Cardio-Metabolic Management',
    subtitle: 'Glycomet-GP 1/500 + Telma 40 + Rosuvas 10 + Ecosprin 75',
    doctor: 'Dr. Sunita Deshmukh, MD, DM (Cardiology)',
    specialty: 'Heart & Vascular Institute',
    hospital: 'Fortis Escorts Heart Centre',
    tag: 'Hypertension & Diabetes',
    imageThumbnail: generatePrescriptionSVG('Dr. Sunita Deshmukh, DM', 'FORTIS HEART & DIABETES', '22 Oct 2026', [
      'Glycomet-GP 1/500 (1-0-1) before meals',
      'Telma 40mg (1-0-0) morning',
      'Rosuvas 10mg (0-0-1) bedtime',
      'Ecosprin 75mg (0-1-0) post-lunch'
    ], 'Venkatesh Ramanathan', '58 Y / Male', 'Type 2 Diabetes & Hypertension'),
    data: {
      patient_info: {
        name: 'Venkatesh Ramanathan',
        date: '2026-10-22',
        physician_name: 'Dr. Sunita Deshmukh, DM (Cardiology)',
        hospital_clinic: 'Fortis Escorts Heart & Metabolism Centre',
        age_gender: '58 Y / Male',
        diagnosis_impression: 'Type 2 Diabetes Mellitus with Essential Hypertension & Hyperlipidemia',
        doctor_notes: 'HbA1c 8.2%, BP 142/88 mmHg. Baseline renal function normal. Advised strict carbohydrate moderation and 30 mins brisk walking.'
      },
      medications: [
        {
          brand_name: 'Glycomet-GP 1/500',
          generic_name: 'Glimepiride (1mg) + Metformin Hydrochloride (500mg SR)',
          dosage: '1 Tablet',
          frequency: '2x Daily (Breakfast & Dinner)',
          duration: '30 Days (Ongoing)',
          timing_slots: ['Morning', 'Evening'],
          food_relation: 'With Meals',
          special_instructions: 'Swallow whole immediately before or with the first bite of the main meal. Do not crush or chew sustained-release formulation.',
          purpose: 'Dual mechanism oral hypoglycemic agent'
        },
        {
          brand_name: 'Telma 40mg',
          generic_name: 'Telmisartan (40mg)',
          dosage: '1 Tablet',
          frequency: '1x Daily (Morning)',
          duration: '30 Days (Ongoing)',
          timing_slots: ['Morning'],
          food_relation: 'Anytime',
          special_instructions: 'Take consistently at the same time each morning. Monitor blood pressure weekly.',
          purpose: 'Angiotensin II Receptor Blocker (Antihypertensive)'
        },
        {
          brand_name: 'Ecosprin 75mg',
          generic_name: 'Aspirin / Acetylsalicylic Acid (75mg Enteric Coated)',
          dosage: '1 Tablet',
          frequency: '1x Daily (After Lunch)',
          duration: '30 Days (Ongoing)',
          timing_slots: ['Afternoon'],
          food_relation: 'After Meals',
          special_instructions: 'Take strictly after a solid lunch with plenty of water. Report any black stools or unusual gum bleeding.',
          purpose: 'Antiplatelet agent for cardiovascular secondary prophylaxis'
        },
        {
          brand_name: 'Rosuvas 10mg',
          generic_name: 'Rosuvastatin Calcium (10mg)',
          dosage: '1 Tablet',
          frequency: '1x Daily at night',
          duration: '30 Days (Ongoing)',
          timing_slots: ['Bedtime'],
          food_relation: 'After Meals',
          special_instructions: 'Take at night. Cholesterol synthesis in liver peaks between midnight and 4:00 AM.',
          purpose: 'HMG-CoA Reductase Inhibitor (Lipid lowering)'
        }
      ],
      drug_interactions: [
        {
          severity: 'High',
          description: 'Aspirin (Ecosprin) + Glimepiride (in Glycomet-GP): Salicylates can displace sulfonylureas from plasma protein binding sites, increasing hypoglycemia risk.',
          interacting_drugs: ['Ecosprin 75mg', 'Glycomet-GP 1/500'],
          action_recommended: 'Never skip meals. Keep 3 glucose candies accessible in pocket at all times. Spaced dosing schedule applied.'
        },
        {
          severity: 'Moderate',
          description: 'Telmisartan + Metformin: Caution in dehydration or dehydration-inducing illnesses to prevent renal hypoperfusion.',
          interacting_drugs: ['Telma 40mg', 'Glycomet-GP 1/500'],
          action_recommended: 'Maintain adequate baseline hydration. Temporarily pause metformin if acute gastroenteritis occurs.'
        }
      ],
      schedule_24h: [
        {
          time_slot: '08:00 AM (Breakfast)',
          medications_to_take: ['Glycomet-GP 1/500 (Glimepiride + Metformin)', 'Telma 40mg (Telmisartan)'],
          dietary_note: 'Take Glycomet-GP with the first bite of oats or whole-wheat paratha. Telma can be taken right before or after.',
          time_category: 'Morning'
        },
        {
          time_slot: '01:30 PM (Lunch)',
          medications_to_take: ['Ecosprin 75mg (Enteric Coated Aspirin)'],
          dietary_note: 'Take with half glass of water post lunch. Do not lie flat immediately for 20 minutes to prevent gastric reflux.',
          time_category: 'Afternoon'
        },
        {
          time_slot: '08:00 PM (Dinner)',
          medications_to_take: ['Glycomet-GP 1/500 (Glimepiride + Metformin)'],
          dietary_note: 'Take with first bite of dinner. Must have adequate complex carbs to prevent 3:00 AM nocturnal hypoglycemia.',
          time_category: 'Evening'
        },
        {
          time_slot: '10:00 PM (Bedtime)',
          medications_to_take: ['Rosuvas 10mg (Rosuvastatin)'],
          dietary_note: 'Take before sleeping. Avoid grapefruit or grapefruit-based drinks as they inhibit CYP3A4 metabolism.',
          time_category: 'Bedtime'
        }
      ],
      dietary_warnings: [
        'Grapefruit and Seville oranges must be strictly eliminated (interferes with statin hepatic breakdown).',
        'Limit high-potassium salt substitutes while taking Telmisartan (risk of hyperkalemia).',
        'Avoid fasting or skipping meals while on Glimepiride to prevent acute hypoglycemia shock.',
        'Limit alcohol strictly; concurrent use with Metformin drastically increases lactic acidosis risk.'
      ],
      confidence_score: 0.992,
      processed_at: '2026-10-30T11:45:00Z'
    }
  },
  {
    id: 'sample-post-op-ortho',
    title: 'Post-Op Knee Arthroscopy',
    subtitle: 'Ultracet + Chymoral Forte + Pan-D + Shelcal-500',
    doctor: 'Dr. Vikramaditya Rathore, MS (Ortho)',
    specialty: 'Department of Orthopedic Surgery',
    hospital: 'Max Super Speciality Hospital',
    tag: 'Surgical Recovery & Analgesia',
    imageThumbnail: generatePrescriptionSVG('Dr. Vikramaditya Rathore', 'MAX ORTHOPEDIC CARE', '28 Oct 2026', [
      'Pan-D (1-0-0) 30 min before food',
      'Chymoral Forte (1-0-1) empty stomach',
      'Ultracet (1-0-1) post-meals',
      'Shelcal-500 (0-1-0) post-lunch'
    ]),
    data: {
      patient_info: {
        name: 'Meera Sengupta',
        date: '2026-10-28',
        physician_name: 'Dr. Vikramaditya Rathore, MS (Ortho), Fellow Arthroscopy',
        hospital_clinic: 'Max Centre for Joint & Sports Injuries',
        age_gender: '46 Y / Female',
        diagnosis_impression: 'Post Right Knee Arthroscopic Meniscal Debridement (Day 2 Post-Op)',
        doctor_notes: 'Operative site clean, dressing dry and intact. Active quadriceps exercises initiated. Weight bearing as tolerated with crutch.'
      },
      medications: [
        {
          brand_name: 'Pan-D',
          generic_name: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
          dosage: '1 Capsule',
          frequency: '1x Daily (Morning)',
          duration: '7 Days',
          timing_slots: ['Morning'],
          food_relation: 'Empty Stomach',
          special_instructions: 'Take early morning with water 45 minutes before morning breakfast. Protects mucosal lining from pain medications.',
          purpose: 'Gastroprotective anti-reflux'
        },
        {
          brand_name: 'Chymoral Forte',
          generic_name: 'Trypsin + Chymotrypsin (100,000 Armour Units)',
          dosage: '1 Tablet',
          frequency: '2x Daily',
          duration: '5 Days',
          timing_slots: ['Morning', 'Evening'],
          food_relation: 'Empty Stomach',
          special_instructions: 'Take on an empty stomach at least 1 hour before food or 2 hours after food. Enteric coated; do not split.',
          purpose: 'Proteolytic enzymatic anti-edema and anti-inflammatory'
        },
        {
          brand_name: 'Ultracet',
          generic_name: 'Tramadol Hydrochloride (37.5mg) + Paracetamol (325mg)',
          dosage: '1 Tablet',
          frequency: '2x Daily (SOS for moderate-to-severe surgical pain)',
          duration: '5 Days max',
          timing_slots: ['Morning', 'Evening'],
          food_relation: 'After Meals',
          special_instructions: 'Take strictly after a solid meal. May induce drowsiness, dizziness, or mild constipation. Increase dietary fiber.',
          purpose: 'Synergistic central and peripheral opioid analgesia'
        },
        {
          brand_name: 'Shelcal 500',
          generic_name: 'Elemental Calcium (500mg) + Vitamin D3 / Cholecalciferol (250 IU)',
          dosage: '1 Tablet',
          frequency: '1x Daily',
          duration: '30 Days',
          timing_slots: ['Afternoon'],
          food_relation: 'After Meals',
          special_instructions: 'Take after lunch with water. Calcium carbonate requires gastric acid for optimal dissolution.',
          purpose: 'Bone mineral optimization and skeletal remodeling'
        }
      ],
      drug_interactions: [
        {
          severity: 'Moderate',
          description: 'Tramadol (Ultracet) with Domperidone (Pan-D): Both agents have modest potential to prolong cardiac QTc interval if overdosed.',
          interacting_drugs: ['Ultracet', 'Pan-D'],
          action_recommended: 'Adhere to prescribed single tablet doses; do not double dose if breakthrough pain occurs.'
        },
        {
          severity: 'Low',
          description: 'Calcium (Shelcal) should not be taken concurrently with heavy mineral supplements or certain antibiotics.',
          interacting_drugs: ['Shelcal 500'],
          action_recommended: 'Maintain afternoon post-lunch slot to prevent interfering with morning empty stomach enzyme absorption.'
        }
      ],
      schedule_24h: [
        {
          time_slot: '07:30 AM (Empty Stomach)',
          medications_to_take: ['Pan-D (Pantoprazole + Domperidone)', 'Chymoral Forte (Trypsin + Chymotrypsin)'],
          dietary_note: 'Take with warm water. Wait 45 minutes before having breakfast so enzymatic action is uninhibited by food.',
          time_category: 'Morning'
        },
        {
          time_slot: '08:30 AM (Breakfast)',
          medications_to_take: ['Ultracet (Tramadol + Paracetamol)'],
          dietary_note: 'Take after solid breakfast. Include fiber (papaya, oats, prunes) to prevent opioid-induced constipation.',
          time_category: 'Morning'
        },
        {
          time_slot: '02:00 PM (Lunch)',
          medications_to_take: ['Shelcal 500 (Calcium + Vit D3)'],
          dietary_note: 'Take after lunch with water. Avoid drinking strong black tea or unrefined bran within 1 hour as phytates bind calcium.',
          time_category: 'Afternoon'
        },
        {
          time_slot: '06:00 PM (Evening Empty Stomach)',
          medications_to_take: ['Chymoral Forte (Trypsin + Chymotrypsin)'],
          dietary_note: 'Take 1 hour before dinner on empty stomach with half glass of plain water.',
          time_category: 'Evening'
        },
        {
          time_slot: '08:45 PM (Post-Dinner)',
          medications_to_take: ['Ultracet (Tramadol + Paracetamol)'],
          dietary_note: 'Take strictly after dinner. Do not consume alcohol or sedatives. Ice the knee for 15 minutes before bed.',
          time_category: 'Bedtime'
        }
      ],
      dietary_warnings: [
        'Strictly zero alcohol intake while taking Tramadol (causes dangerous central nervous system and respiratory depression).',
        'High hydration (at least 2.5 Liters of water daily) to assist kidney clearance of enzymatic metabolites and prevent constipation.',
        'Avoid taking Calcium simultaneously with iron or zinc supplements (separate by at least 3 hours).'
      ],
      confidence_score: 0.978,
      processed_at: '2026-10-30T12:00:00Z'
    }
  },
  {
    id: 'sample-gi-acid',
    title: 'Gastroenteritis & Acid Peptic Disorder',
    subtitle: 'Pantocid-DSR + Cifran-TZ + Econorm + Sucrafil',
    doctor: 'Dr. Anand Joshi, MD, DM (Gastroenterology)',
    specialty: 'Digestive Health Clinic',
    hospital: 'Apollo Hospitals',
    tag: 'GI & Infection Protocol',
    imageThumbnail: generatePrescriptionSVG('Dr. Anand Joshi, DM', 'APOLLO GASTRO CLINIC', '29 Oct 2026', [
      'Pantocid-DSR (1-0-0) empty stomach',
      'Cifran-TZ (1-0-1) post food x 3 days',
      'Sucrafil Suspension (2 tsp TDS) 1hr pre-meal',
      'Econorm Sachet (1-0-1) in water'
    ], 'Priyanka Chopra', '29 Y / Female', 'Infectious Gastroenteritis'),
    data: {
      patient_info: {
        name: 'Priyanka Chopra',
        date: '2026-10-29',
        physician_name: 'Dr. Anand Joshi, DM (Gastroenterology)',
        hospital_clinic: 'Apollo Institute of Digestive Sciences',
        age_gender: '29 Y / Female',
        diagnosis_impression: 'Acute Infectious Gastroenteritis with Secondary Gastritis',
        doctor_notes: 'Epigastric burning, crampy abdominal pain, loose stools for 36 hours post travel. Mild dehydration signs noted.'
      },
      medications: [
        {
          brand_name: 'Pantocid-DSR',
          generic_name: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
          dosage: '1 Capsule',
          frequency: '1x Daily',
          duration: '5 Days',
          timing_slots: ['Morning'],
          food_relation: 'Empty Stomach',
          special_instructions: 'Take 45 minutes before breakfast with lukewarm water.',
          purpose: 'Proton pump inhibitor and antiemetic'
        },
        {
          brand_name: 'Cifran-TZ',
          generic_name: 'Ciprofloxacin (500mg) + Tinidazole (600mg)',
          dosage: '1 Tablet',
          frequency: '2x Daily',
          duration: '3 Days',
          timing_slots: ['Morning', 'Evening'],
          food_relation: 'After Meals',
          special_instructions: 'Take post meal with plenty of water. May cause mild metallic taste in mouth. Strictly avoid alcohol.',
          purpose: 'Dual antibacterial and antiprotozoal agent'
        },
        {
          brand_name: 'Sucrafil Suspension',
          generic_name: 'Sucralfate (1000mg / 10ml)',
          dosage: '10 ml (2 Teaspoons)',
          frequency: '3x Daily',
          duration: '5 Days',
          timing_slots: ['Morning', 'Afternoon', 'Evening'],
          food_relation: 'Empty Stomach',
          special_instructions: 'Take 1 hour before meals. Forms protective barrier coating over inflamed gastric mucosa.',
          purpose: 'Cytoprotective mucosal adherence agent'
        },
        {
          brand_name: 'Econorm Sachet',
          generic_name: 'Saccharomyces boulardii (250mg lyophilized yeast)',
          dosage: '1 Sachet in water',
          frequency: '2x Daily',
          duration: '5 Days',
          timing_slots: ['Morning', 'Evening'],
          food_relation: 'Anytime',
          special_instructions: 'Dissolve in room temperature water or yogurt. Do not mix in very hot liquids (heat inactivates yeast).',
          purpose: 'Probiotic anti-diarrheal flora restorer'
        }
      ],
      drug_interactions: [
        {
          severity: 'Critical',
          description: 'Ciprofloxacin + Tinidazole with Alcohol: Disulfiram-like acute reaction causing intense nausea, tachycardia, flushing, and vomiting.',
          interacting_drugs: ['Cifran-TZ'],
          action_recommended: 'Absolute abstinence from alcohol during treatment and for 72 hours post completion.'
        },
        {
          severity: 'High',
          description: 'Sucralfate binds and drastically inhibits bioavailability of Ciprofloxacin by up to 90% if taken concurrently.',
          interacting_drugs: ['Sucrafil Suspension', 'Cifran-TZ'],
          action_recommended: 'Strictly separate Sucrafil and Cifran-TZ by at least 2 full hours.'
        }
      ],
      schedule_24h: [
        {
          time_slot: '07:00 AM (Early Empty Stomach)',
          medications_to_take: ['Pantocid-DSR (Pantoprazole + Domperidone)'],
          dietary_note: 'Take on empty stomach with plain water. Rest for 30 minutes.',
          time_category: 'Morning'
        },
        {
          time_slot: '08:00 AM (Pre-Breakfast Coating)',
          medications_to_take: ['Sucrafil Suspension (Sucralfate 10ml)'],
          dietary_note: 'Take 30-45 minutes before breakfast to coat stomach lining. Do not take any antibiotic right now.',
          time_category: 'Morning'
        },
        {
          time_slot: '09:00 AM (Breakfast)',
          medications_to_take: ['Cifran-TZ (Ciprofloxacin + Tinidazole)'],
          dietary_note: 'Take post light breakfast (khichdi / toast). Avoid milk or high calcium dairy within 2 hours.',
          time_category: 'Morning'
        },
        {
          time_slot: '11:30 AM (Mid-Morning Probiotic)',
          medications_to_take: ['Econorm Sachet (Saccharomyces boulardii)'],
          dietary_note: 'Mix sachet into room temperature water. Excellent timing separated from antibiotics.',
          time_category: 'Morning'
        },
        {
          time_slot: '01:00 PM (Pre-Lunch Coating)',
          medications_to_take: ['Sucrafil Suspension (Sucralfate 10ml)'],
          dietary_note: 'Take 1 hour before light lunch.',
          time_category: 'Afternoon'
        },
        {
          time_slot: '08:00 PM (Pre-Dinner Coating)',
          medications_to_take: ['Sucrafil Suspension (Sucralfate 10ml)'],
          dietary_note: 'Take 45 minutes before dinner.',
          time_category: 'Evening'
        },
        {
          time_slot: '09:00 PM (Dinner)',
          medications_to_take: ['Cifran-TZ (Ciprofloxacin + Tinidazole)'],
          dietary_note: 'Take immediately after dinner with full glass of water. Remain upright for 30 minutes.',
          time_category: 'Evening'
        },
        {
          time_slot: '10:30 PM (Bedtime Probiotic)',
          medications_to_take: ['Econorm Sachet (Saccharomyces boulardii)'],
          dietary_note: 'Take in room temp water before sleep. Replenishes gut flora during the overnight resting phase.',
          time_category: 'Bedtime'
        }
      ],
      dietary_warnings: [
        'Absolute zero alcohol (Tinidazole triggers severe violent vomiting disulfiram reaction).',
        'Avoid dairy (milk, cheese) within 2 hours of Ciprofloxacin as calcium chelates the antibiotic.',
        'Avoid spicy, oily, deeply fried foods and high-sugar juices which accelerate diarrhea transit.',
        'Drink ORS (Oral Rehydration Salts) or coconut water throughout the day to replenish electrolytes.'
      ],
      confidence_score: 0.991,
      processed_at: '2026-10-30T13:30:00Z'
    }
  }
];

