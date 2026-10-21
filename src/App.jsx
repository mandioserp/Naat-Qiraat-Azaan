/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationsList } from './components/RegistrationsList';
import { CongratulationsModal } from './components/CongratulationsModal';
import { WelcomeModal } from './components/WelcomeModal';
import {
  testConnection,
  subscribeToRegistrations,
  getRegistrations,
} from './lib/firebase';
import {
  Trophy,
  AlertTriangle,
  X,
  Copy,
  Check,
  Calendar,
  Clock,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedRegistration, setCompletedRegistration] = useState(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [permissionNotice, setPermissionNotice] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const recommendedRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  // Initialize Firebase connection test and real-time subscription
  useEffect(() => {
    let unsubscribe;

    const initFirebase = async () => {
      await testConnection();

      // Subscribe to real-time updates with graceful fallback
      try {
        unsubscribe = subscribeToRegistrations(
          (items, isLive) => {
            setRegistrations(items);
            setIsLoading(false);
            if (isLive) {
              setPermissionNotice(false);
            }
          },
          () => {
            // Permission notice callback
            setPermissionNotice(true);
            setIsLoading(false);
          }
        );
      } catch (err) {
        console.warn('Realtime listener fallback to getDocs:', err);
        getRegistrations()
          .then((res) => {
            setRegistrations(res.items);
            if (res.permissionError) setPermissionNotice(true);
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      }
    };

    initFirebase();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await getRegistrations();
      setRegistrations(res.items);
      if (res.permissionError) {
        setPermissionNotice(true);
      } else {
        setPermissionNotice(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSuccess = (newReg) => {
    setCompletedRegistration(newReg);
    setRegistrations((prev) => {
      const exists = prev.some((r) => r.id === newReg.id);
      return exists ? prev : [newReg, ...prev];
    });
  };

  const handleCopyRules = () => {
    navigator.clipboard.writeText(recommendedRulesText);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#7B1113] text-gray-900 flex flex-col font-sans selection:bg-white selection:text-[#7B1113]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalRegistrationsCount={registrations.length}
      />

      {/* Optional Firestore Rules Helper Banner */}
      {permissionNotice && !bannerDismissed && (
        <div className="bg-amber-500/15 border-b border-amber-400/30 text-white px-4 py-3 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-start sm:items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="space-y-0.5">
                <span className="font-bold text-amber-200">
                  Firebase Firestore Database Notice for kpsschool-5da8c:
                </span>
                <span className="text-white/90 ml-1">
                  Local storage is active and functioning smoothly. To allow direct read/write in your Firebase Console, enable Firestore Rules in <strong>kpsschool-5da8c</strong>.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleCopyRules}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold flex items-center gap-1 transition-colors"
                title="Copy standard Firestore rules to paste in Firebase Console"
              >
                {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRules ? 'Copied!' : 'Copy Rule'}</span>
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-1 text-white/70 hover:text-white"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'register' && (
            <motion.div
              key="register-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Event Announcement Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/15 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                    
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Inter-House Naat, Qiraat & Azan Competition
                    </h2>
                    <p className="text-xs sm:text-sm text-white/75">
                      Open to all students from Class Two to 10 across Jinnah, Fatima, Sir Syed, Ayesha, Iqbal, and Khadijah Houses.
                    </p>
                  </div>

                  {/* Important Registration Date Note Badge */}
                  <div className="w-full sm:w-auto bg-amber-400/20 border border-amber-300/40 rounded-2xl p-3.5 sm:px-4 sm:py-3 flex items-center gap-3 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/30 text-amber-200 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest block">
                        Important Note
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                        Registration is open from <span className="text-amber-200 underline decoration-amber-300/60 font-black">21 October to 26 October</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Registration Form (Sleek Theme Card) */}
              <RegistrationForm onSuccess={handleRegistrationSuccess} />

              {/* Quick Info Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-white">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                    6 Participating Houses
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                    Jinnah • Fatima • Sir Syed • Ayesha • Iqbal • Khadijah
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                    Eligibility
                  </span>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    Class Two Class Ten
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                    Events
                  </span>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    Naat • Qiraat • Azan
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'list' && (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <RegistrationsList
                registrations={registrations}
                isLoading={isLoading}
                onSelectRegistration={(reg) => setCompletedRegistration(reg)}
                onRefresh={handleRefresh}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Congratulations Modal */}
      {completedRegistration && (
        <CongratulationsModal
          registration={completedRegistration}
          onClose={() => setCompletedRegistration(null)}
          onViewRoster={() => setActiveTab('list')}
        />
      )}

      {/* Initial Welcome Dialogue Box */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
      />

      {/* Sleek Footer */}
      <footer className="mt-auto bg-[#630d0f] text-white/80 border-t border-white/10 py-6 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto space-y-1.5">
          <p className="font-amiri text-base text-white">
            رَبِّ زِدْنِي عِلْمًا
          </p>
          <p className="font-semibold text-1.5xl text-white">
            Designed and Developed by Raheel Abbas
          </p>
        </div>
      </footer>
    </div>
  );
}
