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

// ----------------------------------------------------
// KNOWLEDGE BASE & DOCUMENT MANAGEMENT
// ----------------------------------------------------
export type KnowledgeCategoryType =
  | 'Company'
  | 'Academy'
  | 'Services'
  | 'AI Tools'
  | 'FAQs'
  | 'Policies'
  | 'Support'
  | 'Technical Documentation'
  | 'Internal Knowledge';

export type KnowledgeStatus = 'draft' | 'approved' | 'archived';
export type KnowledgeVisibility = 'public' | 'internal_only';

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: KnowledgeCategoryType;
  content: string;
  type: 'Markdown' | 'PDF' | 'TXT' | 'DOCX' | 'JSON';
  size: string;
  uploadedAt: string;
  updatedAt: string;
  version: number;
  status: KnowledgeStatus;
  visibility: KnowledgeVisibility;
  chunksCount: number;
  approvedBy?: string;
  tags: string[];
  sourceUrl?: string;
}

// ----------------------------------------------------
// CUSTOMER SUPPORT TICKETING SYSTEM
// ----------------------------------------------------
export type TicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Waiting for Customer'
  | 'Escalated'
  | 'Resolved'
  | 'Closed';

export type TicketCategory =
  | 'Technical Support'
  | 'Academy'
  | 'Enrollment'
  | 'AI Tools'
  | 'Services'
  | 'Billing'
  | 'Account'
  | 'Privacy'
  | 'Complaint'
  | 'General Inquiry';

export type TicketPriority = 'P1 (Critical)' | 'P2 (High)' | 'P3 (Normal)' | 'P4 (Low)';

export interface TicketReply {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'customer' | 'staff' | 'ai_assistant';
  message: string;
  timestamp: string;
  isInternalNote?: boolean;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
  attachments?: string[];
  satisfactionRating?: number;
  satisfactionFeedback?: string;
  aiDraftReply?: string;
  aiSummary?: string;
}

export interface CrawlPage {
  path: string;
  title: string;
  category: string;
  status: 'Indexed' | 'Pending' | 'Changed' | 'Excluded';
  lastScanned: string;
  contentHash: string;
  chunkCount: number;
  isExcluded?: boolean;
}

// ----------------------------------------------------
// ACADEMY LEARNING MANAGEMENT SYSTEM (LMS)
// ----------------------------------------------------
export type CourseStatus = 'Draft' | 'Under Review' | 'Published' | 'Archived';
export type LessonType = 'video' | 'article' | 'quiz' | 'assignment';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  videoUrl?: string;
  contentHtml?: string;
  downloadableResources?: { name: string; url: string; size: string }[];
  learningObjectives?: string[];
  isFreePreview?: boolean;
}

export interface CourseModule {
  id: string;
  week: string;
  title: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  timeLimitMinutes: number;
  passScorePercentage: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  courseId: string;
  studentEmail: string;
  studentName: string;
  scorePercentage: number;
  passed: boolean;
  answers: Record<string, string | number>;
  submittedAt: string;
  feedback?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  maxPoints: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  courseId: string;
  studentEmail: string;
  studentName: string;
  content: string;
  fileName?: string;
  submittedAt: string;
  gradePoints?: number;
  status: 'Pending' | 'Graded' | 'Resubmission Requested';
  instructorFeedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface IssuedCertificate {
  id: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issuedAt: string;
  gradeScore: string;
  verificationUrl: string;
  status: 'Valid' | 'Revoked';
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending Moderation' | 'Rejected';
}

export interface AcademyAnnouncement {
  id: string;
  courseId?: string;
  title: string;
  message: string;
  postedBy: string;
  date: string;
  targetCohort: string;
}

export interface LessonProgress {
  studentEmail: string;
  courseId: string;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  progressPercentage: number;
  lastAccessedAt: string;
}

// ----------------------------------------------------
// SERVICES CRM & CLIENT PROJECT MANAGEMENT SYSTEM
// ----------------------------------------------------
export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Converted'
  | 'Lost';

export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface CRMLead {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone?: string;
  country?: string;
  source: 'Website Inquiry' | 'Contact Form' | 'Referral' | 'LinkedIn' | 'Outreach';
  status: LeadStatus;
  priority: LeadPriority;
  assignedSalesRep: string;
  requiredService: string;
  budgetRange: string;
  timeline: string;
  description: string;
  internalNotes: string[];
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  country?: string;
  assignedAccountManager: string;
  activeProjectIds: string[];
  completedProjectIds: string[];
  totalValueUSD: number;
  status: 'Active' | 'On Hold' | 'Archived';
  joinedAt: string;
}

export type ProposalStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';

export interface ProposalItem {
  id: string;
  serviceTitle: string;
  description: string;
  deliverables: string[];
  estimatedDays: number;
  priceUSD: number;
}

export interface ProposalRecord {
  id: string;
  leadId?: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  title: string;
  scopeSummary: string;
  items: ProposalItem[];
  totalAmountUSD: number;
  expiryDate: string;
  status: ProposalStatus;
  createdAt: string;
  sentAt?: string;
  respondedAt?: string;
  clientFeedback?: string;
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Review' | 'Completed' | 'Cancelled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Completed';

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  deliverables: string[];
}

export interface ProjectDocument {
  id: string;
  title: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ClientProject {
  id: string;
  clientId: string;
  clientName: string;
  companyName: string;
  title: string;
  description: string;
  serviceCategory: string;
  status: ProjectStatus;
  projectManager: string;
  teamMembers: string[];
  progressPercentage: number;
  startDate: string;
  expectedCompletionDate: string;
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  documents: ProjectDocument[];
  budgetUSD: number;
  clientFeedback?: string;
}

export interface CRMActivityLog {
  id: string;
  entityType: 'Lead' | 'Client' | 'Proposal' | 'Project';
  entityId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

// ----------------------------------------------------
// SYSTEM SETTINGS, USER MANAGEMENT & AUDIT LOGS
// ----------------------------------------------------
export type SystemRole =
  | 'Owner'
  | 'Super Admin'
  | 'Admin'
  | 'Academy Admin'
  | 'Instructor'
  | 'Student'
  | 'Sales Manager'
  | 'Sales Representative'
  | 'Project Manager'
  | 'Team Member'
  | 'Client';

export interface SystemUserRecord {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLoginAt?: string;
  avatar?: string;
}

export interface SystemSettings {
  general: {
    companyName: string;
    websiteTitle: string;
    defaultLanguage: string;
    timezone: string;
    dateFormat: string;
    maintenanceMode: boolean;
  };
  academy: {
    autoApproveCourses: boolean;
    passScoreDefault: number;
    certificatePrefix: string;
  };
  crm: {
    quoteExpiryDays: number;
    defaultLeadAssignedRep: string;
  };
  support: {
    slaP1Minutes: number;
    slaP2Hours: number;
    slaP3Hours: number;
    autoAssignStaff: boolean;
  };
  ai: {
    modelName: string;
    maxTokens: number;
    temperature: number;
  };
  security: {
    rateLimitRequestsPerMin: number;
    sessionTimeoutMinutes: number;
    auditLogEnabled: boolean;
  };
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  action: string;
  targetEntity: string;
  outcome: 'Success' | 'Denied' | 'Failed';
  details: string;
}




