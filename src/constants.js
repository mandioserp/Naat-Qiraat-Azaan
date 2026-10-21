export const CLASSES = [
  'Class Two',
  'Class Three',
  'Class Four',
  'Class Five',
  'Class Six',
  'Class Seven',
  'Class Eight',
  'Class Nine',
  'Class Ten',
];

export const HOUSES = {
  Jinnah: {
    name: 'Jinnah',
    urduName: 'جناح ہاؤس',
    motto: 'Unity, Faith, Discipline',
    colorName: 'Emerald Green',
    primaryColor: '#047857',
    description: 'Named in honor of Quaid-e-Azam Muhammad Ali Jinnah',
  },
  Fatima: {
    name: 'Fatima',
    urduName: 'فاطمہ ہاؤس',
    motto: 'Grace, Courage, Devotion',
    colorName: 'Royal Rose',
    primaryColor: '#831843',
    description: 'Named in honor of Madar-e-Millat Mohtarma Fatima Jinnah',
  },
  'Sir Syed': {
    name: 'Sir Syed',
    urduName: 'سر سید ہاؤس',
    motto: 'Enlightenment & Truth',
    colorName: 'Royal Amber',
    primaryColor: '#b45309',
    description: 'Named in honor of great educational reformer Sir Syed Ahmed Khan',
  },
  Ayesha: {
    name: 'Ayesha',
    urduName: 'عائشہ ہاؤس',
    motto: 'Knowledge, Wisdom, Eloquence',
    colorName: 'Teal & Sapphire',
    primaryColor: '#0f766e',
    description: 'Named in honor of Umm al-Mu’minin Hazrat Ayesha (R.A.)',
  },
  Iqbal: {
    name: 'Iqbal',
    urduName: 'اقبال ہاؤس',
    motto: 'Vision, Selfhood, Passion',
    colorName: 'Indigo & Navy',
    primaryColor: '#1e3a8a',
    description: 'Named in honor of Mufakkir-e-Pakistan Allama Muhammad Iqbal',
  },
  Khadijah: {
    name: 'Khadijah',
    urduName: 'خدیجہ ہاؤس',
    motto: 'Integrity, Generosity, Faith',
    colorName: 'Royal Ruby & Crimson',
    primaryColor: '#9f1239',
    description: 'Named in honor of Umm al-Mu’minin Hazrat Khadijah-tul-Kubra (R.A.)',
  },
};

export const ALL_HOUSES = ['Jinnah', 'Fatima', 'Sir Syed', 'Ayesha', 'Iqbal', 'Khadijah'];

export const EVENTS = {
  Naat: {
    name: 'Naat',
    title: 'Naat Khawani (نعت خوانی)',
    arabicTitle: 'نعتِ رسولِ مقبول ﷺ',
    description: 'Heartfelt poetic eulogy and praise dedicated to Prophet Muhammad ﷺ',
    rules: [
      'Authentic Kalam with verified Islamic references.',
      'Solo performance only without musical instruments.',
      'Pronunciation, Tajweed, melody, and expressive devotion will be evaluated.',
      'Time duration: 3 to 4 minutes.',
    ],
    maxDuration: '3 - 4 Minutes',
    iconName: 'HeartHandshake',
  },
  Qiraat: {
    name: 'Qiraat',
    title: 'Husn-e-Qiraat (حسنِ قرآت)',
    arabicTitle: 'تِلَاوَةُ الْقُرْآنِ الْكَرِيم',
    description: 'Melodious and accurate recitation of the Holy Quran with Tajweed rules',
    rules: [
      'Recitation of designated Surah or selected verses.',
      'Adherence to strict rules of Tajweed and Makharij (articulation points).',
      'Tone modulation, rhythm, and clarity will be evaluated.',
      'Time duration: 2 to 3 minutes.',
    ],
    maxDuration: '2 - 3 Minutes',
    iconName: 'BookOpen',
  },
  Azan: {
    name: 'Azan',
    title: 'Husn-e-Azan (حسنِ اذان)',
    arabicTitle: 'الأَذَانُ الشَّرِيف',
    description: 'Elevated and inspiring delivery of the sacred Islamic Call to Prayer',
    rules: [
      'Standard wording of the Islamic Azan (Fajr/regular format).',
      'Correct vocal resonance, breath control, and pronunciation of Arabic phonetics.',
      'Voice clarity, majesty, and pitch control will be evaluated.',
      'Time duration: 2 to 3 minutes.',
    ],
    maxDuration: '2 - 3 Minutes',
    iconName: 'Volume2',
  },
};
