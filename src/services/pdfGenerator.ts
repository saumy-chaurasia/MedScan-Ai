import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PrescriptionAnalysisResult } from '../types/prescription';

export function generateCarePlanPDF(result: PrescriptionAnalysisResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Colors
  const darkNavy = [7, 10, 17] as [number, number, number];
  const cyanBrand = [0, 242, 254] as [number, number, number];
  const slateText = [100, 116, 139] as [number, number, number];

  // Header Banner
  doc.setFillColor(...darkNavy);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Liquid Line
  doc.setFillColor(...cyanBrand);
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MEDSCAN AI', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 240, 255);
  doc.text('CLINICAL 24-HOUR PATIENT CARE PLAN & INTERACTION SUMMARY', 14, 22);

  // Date on right
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setFontSize(8);
  doc.text(`Generated: ${reportDate}`, pageWidth - 14, 15, { align: 'right' });
  doc.text('Verified by MedScan AI Vision', pageWidth - 14, 21, { align: 'right' });

  let cursorY = 38;

  // Patient Info Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, cursorY, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Patient: ${result.patient_info?.name || 'N/A'}`, 18, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateText);
  doc.text(`Age / Gender: ${result.patient_info?.age_gender || 'Not Specified'}`, 18, cursorY + 14);
  doc.text(`Prescription Date: ${result.patient_info?.date || reportDate}`, 18, cursorY + 20);

  // Doctor side
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Doctor: ${result.patient_info?.physician_name || 'Attending Physician'}`, 110, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateText);
  doc.text(`Clinic/Hospital: ${result.patient_info?.hospital_clinic || 'General Healthcare Clinic'}`, 110, cursorY + 14);
  doc.text(`Diagnosis: ${result.patient_info?.diagnosis_impression || 'Clinical Assessment'}`, 110, cursorY + 20);

  cursorY += 32;

  // Section 1: Decoded Medications Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Decoded Prescribed Medications & Active Compounds', 14, cursorY);
  cursorY += 4;

  const medRows = result.medications.map((m, index) => [
    `${index + 1}. ${m.brand_name}`,
    m.generic_name,
    m.dosage,
    m.frequency,
    m.duration || 'As directed',
    m.timing_slots.join(', '),
    m.special_instructions || 'Take as indicated',
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Brand Name', 'Generic Compound', 'Dose', 'Freq', 'Duration', 'Slots', 'Special Instructions']],
    body: medRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold' },
      1: { cellWidth: 38 },
      2: { cellWidth: 16 },
      3: { cellWidth: 20 },
      4: { cellWidth: 18 },
      5: { cellWidth: 25 },
      6: { cellWidth: 35 },
    },
    margin: { left: 14, right: 14 },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 10;

  // Section 2: 24-Hour Administration Schedule
  if (cursorY > 230) {
    doc.addPage();
    cursorY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. 24-Hour Chronotherapeutic Administration Timeline', 14, cursorY);
  cursorY += 4;

  const scheduleRows = result.schedule_24h.map((s) => [
    s.time_slot,
    s.medications_to_take.join('\n• '),
    s.dietary_note,
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Time Slot', 'Medications to Take', 'Dietary & Fluid Instructions']],
    body: scheduleRows,
    theme: 'striped',
    headStyles: {
      fillColor: [6, 182, 212],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold' },
      1: { cellWidth: 62 },
      2: { cellWidth: 80 },
    },
    margin: { left: 14, right: 14 },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 10;

  // Section 3: Drug Interactions & Hazard Matrix
  if (cursorY > 235) {
    doc.addPage();
    cursorY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Drug-Drug Interactions & Hazard Safeguards', 14, cursorY);
  cursorY += 4;

  const interactionRows = result.drug_interactions.map((i) => [
    i.severity.toUpperCase(),
    i.description,
    i.action_recommended || 'Follow spacing instructions carefully.',
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Severity', 'Clinical Interaction Summary', 'Safety Recommendation']],
    body: interactionRows,
    theme: 'grid',
    headStyles: {
      fillColor: [239, 68, 68],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold' },
      1: { cellWidth: 86 },
      2: { cellWidth: 70 },
    },
    margin: { left: 14, right: 14 },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // Section 4: Dietary Guardrails
  if (cursorY > 240) {
    doc.addPage();
    cursorY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Essential Dietary & Lifestyle Guardrails', 14, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  result.dietary_warnings.forEach((warning) => {
    if (cursorY > 275) {
      doc.addPage();
      cursorY = 20;
    }
    doc.text(`• ${warning}`, 16, cursorY);
    cursorY += 4.5;
  });

  // Footer Disclaimer
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const disclaimer = 'DISCLAIMER: MedScan AI is an artificial intelligence decision-support tool. It does not replace professional medical diagnosis, advice, or physician judgment. Always verify with your registered pharmacist or prescribing clinician before altering any medication dosages.';
  doc.text(disclaimer, 14, 290, { maxWidth: pageWidth - 28 });

  // Save the PDF
  const cleanPatientName = (result.patient_info?.name || 'Patient').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`MedScan_CarePlan_${cleanPatientName}.pdf`);
}
