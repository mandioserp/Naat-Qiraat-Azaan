import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  HeartHandshake,
  Volume2,
  User,
  GraduationCap,
  Home,
  Tag,
  Sparkles,
  Check,
  PlusCircle,
  Calendar,
} from 'lucide-react';
import {
  CLASSES,
  ALL_HOUSES,
} from '../constants';
import { submitRegistration, checkExistingRegistration, getStudentRegistrations } from '../lib/firebase';

export function RegistrationForm({ onSuccess }) {
  // Form State
  const [admNo, setAdmNo] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [event, setEvent] = useState('');
  const [house, setHouse] = useState('');

  // UI & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAdm, setIsCheckingAdm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [existingRegistrations, setExistingRegistrations] = useState([]);
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Check existing registrations whenever Admission Number changes
  const checkAdmNumber = useCallback(async (val) => {
    const clean = val.trim().toUpperCase();
    if (clean.length < 2) {
      setExistingRegistrations([]);
      return;
    }

    setIsCheckingAdm(true);
    try {
      const records = await getStudentRegistrations(clean);
      setExistingRegistrations(records);

      // Auto-fill student profile details if found in previous registrations
      if (records.length > 0) {
        const profile = records[0];
        setName((prev) => (prev ? prev : profile.name));
        setGender((prev) => (prev ? prev : profile.gender || ''));
        setStudentClass((prev) => (prev ? prev : profile.studentClass));
        setHouse((prev) => (prev ? prev : profile.house));
      }
    } catch (e) {
      console.warn('Error checking admission no:', e);
    } finally {
      setIsCheckingAdm(false);
    }
  }, []);

  // Debounce admission number lookup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (admNo.trim()) {
        checkAdmNumber(admNo);
      } else {
        setExistingRegistrations([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [admNo, checkAdmNumber]);

  const alreadyRegisteredEvents = existingRegistrations.map((r) => r.event);
  const allEvents = ['Naat', 'Qiraat', 'Azan'];
  const availableEvents = allEvents.filter((e) => !alreadyRegisteredEvents.includes(e));

  const handleEventChange = (newEvent) => {
    if (newEvent === 'Azan' && gender === 'Female') {
      setEvent('');
      setErrorMessage('Azan is not available for female students.');
      return;
    }

    setEvent(newEvent);
    setErrorMessage(null);

    // If student already registered for this event, show immediate friendly notification
    if (newEvent && alreadyRegisteredEvents.includes(newEvent)) {
      setErrorMessage(
        `Admission No "${admNo.trim().toUpperCase()}" is already registered for ${newEvent}. You can register this student for ${availableEvents.length > 0 ? availableEvents.join(' or ') : 'no further events'}.`
      );
    }
  };

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    setErrorMessage(null);
    if (newGender === 'Female' && event === 'Azan') {
      setEvent('');
    }
  };

  const handleAdmNoChange = (val) => {
    setAdmNo(val);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanAdmNo = admNo.trim().toUpperCase();
    const cleanName = name.trim();

    if (!cleanAdmNo) {
      setErrorMessage('Please enter student Admission Number (Adm No).');
      return;
    }
    if (!cleanName) {
      setErrorMessage('Please enter the Student Full Name.');
      return;
    }
    if (!gender) {
      setErrorMessage('Please select the Student Gender.');
      return;
    }
    if (!studentClass) {
      setErrorMessage('Please select the Student Class (Class Two to Class Ten).');
      return;
    }
    if (!event) {
      setErrorMessage('Please select the Competition Event (Naat, Qiraat, or Azan).');
      return;
    }
    if (gender === 'Female' && event === 'Azan') {
      setErrorMessage('Azan is not available for female students.');
      return;
    }
    if (!house) {
      setErrorMessage('Please select the Student House.');
      return;
    }

    // Check if ALREADY registered for this SAME event
    if (alreadyRegisteredEvents.includes(event)) {
      setErrorMessage(
        `Student with Admission No "${cleanAdmNo}" has already registered for ${event}. A student can participate in multiple events, but only once per event. Please select a different event (${availableEvents.join(' or ')}).`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Direct Firestore check before saving
      const duplicateRecord = await checkExistingRegistration(cleanAdmNo, event);
      if (duplicateRecord) {
        setIsSubmitting(false);
        setErrorMessage(
          `Student with Admission No. "${cleanAdmNo}" is already registered for ${event} in ${duplicateRecord.house} House.`
        );
        return;
      }

      const newRegistration = {
        admNo: cleanAdmNo,
        name: cleanName,
        gender: gender,
        studentClass: studentClass,
        event: event,
        house: house,
        createdAt: new Date().toISOString(),
      };

      const result = await submitRegistration(newRegistration);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7B1113', '#d4af37', '#ffffff', '#630d0f'],
        });
      } catch {
        // ignore if canvas not supported
      }

      const fullRecord = {
        id: result.id,
        ...newRegistration,
      };

      onSuccess(fullRecord, result.warning);

      // Reset fields
      setAdmNo('');
      setName('');
      setGender('');
      setStudentClass('');
      setEvent('');
      setHouse('');
      setTouched({});
      setExistingRegistrations([]);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Sleek Interface Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row border border-white/10"
      >
        {/* Left Sidebar Info Panel */}
        <div className="w-full lg:w-1/3 bg-[#7B1113] p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl mb-6 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/70 block mb-1">
              Multi-Event Registration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4 uppercase tracking-tighter">
              Inter-House Competition 2026
            </h1>
            <p className="text-white/75 text-sm leading-relaxed font-light">
              Students are welcome to participate in <strong>more than one event</strong> (Naat, Qiraat, and Azan) using the same Admission Number. Duplicate registrations for the same event are restricted.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10 mt-8 relative z-10">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span className="text-white/90 font-medium">Husn-e-Qiraat </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-white/75"></div>
              <span className="text-white/80 font-medium">Naat Khawani</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
              <span className="text-white/70 font-medium">Husn-e-Azan </span>
            </div>
          </div>
        </div>

        {/* Right Main Registration Form Panel */}
        <div className="w-full lg:w-2/3 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-[#7B1113] text-2xl sm:text-3xl font-bold tracking-tight">Student Registration</h2>
            <div className="h-1 w-12 bg-[#7B1113] mt-2"></div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Enter student details. A student can register for multiple different events under the same admission number.
            </p>
            {/* Note Line */}
          
          </div>

          {/* Existing Registrations Info Banner for this student */}
          <AnimatePresence>
            {existingRegistrations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-50/80 border border-emerald-200 p-4 mb-6 rounded-2xl space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900">
                      Existing Student Profile Recognized: {existingRegistrations[0].name}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {existingRegistrations.length} Event{existingRegistrations.length > 1 ? 's' : ''} Enrolled
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-gray-500 text-[11px]">Current Status:</span>
                  {allEvents.map((evt) => {
                    const isEnrolled = alreadyRegisteredEvents.includes(evt);
                    return (
                      <span
                        key={evt}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          isEnrolled
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-gray-700 border border-gray-200 shadow-2xs'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{evt} (Enrolled)</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3 h-3 text-[#7B1113]" />
                            <span>{evt} (Available)</span>
                          </>
                        )}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Alert Box */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border-l-4 border-[#7B1113] p-4 mb-6 rounded-r-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-[#7B1113] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-red-900">Event Selection Notice</h4>
                  <p className="text-xs sm:text-sm text-red-700 mt-0.5">{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Admission No, Full Name & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {/* Adm No */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admNo"
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#7B1113]" />
                    <span>Admission No</span>
                    <span className="text-[#7B1113]">*</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">e.g. 2024-001</span>
                </label>
                <div className="relative">
                  <input
                    id="admNo"
                    type="text"
                    required
                    placeholder="e.g. 2024-001"
                    value={admNo}
                    onChange={(e) => handleAdmNoChange(e.target.value)}
                    onBlur={() => handleBlur('admNo')}
                    maxLength={30}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors text-gray-800 text-sm font-medium uppercase placeholder:normal-case placeholder:text-gray-400 ${
                      touched.admNo && !admNo.trim()
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#7B1113] focus:bg-white'
                    }`}
                  />
                  {isCheckingAdm ? (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    admNo.trim().length > 0 && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7B1113]">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )
                  )}
                </div>
                {touched.admNo && !admNo.trim() && (
                  <p className="text-[11px] text-red-600 font-medium">Admission number is required.</p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#7B1113]" />
                    <span>Full Name</span>
                    <span className="text-[#7B1113]">*</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">Student Name</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur('name')}
                    maxLength={100}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors text-gray-800 text-sm font-medium placeholder:text-gray-400 ${
                      touched.name && !name.trim()
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#7B1113] focus:bg-white'
                    }`}
                  />
                  {name.trim().length >= 2 && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7B1113]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {touched.name && !name.trim() && (
                  <p className="text-[11px] text-red-600 font-medium">Student full name is required.</p>
                )}
              </div>

              {/* Gender Select Box */}
              <div className="space-y-1.5">
                <label
                  htmlFor="gender"
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#7B1113]" />
                  <span>Gender</span>
                  <span className="text-[#7B1113]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    required
                    value={gender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                    onBlur={() => handleBlur('gender')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors text-gray-800 text-sm font-medium appearance-none cursor-pointer ${
                      touched.gender && !gender
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#7B1113] focus:bg-white'
                    }`}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Select Class, House, Event */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {/* Class Select Box */}
              <div className="space-y-1.5">
                <label
                  htmlFor="studentClass"
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#7B1113]" />
                  <span>Class</span>
                  <span className="text-[#7B1113]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="studentClass"
                    required
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    onBlur={() => handleBlur('studentClass')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors text-gray-800 text-sm font-medium appearance-none cursor-pointer ${
                      touched.studentClass && !studentClass
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#7B1113] focus:bg-white'
                    }`}
                  >
                    <option value="" disabled>Select Class</option>
                    {CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* House Select Box (Jinnah, Fatima, Sir Syed, Ayesha, Iqbal, Khadijah) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="house"
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5 text-[#7B1113]" />
                  <span>Select House</span>
                  <span className="text-[#7B1113]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="house"
                    required
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    onBlur={() => handleBlur('house')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors text-gray-800 text-sm font-medium appearance-none cursor-pointer ${
                      touched.house && !house
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#7B1113] focus:bg-white'
                    }`}
                  >
                    <option value="" disabled>Select House</option>
                    <option value="Jinnah">Jinnah House</option>
                    <option value="Fatima">Fatima House </option>
                    <option value="Sir Syed">Sir Syed House</option>
                    <option value="Ayesha">Ayesha House </option>
                    <option value="Iqbal">Iqbal House </option>
                    <option value="Khadijah">Khadijah House </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Event Select Box */}
              <div className="space-y-1.5">
                <label
                  htmlFor="event"
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#7B1113]" />
                  <span>Select Event</span>
                  <span className="text-[#7B1113]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="event"
                    required
                    value={event}
                    onChange={(e) => handleEventChange(e.target.value)}
                    onBlur={() => handleBlur('event')}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors text-gray-800 text-sm font-medium appearance-none cursor-pointer ${
                      touched.event && !event
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#7B1113] focus:bg-white'
                    }`}
                  >
                    <option value="" disabled>Select Event</option>
                    <option
                      value="Naat"
                      disabled={alreadyRegisteredEvents.includes('Naat')}
                    >
                      Naat (نعت خوانی) {alreadyRegisteredEvents.includes('Naat') ? '— [Already Enrolled]' : ''}
                    </option>
                    <option
                      value="Qiraat"
                      disabled={alreadyRegisteredEvents.includes('Qiraat')}
                    >
                      Qiraat (حسنِ قرآت) {alreadyRegisteredEvents.includes('Qiraat') ? '— [Already Enrolled]' : ''}
                    </option>
                    <option
                      value="Azan"
                      disabled={gender === 'Female' || alreadyRegisteredEvents.includes('Azan')}
                    >
                      Azan (حسنِ اذان) {gender === 'Female' ? '— [Not Available]' : alreadyRegisteredEvents.includes('Azan') ? '— [Already Enrolled]' : ''}
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-Select Badges for All 6 Houses */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Quick House Selection:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {ALL_HOUSES.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHouse(h)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        house === h
                          ? 'bg-[#7B1113] text-white border-[#7B1113] shadow-sm'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Event Selection with Enrolled Status */}
              <div className="grid grid-cols-3 gap-2.5">
                {allEvents.map((evtKey) => {
                  const isEnrolled = alreadyRegisteredEvents.includes(evtKey);
                  return (
                    <button
                      key={evtKey}
                      type="button"
                      onClick={() => handleEventChange(evtKey)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                        event === evtKey
                          ? 'bg-[#7B1113] text-white border-[#7B1113] shadow-sm'
                          : isEnrolled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {evtKey === 'Naat' && <HeartHandshake className="w-3.5 h-3.5" />}
                        {evtKey === 'Qiraat' && <BookOpen className="w-3.5 h-3.5" />}
                        {evtKey === 'Azan' && <Volume2 className="w-3.5 h-3.5" />}
                        <span>{evtKey}</span>
                      </div>
                      {isEnrolled && (
                        <span className={`text-[10px] font-normal px-1.5 py-0.2 rounded-full ${
                          event === evtKey ? 'bg-white/20 text-white' : 'bg-emerald-200/80 text-emerald-900'
                        }`}>
                          Enrolled
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4">
              <button
                id="submit-registration-btn"
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#7B1113] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#630d0f] transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {existingRegistrations.length > 0
                        ? `Register for ${event ? event : 'Additional Event'}`
                        : 'Submit Registration'}
                    </span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Official Inter-House Competition Portal • Student can register for more than one event.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
