import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  PlusCircle,
  Heart,
  User,
  Lock,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useMemoryStore } from '../store/useMemoryStore.js';
import { MemoryDetailModal } from '../components/MemoryDetailModal.js';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, lockDiary } = useAuthStore();
  const { activeMemoryModal, setActiveMemoryModal } = useMemoryStore();

  const navItems = [
    { label: 'My World', path: '/my-world', icon: Compass },
    { label: 'My Memories', path: '/my-memories', icon: BookOpen },
    { label: 'I want to remember this.', path: '/remember-this', icon: PlusCircle },
    { label: 'How I felt.', path: '/how-i-felt', icon: Heart },
    { label: 'About Me.', path: '/about-me', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#FDF8F5] text-[#332C35] overflow-hidden">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-72 border-r-2 border-[#FFE4E8] bg-white flex flex-col justify-between p-6 shrink-0 hidden md:flex shadow-sm">
        <div className="space-y-8">
          {/* Brand Header */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer space-y-1 group"
          >
            <div className="flex items-center space-x-2">
              <span className="font-display text-3xl font-bold text-[#332C35] group-hover:text-[#FF80AB] transition-colors">
                MYSELF
              </span>
              <Sparkles className="w-5 h-5 text-[#FF80AB] group-hover:rotate-12 transition-transform" />
            </div>
            <p className="font-handwriting text-xl text-[#FF80AB]">
              Everything I was. Everything I felt.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-display text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#FFF0F3] text-[#FF80AB] border-2 border-[#FFB6C1] shadow-xs translate-x-1'
                        : 'text-[#7A6E7D] hover:text-[#332C35] hover:bg-[#FFF5F5]'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions & Identity */}
        <div className="space-y-4 border-t-2 border-[#FFE4E8] pt-6">
          {user && (
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#FFF0F3] border-2 border-[#FFB6C1] flex items-center justify-center text-[#FF80AB] font-display font-bold text-base shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="text-xs text-[#7A6E7D] block font-display">Manuscript Author</span>
                <span className="text-sm font-bold text-[#332C35] truncate block font-display">
                  {user.name}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-xs font-display text-[#7A6E7D]">
            <button
              onClick={lockDiary}
              className="flex items-center space-x-1.5 hover:text-[#FF80AB] transition-colors"
              title="Lock Diary"
            >
              <Lock className="w-4 h-4" />
              <span>Lock Diary</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 hover:text-rose-500 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Experience Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Mobile Header Navigation */}
        <div className="md:hidden flex items-center justify-between p-4 border-b-2 border-[#FFE4E8] bg-white">
          <div onClick={() => navigate('/')} className="font-display text-2xl font-bold text-[#332C35] flex items-center space-x-1">
            <span>MYSELF</span>
            <span className="text-[#FF80AB]">✨</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/remember-this')}
              className="px-4 py-2 bg-[#FF80AB] rounded-full text-xs font-display font-bold text-white shadow-xs"
            >
              + Remember
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full pb-24 md:pb-10">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#FFE4E8] flex items-center justify-around p-3 z-40 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 p-2 rounded-xl transition-colors ${
                    isActive ? 'text-[#FF80AB]' : 'text-[#7A6E7D]'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-display font-medium">{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </main>

      {/* Global Memory Detail Inspection Modal */}
      <MemoryDetailModal
        memory={activeMemoryModal}
        onClose={() => setActiveMemoryModal(null)}
      />
    </div>
  );
};
