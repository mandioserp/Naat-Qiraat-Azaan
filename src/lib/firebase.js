import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Local storage backup key
const LOCAL_STORAGE_KEY = 'kps_interhouse_registrations_cache';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (support default database and custom database IDs)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

// Local Storage Fallback helpers
function getLocalRegistrations() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalRegistration(item) {
  try {
    const current = getLocalRegistrations();
    const exists = current.some(
      (r) =>
        r.id === item.id ||
        (r.admNo.trim().toUpperCase() === item.admNo.trim().toUpperCase() && r.event === item.event)
    );
    if (!exists) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([item, ...current]));
    }
  } catch (e) {
    console.error('Failed to save to local cache:', e);
  }
}

export function handleFirestoreError(error, operationType, path) {
  const message = error instanceof Error ? error.message : String(error);
  const errInfo = {
    error: message,
    operationType,
    path,
    timestamp: new Date().toISOString(),
  };
  console.warn(`Firestore [${operationType}] on ${path}:`, message);
  return errInfo;
}

// Connection test on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    // Non-blocking connection check
    return false;
  }
}

// Submit a new registration with Firestore & Local cache fallback
export async function submitRegistration(registrationData) {
  const path = 'registrations';
  const cleanData = {
    admNo: registrationData.admNo.trim().toUpperCase(),
    name: registrationData.name.trim(),
    gender: registrationData.gender,
    studentClass: registrationData.studentClass,
    event: registrationData.event,
    house: registrationData.house,
    createdAt: registrationData.createdAt || new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, path), cleanData);
    const fullItem = { id: docRef.id, ...cleanData };
    saveLocalRegistration(fullItem);
    return { id: docRef.id, isSyncedToCloud: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    // Fallback: Generate unique local ID and save locally
    const localId = 'REG-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
    const fullItem = { id: localId, ...cleanData };
    saveLocalRegistration(fullItem);

    return {
      id: localId,
      isSyncedToCloud: false,
      warning:
        error?.code === 'permission-denied' || error?.message?.includes('permissions')
          ? 'Saved locally. (Firestore rules for kpsschool-5da8c need read/write permissions enabled).'
          : 'Saved locally to device.',
    };
  }
}

// Fetch all registrations (merges cloud data & local storage)
export async function getRegistrations() {
  const path = 'registrations';
  const localItems = getLocalRegistrations();

  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const cloudItems = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Merge without duplicates based on ID or (admNo + event)
    const cloudKeys = new Set(cloudItems.map((c) => `${c.admNo}_${c.event}`));
    const cloudIds = new Set(cloudItems.map((c) => c.id));
    const merged = [
      ...cloudItems,
      ...localItems.filter((l) => !cloudIds.has(l.id) && !cloudKeys.has(`${l.admNo}_${l.event}`)),
    ];
    return { items: merged, permissionError: false };
  } catch (error) {
    const isPerm = error?.code === 'permission-denied' || error?.message?.includes('permissions');
    handleFirestoreError(error, OperationType.LIST, path);
    return { items: localItems, permissionError: isPerm };
  }
}

// Real-time listener for registrations with graceful fallback
export function subscribeToRegistrations(onUpdate, onPermissionNotice) {
  const path = 'registrations';
  const localItems = getLocalRegistrations();

  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cloudItems = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        const cloudKeys = new Set(cloudItems.map((c) => `${c.admNo}_${c.event}`));
        const cloudIds = new Set(cloudItems.map((c) => c.id));
        const merged = [
          ...cloudItems,
          ...localItems.filter((l) => !cloudIds.has(l.id) && !cloudKeys.has(`${l.admNo}_${l.event}`)),
        ];
        onUpdate(merged, true);
      },
      (error) => {
        console.warn('Firestore subscription notice (using local cache fallback):', error.message);
        if (onPermissionNotice) onPermissionNotice();
        onUpdate(localItems, false);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Firestore snapshot setup notice:', err.message);
    if (onPermissionNotice) onPermissionNotice();
    onUpdate(localItems, false);
    return () => {};
  }
}

// Get all registrations for a student by admission number
export async function getStudentRegistrations(admNo) {
  const cleanAdm = admNo.trim().toUpperCase();
  if (!cleanAdm) return [];

  const localItems = getLocalRegistrations().filter(
    (item) => item.admNo.trim().toUpperCase() === cleanAdm
  );

  try {
    const path = 'registrations';
    const q = query(collection(db, path), where('admNo', '==', cleanAdm));
    const snapshot = await getDocs(q);
    const cloudMatches = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    const cloudIds = new Set(cloudMatches.map((c) => c.id));
    const cloudEvents = new Set(cloudMatches.map((c) => c.event));
    return [
      ...cloudMatches,
      ...localItems.filter((l) => !cloudIds.has(l.id) && !cloudEvents.has(l.event)),
    ];
  } catch (error) {
    return localItems;
  }
}

// Check if an admission number has already registered for a specific event
export async function checkExistingRegistration(admNo, event) {
  const cleanAdm = admNo.trim().toUpperCase();
  if (!cleanAdm || !event) return null;

  const allForStudent = await getStudentRegistrations(cleanAdm);
  return allForStudent.find((r) => r.event.toLowerCase() === event.toLowerCase()) || null;
}
