import React, { useState } from 'react';
import { Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

export const AboutMePage: React.FC = () => {
  const { user, lockDiary, setupPasscode, removePasscode } = useAuthStore();
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSavePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMsg('');

    if (!passcode || !/^\d{4}$/.test(passcode)) {
      setErrorMsg('PIN passcode must be exactly 4 digits.');
      return;
    }

    if (passcode !== confirmPasscode) {
      setErrorMsg('PIN passcodes do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await setupPasscode(passcode, confirmPasscode);
      setMsg('Diary PIN passcode set and hashed securely! ✨');
      setPasscode('');
      setConfirmPasscode('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to set passcode PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePasscode = async () => {
    if (window.confirm('Are you sure you want to remove your diary PIN passcode?')) {
      setIsLoading(true);
      try {
        await removePasscode();
        setMsg('Passcode PIN removed.');
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to remove passcode.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b-2 border-[#FFE4E8]">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#332C35]">
          About Me <span className="text-[#FF80AB]">🌸</span>
        </h1>
        <p className="font-handwriting text-2xl text-[#FF80AB]">
          "My identity, diary security, and personal preferences."
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border-3 border-[#FFE4E8] rounded-3xl p-8 space-y-6 shadow-scrapbook">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F3] border-3 border-[#FFB6C1] flex items-center justify-center text-3xl font-display font-bold text-[#FF80AB] shadow-xs">
            {user?.name.charAt(0).toUpperCase() || 'M'}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#332C35]">{user?.name || 'Author'}</h2>
            <p className="text-sm font-sans text-[#7A6E7D]">{user?.email || 'me@myself.private'}</p>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-[#FFE4E8] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-display text-[#7A6E7D]">
          <div className="bg-[#FFF5F5] p-4 rounded-2xl border border-[#FFD1DC]">
            <span className="block text-[#7A6E7D] font-bold">Manuscript Privacy</span>
            <span className="text-[#FF80AB] font-bold text-sm">100% Private & Encrypted</span>
          </div>
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#A5D6A7]">
            <span className="block text-[#7A6E7D] font-bold">PIN Security Status</span>
            <span className="text-[#388E3C] font-bold text-sm">
              {user?.hasPasscode ? 'PIN Protection Active' : 'No PIN Configured'}
            </span>
          </div>
        </div>
      </div>

      {/* PIN Setup Form */}
      <div className="bg-white border-3 border-[#FFE4E8] rounded-3xl p-8 space-y-6 shadow-scrapbook">
        <div className="flex items-center space-x-3 text-xl font-display font-bold text-[#332C35]">
          <Shield className="w-6 h-6 text-[#FF80AB]" />
          <span>Diary Security & PIN Code Setup</span>
        </div>

        <p className="text-sm font-sans text-[#5C5260] leading-relaxed">
          Create a 4-digit PIN passcode to protect your diary. The PIN is hashed securely on the server with bcrypt so only you can unlock your memories.
        </p>

        {msg && (
          <div className="p-4 rounded-2xl bg-[#E8F5E9] border-2 border-[#A5D6A7] text-[#2E7D32] text-xs font-display font-bold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-display font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSavePasscode} className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold">
              New 4-Digit PIN
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-[#FFF5F5] border-3 border-[#FFE4E8] rounded-2xl px-4 py-3.5 text-center text-2xl tracking-widest font-display font-bold text-[#332C35] focus:outline-none focus:border-[#FF80AB]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold">
              Confirm 4-Digit PIN
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
              className="w-full bg-[#FFF5F5] border-3 border-[#FFE4E8] rounded-2xl px-4 py-3.5 text-center text-2xl tracking-widest font-display font-bold text-[#332C35] focus:outline-none focus:border-[#FF80AB]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF80AB] to-[#FFB6C1] text-white text-xs font-display font-bold hover:shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving PIN...' : 'Save Hashed PIN'}
            </button>

            {user?.hasPasscode && (
              <>
                <button
                  type="button"
                  onClick={lockDiary}
                  className="px-5 py-3 rounded-full bg-[#FFF0F3] border-2 border-[#FFB6C1] text-[#FF80AB] text-xs font-display font-bold hover:bg-[#FFE4E8] flex items-center space-x-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePasscode}
                  className="px-4 py-3 rounded-full text-rose-500 hover:bg-rose-50 text-xs font-display font-bold transition-colors"
                >
                  Remove PIN
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
