import React, { useState } from 'react';
import { X, Lock, Mail, User } from 'lucide-react';
import { UserProfile } from '../types/prescription';
import { saveUserProfile } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: fullName || (activeTab === 'login' ? 'Dr. Sarah Jenkins' : 'New User'),
      email: email || 'user@medscan.health',
      role: 'clinician',
    };
    saveUserProfile(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleDemoLogin = (role: 'patient' | 'clinician') => {
    const demoUser: UserProfile = role === 'clinician'
      ? {
          id: 'demo-clinician',
          name: 'Dr. Alistair Vance, MD',
          email: 'alistair.vance@medscan.health',
          role: 'clinician',
        }
      : {
          id: 'demo-patient',
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@gmail.com',
          phone: '+1 (555) 019-2834',
          blood_group: 'B+ Positive',
          known_allergies: ['Penicillin (Mild rash)'],
          role: 'patient',
        };
    saveUserProfile(demoUser);
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl glass-card-premium neu-flat p-6 sm:p-8 shadow-2xl border border-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl neu-raised text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl neu-raised border border-cyan-400/30 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white liquid-chrome-text">MedScan AI Account</h3>
          <p className="text-xs text-slate-400 mt-1">
            Access past prescriptions, track adherence, and sync caregiver alerts
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl neu-pressed border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'liquid-chrome-button text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'liquid-chrome-button text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => handleDemoLogin('patient')}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl neu-raised border border-white/10 hover:border-white/20 text-white text-xs sm:text-sm font-bold transition-all mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <span className="relative px-3 text-[10px] font-mono uppercase bg-[#0C111D] text-slate-500">
            Or with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-pressed border border-white/5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-pressed border border-white/5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-pressed border border-white/5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl liquid-chrome-button text-slate-950 font-black text-sm cursor-pointer mt-2"
          >
            {activeTab === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <span className="text-[11px] text-slate-500 block mb-2 font-mono">
            ⚡ Quick Test / Guest Access:
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleDemoLogin('clinician')}
              className="text-xs px-3 py-1.5 rounded-xl neu-raised text-cyan-300 border border-white/5 cursor-pointer font-semibold"
            >
              Demo Clinician
            </button>
            <button
              onClick={() => handleDemoLogin('patient')}
              className="text-xs px-3 py-1.5 rounded-xl neu-raised text-emerald-300 border border-white/5 cursor-pointer font-semibold"
            >
              Demo Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
