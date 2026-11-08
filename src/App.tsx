/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademyPage } from './pages/AcademyPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPages } from './pages/AuthPages';
import { LegalPages } from './pages/LegalPages';
import { AiLabPage } from './pages/AiLabPage';
import { TechStackPage } from './pages/TechStackPage';
import { SystemStatusPage } from './pages/SystemStatusPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { SupportCenterPage } from './pages/SupportCenterPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { LearningPathsPage } from './pages/LearningPathsPage';
import { CareerPage } from './pages/CareerPage';
import { StudentProjectsPage } from './pages/StudentProjectsPage';
import { CommunityPage } from './pages/CommunityPage';
import { ResearchPage } from './pages/ResearchPage';
import { KnowledgeAdminPage } from './pages/KnowledgeAdminPage';
import { KnowledgeIntelligenceCenterPage } from './pages/KnowledgeIntelligenceCenterPage';
import { GNRCPage } from './pages/GNRCPage';
import { GNRCApplyPage } from './pages/GNRCApplyPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { safeFetchJson } from './utils/api';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { COURSES, SERVICES, AI_TOOLS } from './data/mockData';
import { PageRoute, Course, Service, AIToolItem } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedAIBackground, AIAnimationVariant } from './components/AnimatedAIBackground';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES[0]);
  const [selectedService, setSelectedService] = useState<Service>(SERVICES[0]);
  const [selectedTool, setSelectedTool] = useState<AIToolItem>(AI_TOOLS[0]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Private Admin Session State
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('nexus_admin_token'));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [checkingAdminSession, setCheckingAdminSession] = useState<boolean>(false);

  const verifyAdminSession = async (tokenToCheck?: string) => {
    const token = tokenToCheck || localStorage.getItem('nexus_admin_token');
    if (!token) {
      setIsAdminAuthenticated(false);
      return;
    }

    setCheckingAdminSession(true);
    const res = await safeFetchJson('/api/admin/auth/session', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.success && res.data?.authenticated) {
      setIsAdminAuthenticated(true);
      setAdminToken(token);
    } else {
      localStorage.removeItem('nexus_admin_token');
      setIsAdminAuthenticated(false);
      setAdminToken(null);
    }
    setCheckingAdminSession(false);
  };

  React.useEffect(() => {
    if (currentPage === 'admin' || (currentPage as string) === 'admin-dashboard') {
      verifyAdminSession();
    }
  }, [currentPage]);

  const handleAdminLoginSuccess = (token: string) => {
    localStorage.setItem('nexus_admin_token', token);
    setAdminToken(token);
    setIsAdminAuthenticated(true);
    setCurrentPage('admin');
  };

  const handleAdminLogoutSuccess = () => {
    localStorage.removeItem('nexus_admin_token');
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    setCurrentPage('admin');
  };

  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentPage('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setCurrentPage('service-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (tool: AIToolItem) => {
    setSelectedTool(tool);
    setCurrentPage('tool-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBackgroundVariant = (page: PageRoute): AIAnimationVariant => {
    switch (page) {
      case 'home':
        return 'home';
      case 'academy':
      case 'courses':
      case 'course-detail':
        return 'academy';
      case 'tools':
      case 'tool-detail':
        return 'tools';
      case 'services':
      case 'service-detail':
      case 'projects':
        return 'services';
      case 'about':
      case 'ai-lab':
      case 'tech-stack':
      case 'system-status':
      case 'help-center':
      case 'support-center':
      case 'client-portal':
      case 'learning-paths':
      case 'careers':
      case 'student-projects':
      case 'community':
      case 'research':
      case 'privacy':
      case 'terms':
        return 'about';
      case 'student-dashboard':
      case 'admin':
      case 'knowledge-admin':
      case 'knowledge-intelligence':
        return 'dashboard';
      case 'login':
      case 'register':
        return 'login';
      case 'blog':
        return 'blog';
      case 'contact':
        return 'contact';
      default:
        return 'home';
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen text-[#F1F5FF] flex flex-col selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
        {/* Continuous Full-Screen Animated AI Neural Environment behind all pages & sections */}
        <AnimatedAIBackground variant={getBackgroundVariant(currentPage)} />

        {/* Content Shell sitting above canvas */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Navigation Bar adhering to Top Bar Contract */}
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleNavigate}
          onSelectCourse={handleSelectCourse}
          onSelectService={handleSelectService}
          onSelectTool={handleSelectTool}
        />

        {/* Cinematic Animated Page Transitions */}
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {currentPage === 'home' && (
                <HomePage
                  onNavigate={handleNavigate}
                  onSelectCourse={handleSelectCourse}
                  onSelectService={handleSelectService}
                  onSelectTool={handleSelectTool}
                />
              )}

              {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

              {currentPage === 'academy' && (
                <AcademyPage
                  onNavigate={handleNavigate}
                  onSelectCourse={handleSelectCourse}
                />
              )}

              {currentPage === 'courses' && (
                <CoursesPage onSelectCourse={handleSelectCourse} />
              )}

              {currentPage === 'course-detail' && (
                <CourseDetailPage
                  course={selectedCourse}
                  onBack={() => handleNavigate('courses')}
                  onNavigateToDashboard={() => handleNavigate('student-dashboard')}
                />
              )}

              {currentPage === 'services' && (
                <ServicesPage
                  onSelectService={handleSelectService}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'service-detail' && (
                <ServiceDetailPage
                  service={selectedService}
                  onBack={() => handleNavigate('services')}
                />
              )}

              {currentPage === 'tools' && (
                <ToolsDirectoryPage onSelectTool={handleSelectTool} />
              )}

              {currentPage === 'tool-detail' && (
                <ToolDetailPage
                  tool={selectedTool}
                  onBack={() => handleNavigate('tools')}
                />
              )}

              {currentPage === 'projects' && (
                <ProjectsPage onNavigate={handleNavigate} />
              )}

              {currentPage === 'blog' && <BlogPage />}

              {currentPage === 'contact' && <ContactPage />}

              {currentPage === 'ai-lab' && <AiLabPage onNavigate={handleNavigate} />}

              {currentPage === 'tech-stack' && <TechStackPage onNavigate={handleNavigate} />}

              {currentPage === 'system-status' && <SystemStatusPage onNavigate={handleNavigate} />}

              {currentPage === 'help-center' && <HelpCenterPage onNavigate={handleNavigate} />}

              {currentPage === 'support-center' && <SupportCenterPage onNavigate={handleNavigate} />}

              {currentPage === 'client-portal' && <ClientPortalPage onNavigate={handleNavigate} />}

              {currentPage === 'learning-paths' && (
                <LearningPathsPage
                  onNavigate={handleNavigate}
                  onSelectCourse={handleSelectCourse}
                />
              )}

              {currentPage === 'careers' && <CareerPage onNavigate={handleNavigate} />}

              {currentPage === 'student-projects' && <StudentProjectsPage onNavigate={handleNavigate} />}

              {currentPage === 'community' && <CommunityPage onNavigate={handleNavigate} />}

              {currentPage === 'research' && <ResearchPage onNavigate={handleNavigate} />}

              {currentPage === 'student-dashboard' && (
                <StudentDashboard
                  onNavigate={handleNavigate}
                  onSelectCourse={handleSelectCourse}
                />
              )}

              {((currentPage as string) === 'admin' || (currentPage as string) === 'admin-dashboard') && (
                isAdminAuthenticated ? (
                  <AdminDashboard onNavigate={handleNavigate} onLogout={handleAdminLogoutSuccess} />
                ) : (
                  <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
                )
              )}

              {currentPage === 'knowledge-admin' && <KnowledgeAdminPage onNavigate={handleNavigate} />}

              {currentPage === 'knowledge-intelligence' && (
                <KnowledgeIntelligenceCenterPage onNavigate={handleNavigate} />
              )}

              {(currentPage === 'gnrc' || currentPage === 'gnrc-courses') && (
                <GNRCPage onNavigate={handleNavigate} />
              )}

              {(currentPage === 'gnrc-apply' || currentPage === 'gnrc-admissions') && (
                <GNRCApplyPage onNavigate={handleNavigate} />
              )}

              {currentPage === 'gnrc-student-portal' && (
                <StudentDashboard onNavigate={handleNavigate} onSelectCourse={handleSelectCourse} />
              )}

              {currentPage === 'login' && (
                <AuthPages mode="login" onNavigate={handleNavigate} />
              )}

              {currentPage === 'register' && (
                <AuthPages mode="register" onNavigate={handleNavigate} />
              )}

              {currentPage === 'privacy' && (
                <LegalPages type="privacy" onNavigate={handleNavigate} />
              )}

              {currentPage === 'terms' && (
                <LegalPages type="terms" onNavigate={handleNavigate} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Multi-column Global Footer */}
        <Footer onNavigate={handleNavigate} />
        </div>
      </div>

      {/* Floating Global AI Assistant */}
      <FloatingAIAssistant />
    </AuthProvider>
  );
}
