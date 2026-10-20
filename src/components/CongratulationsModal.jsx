import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Trophy,
  Sparkles,
  HeartHandshake,
  BookOpen,
  Volume2,
  User,
  GraduationCap,
  Home,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { HOUSES, EVENTS } from '../constants';

const SCHOOL_LOGO =
  "data:image/png;base64,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";

export function CongratulationsModal({
  registration,
  onClose,
  onViewRoster,
}) {
  if (!registration) return null;

  const houseInfo = HOUSES[registration.house] || {
    name: registration.house,
    urduName: '',
    motto: '',
    colorName: '',
    primaryColor: '#7B1113',
    description: '',
  };

  const eventInfo = EVENTS[registration.event] || {
    name: registration.event,
    title: registration.event,
    arabicTitle: '',
    description: '',
    rules: [],
    maxDuration: '3 Minutes',
    iconName: 'HeartHandshake',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden my-6 border border-gray-100"
        >
          {/* Top Decorative Banner */}
          <div className="bg-[#7B1113] text-white px-6 pt-8 pb-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Close Button */}
            <button
              id="close-congrats-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* School Logo */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-white p-1 shadow-lg ring-4 ring-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src={SCHOOL_LOGO}
                  alt="School Crest Logo"
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Arabic Mubarak Greeting */}
            <span className="font-amiri text-2xl text-amber-200 font-bold block mb-1">
              مَبْرُوكٌ عَلَيْكُمْ!
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Registration Successful</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Congratulations, {registration.name.split(' ')[0]}!
            </h3>
            <p className="text-xs text-white/80 max-w-sm mx-auto mt-1">
              Your entry for the Annual Inter-House Competition has been successfully registered.
            </p>
          </div>

          {/* Body Content Details */}
          <div className="p-6 sm:p-8 space-y-5 bg-white -mt-4 rounded-t-[28px] relative z-10">
            {/* Student Information Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Full Name */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#7B1113]" /> Student Name
                  </span>
                  <p className="font-bold text-gray-900 text-sm truncate">{registration.name}</p>
                </div>

                {/* Admission No */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#7B1113]" /> Admission No
                  </span>
                  <p className="font-mono font-bold text-[#7B1113] text-sm">{registration.admNo}</p>
                </div>

                {/* Class */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-[#7B1113]" /> Class
                  </span>
                  <p className="font-semibold text-gray-800">{registration.studentClass}</p>
                </div>

                {/* House */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <Home className="w-3 h-3 text-[#7B1113]" /> House
                  </span>
                  <p className="font-semibold text-gray-800">
                    {registration.house} House <span className="font-amiri text-xs text-gray-500 font-bold">({houseInfo.urduName})</span>
                  </p>
                </div>
              </div>

              {/* Event Badge Highlight */}
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7B1113] text-white flex items-center justify-center flex-shrink-0">
                    {registration.event === 'Naat' && <HeartHandshake className="w-4 h-4" />}
                    {registration.event === 'Qiraat' && <BookOpen className="w-4 h-4" />}
                    {registration.event === 'Azan' && <Volume2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block leading-none">
                      Selected Event
                    </span>
                    <span className="font-bold text-sm text-gray-900">
                      {eventInfo.title}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enrolled</span>
                </div>
              </div>
            </div>

            {/* Motivational Dua & Blessings Note */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center space-y-1">
              <span className="font-amiri text-base font-bold text-amber-900 block">
                مَا شَاءَ ٱللَّٰهُ تَبَارَكَ ٱللَّٰهُ
              </span>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Best wishes for your preparation and participation in {registration.house} House!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-[#7B1113] hover:bg-[#630d0f] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Register Another Student</span>
              </button>

              {onViewRoster && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewRoster();
                  }}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Roster</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
