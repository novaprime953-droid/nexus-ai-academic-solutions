import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: 'student' | 'teacher' | 'admin') => void;
  logout: () => void;
  switchRole: (role: 'student' | 'teacher' | 'admin') => void;
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string) => void;
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
  login: () => {},
  logout: () => {},
  switchRole: () => {},
  enrolledCourseIds: ['artificial-intelligence', 'web-development'],
  enrollInCourse: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultStudent);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([
    'artificial-intelligence',
    'web-development',
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        if (parsed.enrolledCourses) {
          setEnrolledCourseIds(parsed.enrolledCourses);
        }
      } catch (e) {
        // use default
      }
    }
  }, []);

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
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
        login,
        logout,
        switchRole,
        enrolledCourseIds,
        enrollInCourse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
