import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener');
    const auth = getFirebaseAuth();
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('AuthProvider: Auth state changed', { user: user?.email });
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      });
    } catch (err) {
      console.error('AuthProvider: Error setting up auth state listener:', err);
      setError(err instanceof Error ? err : new Error('Authentication error'));
      setLoading(false);
    }

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleAuthError = (error: unknown) => {
    const err = error instanceof Error ? error : new Error('Authentication error');
    console.error('Auth error:', err);
    setError(err);
    throw err;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  console.log('AuthProvider: Rendering', { loading, currentUser: currentUser?.email, error });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
