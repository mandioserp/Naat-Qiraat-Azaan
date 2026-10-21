import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, BookOpen, HeartHandshake, Volume2, FileText, Users } from 'lucide-react';

export function Header({
  activeTab,
  setActiveTab,
  totalRegistrationsCount,
}) {
  return (
    <header className="relative bg-[#7B1113] text-white border-b border-white/10 shadow-lg overflow-hidden">
      {/* Decorative Subtle Grid Accent */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-6 relative z-10">
        {/* Arabic Calligraphy Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-3"
        >
          <span className="font-amiri text-xl sm:text-2xl text-white/90 tracking-widest block select-none">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
            In the Name of Allah, the Most Gracious, the Most Merciful
          </span>
        </motion.div>

        {/* School Logo placed under Bismillah */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="flex justify-center my-3"
        >
          <div className="relative group">
            <div 
              style={{
                height: '200px',
                width: 'auto',
              }}
              className="rounded-full bg-white p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.35)] border-2 border-white/80 ring-4 ring-white/15 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcvGWlEouGbxRWFJ0O2Gh0AwZDi6YElkMi6h_3jjgOtA&s=10"
                alt="School Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>

        {/* Main Title Area */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase"
          >
            NAAT, QIRAAT & AZAN
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-white/75 text-xs sm:text-sm md:text-base max-w-2xl mt-1.5 leading-relaxed font-light"
          >
            Student Registration Portal • Classes 2 to 10 • Jinnah, Fatima, Sir Syed, Ayesha, Iqbal & Khadijah Houses
          </motion.p>

          {/* Three Event Category Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5 text-amber-200" />
              <span>Husn-e-Qiraat</span>
              <span className="text-white/60 font-amiri text-xs">(قرآت)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-200" />
              <span>Naat Khawani</span>
              <span className="text-white/60 font-amiri text-xs">(نعت)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium">
              <Volume2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Husn-e-Azan</span>
              <span className="text-white/60 font-amiri text-xs">(اذان)</span>
            </div>
          </motion.div>
        </div>

        {/* Sleek Navigation Bar */}
        <div className="mt-7 flex items-center justify-center border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <button
              id="tab-register-btn"
              onClick={() => setActiveTab('register')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-white text-[#7B1113] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Registration Form</span>
            </button>

            <button
              id="tab-roster-btn"
              onClick={() => setActiveTab('list')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'list'
                  ? 'bg-white text-[#7B1113] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Participants Roster</span>
              {totalRegistrationsCount > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'list'
                      ? 'bg-[#7B1113] text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {totalRegistrationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
