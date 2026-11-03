import React, { useState } from 'react';
import { X, Bell, MessageSquare, Phone, Check, Sparkles, Send } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, patientName }) => {
  const getSavedReminders = () => {
    try {
      const raw = localStorage.getItem('medscan_reminders_v2');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  };

  const saved = getSavedReminders();
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'both'>(saved?.channel || 'whatsapp');
  const [phoneNumber, setPhoneNumber] = useState(saved?.phoneNumber || '+1 (555) 234-5678');
  const [caregiverPhone, setCaregiverPhone] = useState(saved?.caregiverPhone || '');
  const [leadTime, setLeadTime] = useState(saved?.leadTime || '15');
  const [isSent, setIsSent] = useState(false);
  const [testNotification, setTestNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveReminders = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);

    try {
      localStorage.setItem(
        'medscan_reminders_v2',
        JSON.stringify({ channel, phoneNumber, caregiverPhone, leadTime, updatedAt: new Date().toISOString() })
      );
    } catch {
      // ignore
    }

    // Show simulation toast
    setTestNotification(
      `💬 [${channel.toUpperCase()}] MedScan AI Alert: Hi ${patientName}, it's 08:30 AM! Time for your scheduled morning dose. Take after breakfast with water!`
    );
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl glass-card-premium neu-flat p-6 sm:p-8 shadow-2xl border border-white/10"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl neu-raised text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl neu-raised border border-cyan-400/30 text-cyan-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white liquid-chrome-text">Set Care Plan Reminders</h3>
            <p className="text-xs text-slate-400">Automated dosage notifications via SMS or WhatsApp</p>
          </div>
        </div>

        {/* Live Simulated Message Preview */}
        {testNotification && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-pulse-subtle">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-300">Simulated Notification Dispatched:</span>
              <p className="font-mono text-[11px] text-emerald-100">{testNotification}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveReminders} className="space-y-5">
          {/* Notification Channel */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Delivery Channel
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'whatsapp'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'neu-raised border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'sms'
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'neu-raised border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>SMS Alert</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('both')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'both'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : 'neu-raised border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Both</span>
              </button>
            </div>
          </div>

          {/* Primary Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Patient Mobile Number
            </label>
            <input
              type="text"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-2xl neu-pressed border border-white/5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Optional Caregiver Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Caregiver / Family CC (Optional)
            </label>
            <input
              type="text"
              value={caregiverPhone}
              onChange={(e) => setCaregiverPhone(e.target.value)}
              placeholder="+1 (555) 999-8888 (Receives missed dose alerts)"
              className="w-full px-4 py-2.5 rounded-2xl neu-pressed border border-white/5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Advance Notice Timing */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Alert Lead Time
            </label>
            <select
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl neu-pressed border border-white/5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              <option value="0">At Exact Scheduled Time</option>
              <option value="15">15 Minutes Prior (Recommended for meals)</option>
              <option value="30">30 Minutes Prior (Ideal for empty stomach PPIs)</option>
            </select>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl neu-raised text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl liquid-chrome-button text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSent ? 'Update Reminders' : 'Activate Live Reminders'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
