import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

export const AuthPage: React.FC = () => {
  const { login, unlockDiary, setupPasscode, user, isAuthenticated, isUnlocked } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // PIN states
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Predefined Login ID + Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter your Login ID and Password.');
        setIsLoading(false);
        return;
      }
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please check your Login ID and Password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2A: PIN Setup (First time)
  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pin || !/^\d{4}$/.test(pin)) {
      setErrorMsg('PIN passcode must be exactly 4 digits.');
      return;
    }

    if (pin !== confirmPin) {
      setErrorMsg('PIN passcodes do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await setupPasscode(pin, confirmPin);
      await unlockDiary(pin);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save PIN passcode.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2B: PIN Unlock (Future access)
  const handleUnlockPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!pin || pin.length !== 4) {
      setErrorMsg('Please enter your 4-digit PIN passcode.');
      return;
    }

    setIsLoading(true);
    try {
      await unlockDiary(pin);
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect PIN passcode. Please try again.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  // Case 2: Authenticated via JWT Token, but PIN Layer is active
  if (isAuthenticated && user) {
    // 2A: First Time - Setup PIN
    if (!user.hasPasscode) {
      return (
        <div className="fixed inset-0 z-50 bg-[#FDF8F5] flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white border-4 border-[#FFE4E8] rounded-3xl p-8 space-y-6 shadow-2xl"
          >
            <div className="w-14 h-14 rounded-full bg-[#FFF0F3] text-[#FF80AB] border-2 border-[#FFB6C1] mx-auto flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="font-display text-3xl font-bold text-[#332C35]">Set Your Private PIN</h2>
              <p className="font-handwriting text-2xl text-[#FF80AB]">Create a 4-digit PIN lock for your diary ✨</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-display font-bold flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSetupPin} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold block">
                  New 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-[#FFF5F5] border-3 border-[#FFE4E8] rounded-2xl p-4 text-center text-3xl font-display font-bold tracking-widest text-[#332C35] focus:outline-none focus:border-[#FF80AB]"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold block">
                  Confirm 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full bg-[#FFF5F5] border-3 border-[#FFE4E8] rounded-2xl p-4 text-center text-3xl font-display font-bold tracking-widest text-[#332C35] focus:outline-none focus:border-[#FF80AB]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF80AB] to-[#FFB6C1] text-white font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-base disabled:opacity-50"
              >
                <span>{isLoading ? 'Saving PIN...' : 'Save PIN & Enter Diary ✨'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      );
    }

    // 2B: Returning Access - Unlock PIN
    if (!isUnlocked) {
      return (
        <div className="fixed inset-0 z-50 bg-[#FDF8F5] flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white border-4 border-[#FFE4E8] rounded-3xl p-8 space-y-6 shadow-2xl"
          >
            <div className="w-14 h-14 rounded-full bg-[#FFF0F3] text-[#FF80AB] border-2 border-[#FFB6C1] mx-auto flex items-center justify-center shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="font-display text-3xl font-bold text-[#332C35]">Diary Locked</h2>
              <p className="font-handwriting text-2xl text-[#FF80AB]">Enter your PIN to open your diary ✨</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-display font-bold flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUnlockPin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#FFF5F5] border-3 border-[#FFE4E8] rounded-2xl p-4 text-center text-3xl font-display font-bold tracking-widest text-[#332C35] focus:outline-none focus:border-[#FF80AB]"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF80AB] to-[#FFB6C1] text-white font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-base disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying PIN...' : 'Open My Diary'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      );
    }
  }

  // Case 1: Predefined Login Screen (Login ID + Password)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] to-[#FDF8F5] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border-4 border-[#FFE4E8] rounded-3xl p-8 space-y-6 shadow-2xl"
      >
        <div className="text-center space-y-1">
          <div className="font-display text-4xl font-bold text-[#332C35] flex items-center justify-center space-x-1">
            <span>MYSELF</span>
            <Sparkles className="w-6 h-6 text-[#FF80AB]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#332C35] pt-1">Welcome back.</h2>
          <p className="font-handwriting text-2xl text-[#FF80AB]">
            "Enter your secret space. Your little world is waiting."
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-display font-bold flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold">Login ID</label>
            <input
              type="text"
              placeholder="owner@myself.private"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FFF5F5] border-2 border-[#FFE4E8] rounded-2xl px-4 py-3.5 text-sm font-display text-[#332C35] focus:outline-none focus:border-[#FF80AB]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#7A6E7D] font-display font-bold">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FFF5F5] border-2 border-[#FFE4E8] rounded-2xl px-4 py-3.5 text-sm font-display text-[#332C35] focus:outline-none focus:border-[#FF80AB]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF80AB] to-[#FFB6C1] text-white font-display font-bold hover:shadow-lg transition-all text-base shadow-md mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Enter Secret Space ✨'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
