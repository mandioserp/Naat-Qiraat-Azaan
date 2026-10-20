import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Sparkles,
  Trophy,
  CheckCircle,
  X,
  BookOpen,
  HeartHandshake,
  Volume2,
  Users,
} from 'lucide-react';

export function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden my-6 border border-gray-100 text-center"
        >
          {/* Top Header Card */}
          <div className="bg-[#7B1113] text-white px-6 pt-8 pb-9 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Close Button */}
            <button
              id="close-welcome-x-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Bismillah Calligraphy */}
            <span className="font-amiri text-lg sm:text-xl text-amber-200/90 block mb-3 font-semibold select-none">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>

            {/* School Crest Logo */}
            <div className="flex justify-center mb-4">
              <div 
                style={{
                  height: '120px',
                  width: '120px',
                }}
                className="rounded-full bg-white p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.35)] border-2 border-white/80 ring-4 ring-white/15 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcvGWlEouGbxRWFJ0O2Gh0AwZDi6YElkMi6h_3jjgOtA&s=10"
                  alt="KPS Rachna Town Logo"
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Portal Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Official Student Portal</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>

            {/* Main Welcome Headline */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug max-w-md mx-auto">
              Welcome to Official KPS Rachna Town Registration Portal
            </h2>

            <p className="text-xs text-white/80 max-w-sm mx-auto mt-2 font-light">
              Annual Inter-House Naat, Qiraat & Azan Championship 2026
            </p>
          </div>

          {/* Body Content Details */}
          <div className="p-6 sm:p-8 space-y-4 bg-white -mt-4 rounded-t-[28px] relative z-10 text-left">
            {/* Highlighted Registration Dates Box */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/90 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-5 h-5 text-amber-800" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-extrabold text-gray-900">
                  Registration is open from <span className="text-[#7B1113]">21 October</span> to{' '}
                  <span className="text-[#7B1113]">26 October</span>
                </p>
                <p className="text-xs text-gray-600">
                  Open for Classes 2 to 10 across all 6 houses.
                </p>
              </div>
            </div>

            {/* Event & House Highlights */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <HeartHandshake className="w-4 h-4 text-[#7B1113] mx-auto" />
                <span className="font-bold text-gray-900 block">Naat</span>
                <span className="text-[10px] text-gray-500 font-amiri font-bold">نعت خوانی</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <BookOpen className="w-4 h-4 text-[#7B1113] mx-auto" />
                <span className="font-bold text-gray-900 block">Qiraat</span>
                <span className="text-[10px] text-gray-500 font-amiri font-bold">حسنِ قرآت</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <Volume2 className="w-4 h-4 text-[#7B1113] mx-auto" />
                <span className="font-bold text-gray-900 block">Azan</span>
                <span className="text-[10px] text-gray-500 font-amiri font-bold">حسنِ اذان</span>
              </div>
            </div>

            {/* Notice on Multi-Event enrollment */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Students who are willing to participate are requested to register through the Registration Portal.
              </span>
            </div>

            {/* Prominent OK Button */}
            <div className="pt-2">
              <button
                id="welcome-ok-btn"
                type="button"
                onClick={onClose}
                className="w-full py-4 px-6 rounded-2xl bg-[#7B1113] hover:bg-[#630d0f] text-white font-bold text-base shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Let's Register</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
