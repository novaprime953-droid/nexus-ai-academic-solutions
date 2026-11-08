import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { MagneticButton } from './MagneticButton';
import { NotificationDropdown } from './NotificationDropdown';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Cpu, UserCheck, Search } from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { user, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageRoute }[] = [
    { label: 'Academy', page: 'academy' },
    { label: 'GNRC Institute', page: 'gnrc' },
    { label: 'Services', page: 'services' },
    { label: 'AI Tools', page: 'tools' },
    { label: 'AI Lab', page: 'ai-lab' },
    { label: 'Portfolio', page: 'projects' },
    { label: 'About', page: 'about' },
  ];

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#4263FF]/20 bg-[#101A3B]/85 backdrop-blur-xl transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single clean brand wordmark with spring hover */}
        <motion.button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              NEXUS <span className="text-cyan-400 font-medium">AI</span>
            </span>
          </div>
        </motion.button>

        {/* Zone 2: Clean single-line text navigation links with animated indicator */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300 relative">
          {navLinks.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`transition-colors whitespace-nowrap py-1 relative hover:text-white ${
                  isActive ? 'text-white font-semibold' : 'text-slate-300'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          <button
            onClick={() => handleNavClick('blog')}
            className={`transition-colors whitespace-nowrap py-1 relative hover:text-white ${
              currentPage === 'blog' ? 'text-white font-semibold' : 'text-slate-300'
            }`}
          >
            Insights
            {currentPage === 'blog' && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Global Search (Cmd + K)"
            aria-label="Global Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Center */}
          <NotificationDropdown />

          {/* Quick Role Switcher */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors whitespace-nowrap"
              title="Switch demo role between Student, Teacher, and Admin"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="capitalize">{user ? user.role : 'Guest'}</span>
            </button>

            <AnimatePresence>
              {roleMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 py-1.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl shadow-2xl z-50 text-xs"
                >
                  <div className="px-3 py-1 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                    Switch Active Role
                  </div>
                  {(['student', 'teacher', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-white/5 capitalize ${
                        user?.role === r ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span>{r} Account</span>
                      {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Magnetic Primary CTA Button */}
          {user?.role === 'admin' ? (
            <MagneticButton
              onClick={() => handleNavClick('admin-dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-purple-500/25 whitespace-nowrap"
            >
              Admin Dashboard
            </MagneticButton>
          ) : user ? (
            <MagneticButton
              onClick={() => handleNavClick('student-dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-lg shadow-sm shadow-blue-500/25 whitespace-nowrap"
            >
              Student Portal
            </MagneticButton>
          ) : (
            <MagneticButton
              onClick={() => handleNavClick('login')}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-lg shadow-sm shadow-blue-500/25 whitespace-nowrap"
            >
              Sign In
            </MagneticButton>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b border-[#4263FF]/30 bg-[#101A3B]/98 px-6 py-5 space-y-4 backdrop-blur-2xl overflow-hidden"
          >
            <div className="flex flex-col space-y-3 text-sm font-medium">
              <button
                onClick={() => handleNavClick('home')}
                className="text-left text-slate-300 hover:text-white py-1"
              >
                Home
              </button>
              {navLinks.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className="text-left text-slate-300 hover:text-white py-1"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('blog')}
                className="text-left text-slate-300 hover:text-white py-1"
              >
                Blog &amp; Insights
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-left text-slate-300 hover:text-white py-1"
              >
                Contact Consultation
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <div className="text-xs text-slate-400">Current Role: {user?.role || 'Guest'}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    switchRole('student');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-300"
                >
                  Student
                </button>
                <button
                  onClick={() => {
                    switchRole('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-300"
                >
                  Admin
                </button>
              </div>
              {user ? (
                <button
                  onClick={() =>
                    handleNavClick(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')
                  }
                  className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg text-center"
                >
                  Open {user.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg text-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
