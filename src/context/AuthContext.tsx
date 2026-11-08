import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  FirebaseUser
} from '../lib/firebase';
import { safeFetchJson } from '../utils/api';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginWithFirebase: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithFirebase: (email: string, pass: string, name: string, accountType?: 'student' | 'client') => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string) => void;
  login: (email: string, role?: 'student' | 'teacher' | 'admin') => void;
  switchRole: (role: 'student' | 'teacher' | 'admin') => void;
}

const defaultStudent: User = {
  id: 'usr-student-01',
  name: 'Alex Rivera',
  email: 'alex.rivera@nexusai.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  enrolledCourses: ['artificial-intelligence', 'web-development'],
};

const AuthContext = createContext<AuthContextType>({
  user: defaultStudent,
  firebaseUser: null,
  loading: false,
  loginWithFirebase: async () => ({ success: false }),
  registerWithFirebase: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  logout: async () => {},
  enrolledCourseIds: ['artificial-intelligence', 'web-development'],
  enrollInCourse: () => {},
  login: () => {},
  switchRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultStudent);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([
    'artificial-intelligence',
    'web-development',
  ]);

  const syncUserProfileWithBackend = async (fbUser: FirebaseUser, nameHint?: string, accountTypeHint?: 'student' | 'client') => {
    const res = await safeFetchJson('/api/auth/sync-profile', {
      method: 'POST',
      body: JSON.stringify({
        uid: fbUser.uid,
        email: fbUser.email,
        name: nameHint || fbUser.displayName || fbUser.email?.split('@')[0],
        accountType: accountTypeHint || 'student'
      })
    });

    if (res.success && res.data?.profile) {
      const p = res.data.profile;
      const appUser: User = {
        id: p.id,
        name: p.name,
        email: p.email,
        role: p.role === 'Instructor' ? 'teacher' : p.role === 'Admin' || p.role === 'Owner' ? 'admin' : 'student',
        avatar: p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        enrolledCourses: enrolledCourseIds
      };
      setUser(appUser);
      localStorage.setItem('nexus_user', JSON.stringify(appUser));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setFirebaseUser(currUser);
      if (currUser) {
        await syncUserProfileWithBackend(currUser);
      } else {
        const saved = localStorage.getItem('nexus_user');
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch (e) {
            setUser(defaultStudent);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithFirebase = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await syncUserProfileWithBackend(res.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Firebase authentication failed.' };
    }
  };

  const registerWithFirebase = async (email: string, pass: string, name: string, accountType: 'student' | 'client' = 'student') => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await sendEmailVerification(res.user);
        await syncUserProfileWithBackend(res.user, name, accountType);
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Firebase account creation failed.' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Password reset email failed.' };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('nexus_user');
  };

  const login = (email: string, role: 'student' | 'teacher' | 'admin' = 'student') => {
    const names: Record<string, string> = {
      student: 'Alex Rivera',
      teacher: 'Dr. Evelyn Sterling',
      admin: 'Marcus Thorne (Administrator)',
    };
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: names[role] || email.split('@')[0],
      email,
      role,
      avatar:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      enrolledCourses: enrolledCourseIds,
    };
    setUser(newUser);
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
  };

  const switchRole = (role: 'student' | 'teacher' | 'admin') => {
    if (!user) {
      login('alex.rivera@nexusai.com', role);
      return;
    }
    const updated: User = {
      ...user,
      role,
      name:
        role === 'admin'
          ? 'Marcus Thorne (Administrator)'
          : role === 'teacher'
          ? 'Dr. Evelyn Sterling'
          : 'Alex Rivera',
    };
    setUser(updated);
    localStorage.setItem('nexus_user', JSON.stringify(updated));
  };

  const enrollInCourse = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      const updated = [...enrolledCourseIds, courseId];
      setEnrolledCourseIds(updated);
      if (user) {
        const updatedUser = { ...user, enrolledCourses: updated };
        setUser(updatedUser);
        localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        loginWithFirebase,
        registerWithFirebase,
        resetPassword,
        logout,
        enrolledCourseIds,
        enrollInCourse,
        login,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
