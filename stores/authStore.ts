import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  setUser: (u: FirebaseUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogleToken: (idToken?: string, accessToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  initListener: () => () => void;
}

function firebaseUserToUser(u: FirebaseUser): User {
  return {
    id: u.uid,
    name: u.displayName ?? u.email?.split('@')[0] ?? 'Rider',
    email: u.email ?? '',
  };
}

function friendlyError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

async function writeUserDoc(u: FirebaseUser, name?: string) {
  const ref = doc(db, 'users', u.uid);
  await setDoc(
    ref,
    {
      name: name ?? u.displayName ?? '',
      email: u.email ?? '',
      createdAt: serverTimestamp(),
      ridingStyle: '',
      skillLevel: 'beginner',
    },
    { merge: true },
  );
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setUser: (fbUser) => {
    if (fbUser) {
      set({ user: firebaseUserToUser(fbUser), isLoggedIn: true, isLoading: false, error: null });
    } else {
      set({ user: null, isLoggedIn: false, isLoading: false, error: null });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      set({ isLoading: false, error: friendlyError(e.code) });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await writeUserDoc(cred.user, name);
    } catch (e: any) {
      set({ isLoading: false, error: friendlyError(e.code) });
    }
  },

  signInWithGoogleToken: async (idToken, accessToken) => {
    set({ isLoading: true, error: null });
    try {
      const credential = GoogleAuthProvider.credential(
        idToken ?? null,
        accessToken ?? null,
      );
      const cred = await signInWithCredential(auth, credential);
      await writeUserDoc(cred.user, cred.user.displayName ?? undefined);
    } catch (e: any) {
      set({ isLoading: false, error: friendlyError(e.code) });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut(auth);
    } catch (e: any) {
      set({ isLoading: false, error: friendlyError(e.code) });
    }
  },

  initListener: () => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      get().setUser(fbUser);
    });
    return unsub;
  },
}));
