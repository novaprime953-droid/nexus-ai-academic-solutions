export type PageRoute =
  | 'home'
  | 'about'
  | 'academy'
  | 'courses'
  | 'course-detail'
  | 'services'
  | 'service-detail'
  | 'tools'
  | 'tool-detail'
  | 'projects'
  | 'blog'
  | 'contact'
  | 'login'
  | 'register'
  | 'student-dashboard'
  | 'admin-dashboard'
  | 'privacy'
  | 'terms'
  | 'ai-lab'
  | 'tech-stack'
  | 'system-status'
  | 'help-center'
  | 'support-center'
  | 'client-portal'
  | 'learning-paths'
  | 'careers'
  | 'student-projects'
  | 'community'
  | 'research'
  | 'knowledge-admin'
  | 'knowledge-intelligence';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  enrolledCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  category: 'Artificial Intelligence' | 'Web Development' | 'App Development' | 'Digital Marketing' | 'Graphic Design' | 'AI Automation' | 'Video Editing' | 'SEO' | 'Freelancing';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  duration: string;
  rating: number;
  studentsCount: number;
  price: string;
  isPhysicalAvailable: boolean;
  physicalLocation?: string;
  physicalSchedule?: string;
  onlineSchedule?: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  overview: string;
  curriculum: {
    week: string;
    title: string;
    topics: string[];
    lessonsCount: number;
  }[];
  skillsAcquired: string[];
  prerequisites: string[];
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  deliverables: string[];
  timeline: string;
  pricingRange: string;
  caseStudyHighlight: string;
  impactMetrics: { label: string; value: string }[];
  techStack: string[];
}

export interface AIToolItem {
  id: string;
  title: string;
  category: 'Text & AI' | 'SEO & Growth' | 'Developer' | 'PDF & Document' | 'Image & Media';
  description: string;
  badge: string;
  isServerAI: boolean;
  iconName: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  metric: string;
  metricLabel: string;
  image: string;
  tags: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
}
