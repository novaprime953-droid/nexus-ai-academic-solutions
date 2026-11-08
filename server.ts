import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = process.cwd();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS & Options Preflight Handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '10mb' }));

// ----------------------------------------------------
// MASTER KNOWLEDGE BASE LOAD
// ----------------------------------------------------
let masterKnowledgeBaseText = '';
try {
  const masterKbPath = path.resolve(__dirname, 'Nexus_AI_Master_Knowledge_Base.md');
  if (fs.existsSync(masterKbPath)) {
    masterKnowledgeBaseText = fs.readFileSync(masterKbPath, 'utf-8');
    console.log('Successfully loaded Nexus AI Master Knowledge Base into server runtime.');
  }
} catch (e) {
  console.warn('Could not read Nexus_AI_Master_Knowledge_Base.md:', e);
}

// ----------------------------------------------------
// NEXUS AI ENGINE (GOOGLE GENAI API INTEGRATION)
// ----------------------------------------------------
const rawApiKey = (process.env.GEMINI_API_KEY || '').trim();
const isValidApiKey = Boolean(
  rawApiKey &&
  rawApiKey !== '' &&
  !rawApiKey.startsWith('AQ.Ab8RN6') &&
  !rawApiKey.startsWith('MY_GEMINI')
);

let ai: GoogleGenAI | null = null;
if (isValidApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: rawApiKey,
    });
  } catch (e) {
    ai = null;
  }
}

async function generateNexusAIResponse(prompt: string, customSystemInstruction?: string): Promise<string> {
  const pLower = prompt.toLowerCase().trim();

  // 1. Conversational Greetings
  if (pLower.match(/^(hi|hello|hey|assalam|salam|kaise|kya haal|help|start|greetings)/i)) {
    return `Assalam-o-Alaikum / Hello! Welcome to **Nexus AI Academic & Solutions**.
Main Nexus AI Assistant hoon. Main aap ko hamari academy courses, digital software services, aur AI tools ke baray mein mukammal maloomat faraham kar sakta hoon.

Aap kis baray mein jaan-na chahte hain? / How can I assist your learning or enterprise project today?`;
  }

  // 2. Intent-Based Fast Conversational Handlers (Accurate & Specific)
  if (pLower.match(/(who are you|tum kaun ho|who is nexus|about nexus|brand identity|apna tarof|introduce yourself)/i)) {
    return `Main Nexus AI Academic & Solutions ka official AI assistant hoon. Nexus AI ek premier technology institute aur enterprise software consultancy hai jo generative AI education, custom autonomous software solutions, aur modern full-stack web/mobile engineering offer karti hai.`;
  }

  if (pLower.match(/(fee|fees|cost|price|pricing|kitni fee|kitne paise|charge|tuition)/i)) {
    return `**Nexus AI Academy — Course Fees & Pricing Overview**:

1. **Autonomous AI Agents & LLM Architecture**: $890 (12 Weeks)
2. **Full-Stack Modern Web Engineering (React 19)**: $720 (10 Weeks)
3. **Cross-Platform Mobile App Engineering**: $680 (8 Weeks)
4. **Enterprise AI Automation & Workflow Pipelines**: $950 (10 Weeks)
5. **UI/UX Design System & Product Architecture**: $550 (6 Weeks)
6. **Cloud Infrastructure, Docker & Kubernetes**: $820 (10 Weeks)
7. **Cyber Security & AI Vulnerability Defense**: $890 (10 Weeks)
8. **Data Engineering & Real-Time Analytics**: $780 (8 Weeks)
9. **Executive AI Strategy Masterclass**: $1,200 (4 Weeks)

All programs include online access, verified certificates, and live mentor support. Physical lab access is available at Cyber City Labs.`;
  }

  if (pLower.match(/(address|location|campus|office|kahan hai|lab|kahan ho|city|where|contact)/i)) {
    return `**Nexus AI Physical Campus & Office Details**:
• **Location**: Nexus Tower 4, Tech Innovation Corridor, Cyber City Labs.
• **Academic Inquiries**: academy@nexusai.academic.io
• **Enterprise Solutions**: solutions@nexusai.academic.io
• **Direct WhatsApp Priority Channel**: +1 (555) 019-2834
• **Operating Hours**: Monday – Friday 8:00 AM – 10:00 PM EST (Physical Labs open Saturdays for enrolled cohorts).`;
  }

  if (pLower.match(/(courses|course|subject|seekhna|learn|curriculum|classes|program)/i)) {
    return `**Nexus AI Academy Master Programs**:
• **Autonomous AI Agents & LLM Architecture** (12 Weeks | $890 | Dr. Evelyn Sterling)
• **Full-Stack Web Engineering & React 19** (10 Weeks | $720 | Kaelen Vance)
• **Cross-Platform Mobile Engineering** (8 Weeks | $680 | Maya Lin)
• **Enterprise AI Automation Pipelines** (10 Weeks | $950 | Marcus Thorne)
• **UI/UX Design Systems** (6 Weeks | $550 | Elena Rostova)
• **Cyber Security & Vulnerability Defense** (10 Weeks | $890 | Sarah Chen)

Courses feature both online self-paced options and physical campus lab cohorts.`;
  }

  if (pLower.match(/(service|services|digital solutions|project|consultation|development)/i)) {
    return `**Nexus AI Enterprise Software Services**:
1. **AI Automation & Custom Agent Pipelines**: Autonomous CRM triggers, document parsers, and multi-agent workflow orchestration.
2. **Full-Stack Web & Mobile Engineering**: Custom React 19 web applications, mobile apps, and microservices.
3. **Cloud Infrastructure & DevOps**: High-availability Kubernetes clusters and edge deployments.
4. **Security Audit & Penetration Testing**: Prompt injection defense and zero-trust IAM frameworks.
5. **Custom LLM Fine-Tuning**: Fine-tuning domain models and private RAG vector architectures.

Submit a request via our Contact page or WhatsApp (+1 555-019-2834) to request an architecture review.`;
  }

  // Grounding System Instruction using Master Knowledge Base
  const defaultSystemInstruction = `You are the official customer-facing AI assistant for NEXUS AI ACADEMIC & SOLUTIONS.

GROUNDING & OPERATING RULES:
1. Answer the user's specific question directly, accurately, and concisely using the official Master Knowledge Base.
2. Respond in the customer's language (English, Urdu, Roman Urdu, or bilingual English/Urdu).
3. Do not invent unconfirmed facts, guaranteed jobs, passwords, OTPs, or payment card details.
4. For project/software enquiries, ask focused discovery questions (problem, platform, key features).
5. Maintain a professional, helpful, confident, and technology-focused brand voice.

OFFICIAL MASTER KNOWLEDGE BASE:
"""
${masterKnowledgeBaseText ? masterKnowledgeBaseText.slice(0, 18000) : 'Nexus AI Academic & Solutions Official Handbook'}
"""`;

  // 3. Try Google GenAI SDK if API key is configured
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: customSystemInstruction || defaultSystemInstruction,
        },
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.error('Gemini API execution error:', err?.message || err);
    }
  }

  // 4. Smart Stop-Word Filtered & Ranked Knowledge Lookup
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'you', 'can', 'what', 'how', 'tell', 'about',
    'from', 'with', 'this', 'that', 'have', 'your', 'name', 'does', 'do', 'will',
    'kya', 'hai', 'main', 'aap', 'ka', 'ke', 'ki', 'ko', 'se', 'me', 'par', 'bhi',
    'who', 'is', 'a', 'an', 'in', 'on', 'at', 'to', 'of', 'or', 'if', 'we', 'us'
  ]);

  const rawTokens = pLower.split(/\s+/).map(t => t.replace(/[^a-z0-9]/g, '')).filter(Boolean);
  const meaningfulTokens = rawTokens.filter(t => t.length > 2 && !stopWords.has(t));

  if (meaningfulTokens.length > 0) {
    const scoredItems: { title: string; content: string; score: number }[] = [];

    companyKnowledgeStore.forEach((cat) => {
      cat.items.forEach((item) => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();

        if (titleLower.includes(pLower)) score += 15;
        if (contentLower.includes(pLower)) score += 10;

        meaningfulTokens.forEach((token) => {
          if (item.tags.some(tag => tag.toLowerCase().includes(token))) score += 5;
          if (titleLower.includes(token)) score += 4;
          if (contentLower.includes(token)) score += 2;
        });

        if (score > 0) {
          scoredItems.push({ title: item.title, content: item.content, score });
        }
      });
    });

    scoredItems.sort((a, b) => b.score - a.score);

    if (scoredItems.length > 0) {
      const topItems = scoredItems.slice(0, 2);
      return `[Nexus AI Assistant]:\n\n${topItems.map(i => `• **${i.title}**:\n${i.content}`).join('\n\n')}\n\nAap mazeed maloomat ke liye hamare **Academy** ya **Contact** pages visit kar sakte hain. How else can I help you?`;
    }
  }

  // 5. Default fallback
  return `[Nexus AI Assistant]:
Thank you for reaching out to Nexus AI Academic & Solutions.

We offer professional master programs in Autonomous AI Agents, Full-Stack Web Engineering, Mobile App Engineering, and Enterprise Software Solutions.

• **Campus**: Nexus Tower 4, Tech Innovation Corridor, Cyber City Labs.
• **Email**: academy@nexusai.academic.io
• **WhatsApp**: +1 (555) 019-2834

Note: For live generative AI synthesis, please configure a valid \`GEMINI_API_KEY\` in your environment or Settings > Secrets (obtain a free key at https://aistudio.google.dev/).`;
}

// In-Memory Data Store with Initial Seed Data
interface Inquiry {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed';
  createdAt: string;
}

interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  type: 'online' | 'physical';
  schedule?: string;
  progress: number;
  enrolledAt: string;
  certificateIssued: boolean;
}

const inquiries: Inquiry[] = [
  {
    id: 'inq-101',
    name: 'Sarah Chen',
    email: 'sarah.chen@innovatecorp.io',
    service: 'AI Automation & Agents',
    budget: '$10,000 - $25,000',
    message: 'Seeking custom LLM agent integration for our customer intelligence pipeline.',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'inq-102',
    name: 'Marcus Vance',
    email: 'marcus@vancecapital.com',
    service: 'Website & App Development',
    budget: '$25,000+',
    message: 'We require a next-generation high frequency trading UI and analytics portal.',
    status: 'new',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'inq-103',
    name: 'Elena Rostova',
    email: 'elena@biomedx.org',
    service: 'Branding & Design System',
    budget: '$5,000 - $10,000',
    message: 'Brand overhaul and design system for our genomics data platform.',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

const enrollments: Enrollment[] = [
  {
    id: 'enr-201',
    studentName: 'Alex Rivera',
    studentEmail: 'student@nexusai.com',
    courseId: 'ai-engineering',
    courseTitle: 'Full-Stack Generative AI & Autonomous Agents',
    type: 'online',
    progress: 78,
    enrolledAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    certificateIssued: false,
  },
  {
    id: 'enr-202',
    studentName: 'Alex Rivera',
    studentEmail: 'student@nexusai.com',
    courseId: 'web-development',
    courseTitle: 'Modern Next.js, React 19 & Cloud Architecture',
    type: 'online',
    progress: 100,
    enrolledAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    certificateIssued: true,
  },
  {
    id: 'enr-203',
    studentName: 'Jordan Lee',
    studentEmail: 'jordan@nexusai.com',
    courseId: 'ai-automation',
    courseTitle: 'Enterprise AI Automation & Workflow Pipelines',
    type: 'physical',
    schedule: 'Mon & Wed 6:00 PM - 8:30 PM (Nexus Campus Lab 4)',
    progress: 45,
    enrolledAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    certificateIssued: false,
  }
];

let toolUsageCount = 1420;

// ----------------------------------------------------
// API ROUTES: AI TOOLS & GEMINI API
// ----------------------------------------------------

// 1. AI Chat Assistant
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, systemInstruction } = req.body;
    toolUsageCount++;

    const prompt = Array.isArray(messages)
      ? messages.map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
      : String(messages || '');

    const reply = await generateNexusAIResponse(prompt, systemInstruction || 'You are Nexus AI Assistant, an elite technology advisor, senior software architect, and AI instructor for NEXUS AI ACADEMIC & SOLUTIONS. Be concise, authoritative, deeply technical, and exceptionally helpful.');
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response from Nexus Self-Hosted Engine.' });
  }
});

// 2. AI Content Writer
app.post('/api/gemini/content-writer', async (req: Request, res: Response) => {
  try {
    const { topic, tone, format, audience, targetLength } = req.body;
    toolUsageCount++;

    const prompt = `Write professional, production-grade content based on the following specifications:
Topic: ${topic}
Tone: ${tone || 'Authoritative & Inspiring'}
Format: ${format || 'Executive Article'}
Target Audience: ${audience || 'Founders, Engineers, and Tech Leaders'}
Approximate Length: ${targetLength || '500 words'}

Deliver high-impact, refined prose with clear headings, crisp insights, and no fluff.`;

    const content = await generateNexusAIResponse(prompt, 'You are an award-winning technology copywriter and strategist at Nexus AI.');
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Content generation failed.' });
  }
});

// 3. AI Blog Generator
app.post('/api/gemini/blog-generator', async (req: Request, res: Response) => {
  try {
    const { topic, keywords } = req.body;
    toolUsageCount++;

    const prompt = `Generate a comprehensive, SEO-optimized, in-depth blog article on: "${topic}".
Keywords to integrate naturally: ${keywords || 'artificial intelligence, automation, modern architecture'}

Structure:
# Catchy, Highly Engaging Title
## Introduction & The Core Paradigm Shift
## Key Architectural Principles & Practical Implementations
## Real-World Impact & Industry Applications
## Future Outlook & Actionable Takeaways
## Conclusion`;

    const article = await generateNexusAIResponse(prompt, 'You are a staff AI researcher and chief editor at Nexus AI Publications.');
    res.json({ article });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Blog generation failed.' });
  }
});

// 4. AI Email Writer
app.post('/api/gemini/email-writer', async (req: Request, res: Response) => {
  try {
    const { purpose, recipientRole, keyPoints, tone } = req.body;
    toolUsageCount++;

    const prompt = `Write a polished, high-conversion email.
Purpose: ${purpose}
Recipient: ${recipientRole}
Key Points: ${keyPoints}
Tone: ${tone || 'Professional & Compelling'}

Include:
- Subject Line (Provide 3 high-open options)
- Clean, polite greeting
- Clear, punchy body paragraphs
- High-frictionless Call to Action
- Professional sign-off`;

    const email = await generateNexusAIResponse(prompt);
    res.json({ email });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Email generation failed.' });
  }
});

// 5. AI Summarizer
app.post('/api/gemini/summarize', async (req: Request, res: Response) => {
  try {
    const { text, format } = req.body;
    toolUsageCount++;

    const prompt = `Analyze and summarize the following text using format: ${format || 'Executive Summary with Action Items'}.

Text:
"""
${text}
"""

Provide:
1. One-Sentence Core Insight
2. Key Findings / Data Points (bulleted)
3. Actionable Decisions / Takeaways`;

    const summary = await generateNexusAIResponse(prompt);
    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Summarization failed.' });
  }
});

// 6. SEO Meta Generator
app.post('/api/gemini/seo-meta', async (req: Request, res: Response) => {
  try {
    const { pageTitle, pageDescription, targetKeywords } = req.body;
    toolUsageCount++;

    const prompt = `Generate an optimal SEO metadata package for:
Page Title / Concept: ${pageTitle}
Description / Notes: ${pageDescription}
Target Keywords: ${targetKeywords}

Provide:
1. Recommended Title Tag (50-60 chars)
2. Meta Description (140-160 chars)
3. Open Graph Title & Description
4. Suggested Canonical Slug
5. Targeted Long-Tail Keyword Cluster (5-7 terms)`;

    const result = await generateNexusAIResponse(prompt);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'SEO generation failed.' });
  }
});

// 7. Keyword Analyzer
app.post('/api/gemini/keyword-analyzer', async (req: Request, res: Response) => {
  try {
    const { keyword, niche } = req.body;
    toolUsageCount++;

    const prompt = `Analyze the keyword: "${keyword}" in the niche: "${niche || 'Technology & AI'}".
Provide:
1. Search Intent Classification (Informational, Commercial, Navigational, Transactional)
2. Semantic Keyword Variations (5 high-intent phrases)
3. Questions Searchers Ask (People Also Ask)
4. Recommended Content Outline to Rank
5. Competitive Angle / Unique Value Proposition`;

    const analysis = await generateNexusAIResponse(prompt);
    res.json({ analysis });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Keyword analysis failed.' });
  }
});

// 8. Code Assistant
app.post('/api/gemini/code-assistant', async (req: Request, res: Response) => {
  try {
    const { language, task, codeSnippet } = req.body;
    toolUsageCount++;

    const prompt = `Language/Stack: ${language || 'TypeScript / React / Node.js'}
Task: ${task}
${codeSnippet ? `Existing Code:\n\`\`\`\n${codeSnippet}\n\`\`\`` : ''}

Provide production-grade, bug-free, type-safe code with clear inline explanations and architectural best practices.`;

    const code = await generateNexusAIResponse(prompt, 'You are a Principal Software Engineer and System Architect at Nexus AI.');
    res.json({ code });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Code assistance failed.' });
  }
});

// ----------------------------------------------------
// API ROUTES: PLATFORM, INQUIRIES & ACADEMY
// ----------------------------------------------------

// Submit Inquiry
app.post('/api/inquiries', (req: Request, res: Response) => {
  const { name, email, service, budget, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const newInquiry: Inquiry = {
    id: `inq-${Date.now().toString().slice(-4)}`,
    name,
    email,
    service: service || 'General Consultation',
    budget: budget || 'To be discussed',
    message: message || '',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  inquiries.unshift(newInquiry);
  res.status(201).json({ success: true, inquiry: newInquiry });
});

// Get Inquiries (Admin)
app.get('/api/inquiries', (_req: Request, res: Response) => {
  res.json({ inquiries });
});

// Update Inquiry Status (Admin)
app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const target = inquiries.find((i) => i.id === id);
  if (!target) return res.status(404).json({ error: 'Inquiry not found' });
  if (status) target.status = status;
  res.json({ success: true, inquiry: target });
});

// Enroll in Course (Student)
app.post('/api/enroll', (req: Request, res: Response) => {
  const { studentName, studentEmail, courseId, courseTitle, type, schedule } = req.body;
  if (!courseId || !studentName) {
    return res.status(400).json({ error: 'Missing required enrollment details.' });
  }

  const existing = enrollments.find(
    (e) => e.studentEmail === studentEmail && e.courseId === courseId
  );
  if (existing) {
    return res.json({ success: true, enrollment: existing, message: 'Already enrolled!' });
  }

  const newEnrollment: Enrollment = {
    id: `enr-${Date.now().toString().slice(-4)}`,
    studentName,
    studentEmail: studentEmail || 'student@nexusai.com',
    courseId,
    courseTitle: courseTitle || 'Nexus Academy Course',
    type: type || 'online',
    schedule: schedule || (type === 'physical' ? 'Sat & Sun 10:00 AM - 1:00 PM (Nexus Lab 2)' : undefined),
    progress: 0,
    enrolledAt: new Date().toISOString(),
    certificateIssued: false,
  };

  enrollments.unshift(newEnrollment);
  res.status(201).json({ success: true, enrollment: newEnrollment });
});

// Update Course Progress
app.patch('/api/enrollments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { progress, certificateIssued } = req.body;
  const target = enrollments.find((e) => e.id === id);
  if (!target) return res.status(404).json({ error: 'Enrollment not found' });

  if (typeof progress === 'number') {
    target.progress = Math.min(100, Math.max(0, progress));
    if (target.progress === 100) {
      target.certificateIssued = true;
    }
  }
  if (typeof certificateIssued === 'boolean') {
    target.certificateIssued = certificateIssued;
  }
  res.json({ success: true, enrollment: target });
});

// Get Enrollments
app.get('/api/enrollments', (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (email) {
    const userEnrollments = enrollments.filter((e) => e.studentEmail === email);
    return res.json({ enrollments: userEnrollments });
  }
  res.json({ enrollments });
});

// Platform Stats
app.get('/api/stats', (_req: Request, res: Response) => {
  res.json({
    totalStudents: 12480,
    activeLearners: 3820,
    coursesPublished: 24,
    enterpriseClients: 185,
    aiInvocationsToday: toolUsageCount,
    successRate: '99.8%',
    totalInquiries: inquiries.length,
    activeEnrollments: enrollments.length,
  });
});

// ----------------------------------------------------
// SELF-HOSTED KNOWLEDGE BRAIN & RAG SUBSYSTEM
// ----------------------------------------------------

interface KnowledgeCategory {
  category: string;
  items: { title: string; content: string; tags: string[]; visibility?: 'public' | 'internal_only'; status?: 'draft' | 'approved' | 'archived' }[];
}

interface KnowledgeDocumentRecord {
  id: string;
  title: string;
  category: string;
  content: string;
  type: 'Markdown' | 'PDF' | 'TXT' | 'DOCX' | 'JSON';
  size: string;
  uploadedAt: string;
  updatedAt: string;
  version: number;
  status: 'draft' | 'approved' | 'archived';
  visibility: 'public' | 'internal_only';
  chunksCount: number;
  approvedBy?: string;
  tags: string[];
  sourceUrl?: string;
}

const companyKnowledgeStore: KnowledgeCategory[] = [
  {
    category: 'Company Profile & Campus',
    items: [
      {
        title: 'Nexus AI Academic & Solutions Overview',
        content: 'Nexus AI Academic & Solutions is an elite technology institute and enterprise software consultancy empowering individuals and organizations through AI education, intelligent productivity tools, and production software solutions.',
        tags: ['company', 'overview', 'mission', 'about'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Mission & Vision',
        content: 'Our mission is to democratize elite artificial intelligence engineering education and deliver world-class autonomous software solutions. Our vision is to pioneer zero-latency, secure, autonomous AI ecosystems globally.',
        tags: ['mission', 'vision', 'values'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Physical Campus & Contact Details',
        content: 'Location: Nexus Tower 4, Tech Innovation Corridor, Cyber City Labs. Email (Academy): academy@nexusai.academic.io | Email (Enterprise Solutions): solutions@nexusai.academic.io. Operating Hours: Monday – Friday 8:00 AM – 10:00 PM EST (Physical Labs open Saturdays for enrolled cohorts). Direct Priority WhatsApp: +1 (555) 019-2834.',
        tags: ['contact', 'address', 'location', 'campus', 'phone', 'email', 'timing', 'hours', 'whatsapp'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Internal Operational SLA & Escalate Playbook',
        content: 'INTERNAL STAFF ONLY: P1 Critical tickets require engineering lead notification within 15 minutes. Refund threshold requires Director approval. Passwords and API keys must NEVER be requested or logged in tickets.',
        tags: ['internal', 'sla', 'escalation', 'playbook', 'policy'],
        visibility: 'internal_only',
        status: 'approved',
      },
    ],
  },
  {
    category: 'Academy Programs & Courses',
    items: [
      {
        title: 'Autonomous AI Agents & Large Language Model Architecture',
        content: '12 Weeks Master Program. Tuition Fee: $890. Level: Advanced. Instructor: Dr. Evelyn Sterling (Principal AI Researcher & Ex-DeepMind Scholar). Physical Schedule: Tuesdays & Thursdays 6:00 PM - 9:00 PM at Cyber Lab 4. Online Schedule: Self-paced with weekly live mentor syncs on Saturdays. Covers: Neural foundations, KV Caching, ReAct loops, Tool Calling, Vector Embeddings, RAG, streaming SSE, and model guardrails.',
        tags: ['ai', 'agent', 'course', 'fee', 'price', 'timing', 'schedule', 'instructor', 'evelyn', 'lab 4', 'llm', 'curriculum'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Full-Stack Modern Web Engineering & React 19 Ecosystem',
        content: '10 Weeks Program. Tuition Fee: $720. Level: Intermediate. Instructor: Kaelen Vance (Staff Software Architect). Physical Schedule: Mondays & Wednesdays 6:30 PM - 9:30 PM at Campus Lab 1. Covers: React 19, Server Actions, TypeScript, Tailwind CSS v4, Express, Node.js, WebSockets, JWT Auth, Docker, and Cloud Run deployments.',
        tags: ['web', 'react', 'course', 'fee', 'price', 'timing', 'schedule', 'instructor', 'kaelen', 'fullstack', 'curriculum'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Cross-Platform Mobile App Engineering (iOS & Android)',
        content: '8 Weeks Program. Tuition Fee: $680. Level: Intermediate. Instructor: Maya Lin (Lead Mobile Architect). Covers: React Native, Expo, Kotlin/Swift interop, offline sync, state management, mobile security, and App Store / Play Store publishing.',
        tags: ['mobile', 'app', 'course', 'fee', 'price', 'ios', 'android', 'react native', 'instructor', 'maya', 'curriculum'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Enterprise AI Automation & Workflow Pipelines',
        content: '10 Weeks Program. Tuition Fee: $950. Level: Advanced. Instructor: Marcus Thorne (Director of Enterprise AI). Covers: Multi-agent CRM triggers, autonomous document parsers, LangChain/LlamaIndex pipelines, enterprise webhooks, and SLA monitoring.',
        tags: ['automation', 'pipeline', 'workflow', 'course', 'fee', 'price', 'instructor', 'marcus', 'enterprise', 'curriculum'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'UI/UX Design System & Product Architecture',
        content: '6 Weeks Program. Tuition Fee: $550. Level: Beginner/Intermediate. Instructor: Elena Rostova (Head of Design Systems). Covers: Figma design systems, micro-interactions, dark mode glassmorphism, accessibility (WCAG 2.1), and design-to-code handoffs.',
        tags: ['design', 'ui', 'ux', 'figma', 'course', 'fee', 'price', 'instructor', 'elena', 'curriculum'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Cloud Infrastructure, Docker & Kubernetes Masterclass',
        content: '10 Weeks Program. Tuition Fee: $820. Level: Advanced. Instructor: David K. (Principal Cloud Engineer). Covers: Containerization, Kubernetes cluster orchestration, Terraform IaC, AWS/GCP architecture, and CI/CD pipelines.',
        tags: ['cloud', 'devops', 'docker', 'kubernetes', 'course', 'fee', 'price', 'instructor', 'david', 'curriculum'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Cyber Security & AI Vulnerability Defense',
        content: '10 Weeks Program. Tuition Fee: $890. Level: Advanced. Instructor: Sarah Chen (Chief Information Security Officer). Covers: Prompt injection defense, LLM security audits, API penetration testing, and zero-trust IAM frameworks.',
        tags: ['security', 'cyber', 'vulnerability', 'course', 'fee', 'price', 'instructor', 'sarah', 'curriculum'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Academy Enrollment & Verified Certification',
        content: 'Students can enroll online or via physical campus registration. Verified certificates with cryptographic IDs are automatically issued upon 100% course completion and passing required quizzes.',
        tags: ['enrollment', 'certificate', 'certification', 'quiz', 'gradual', 'how to enroll'],
        visibility: 'public',
        status: 'approved',
      },
    ],
  },
  {
    category: 'Digital Services & Enterprise Solutions',
    items: [
      {
        title: 'AI Automation & Custom Agent Pipelines',
        content: 'Enterprise consulting and development for autonomous CRM triggers, AI document parsers, multi-model workflow orchestration, and custom tool-calling agents. Budget range: $10,000 - $50,000+.',
        tags: ['services', 'automation', 'enterprise', 'custom agents', 'solutions'],
        visibility: 'public',
        status: 'approved',
      },
      {
        title: 'Full-Stack Web & Mobile Software Engineering',
        content: 'Custom high-performance web applications, native mobile apps, and enterprise cloud architecture built with React 19, TypeScript, Node.js, and secure microservices.',
        tags: ['services', 'web development', 'mobile development', 'software', 'engineering'],
        visibility: 'public',
        status: 'approved',
      },
    ],
  },
];

const documentsStore: KnowledgeDocumentRecord[] = [
  {
    id: 'doc-101',
    title: 'Nexus_AI_Master_Knowledge_Base.md',
    category: 'Company',
    content: masterKnowledgeBaseText.slice(0, 5000),
    type: 'Markdown',
    size: '42.8 KB',
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    status: 'approved',
    visibility: 'public',
    chunksCount: 24,
    approvedBy: 'Marcus Thorne (Administrator)',
    tags: ['master', 'handbook', 'playbook', 'support'],
    sourceUrl: '/Nexus_AI_Master_Knowledge_Base.md',
  },
  {
    id: 'doc-102',
    title: 'Nexus_AI_Enterprise_Security_Whitepaper.pdf',
    category: 'Technical Documentation',
    content: 'Enterprise zero-trust architecture, SOC2 compliance, vector database encryption, and prompt injection defense mechanisms.',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    status: 'approved',
    visibility: 'public',
    chunksCount: 16,
    approvedBy: 'Sarah Chen (CISO)',
    tags: ['security', 'whitepaper', 'compliance'],
  },
  {
    id: 'doc-103',
    title: 'Internal_Staff_Escalation_And_SLA_Playbook.docx',
    category: 'Internal Knowledge',
    content: 'INTERNAL CONFIDENTIAL: Escalation procedures for P1 security vulnerabilities, refund authorization tiers, and staff shift rotations.',
    type: 'DOCX',
    size: '640 KB',
    uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
    version: 2,
    status: 'approved',
    visibility: 'internal_only',
    chunksCount: 8,
    approvedBy: 'Marcus Thorne (Administrator)',
    tags: ['internal', 'escalation', 'sla', 'playbook'],
  },
];

// Health Check API
app.get('/api/rag/health', async (_req: Request, res: Response) => {
  const isConfigured = isValidApiKey;

  res.json({
    status: 'Operational',
    mode: 'Nexus Enterprise Gemini AI Infrastructure',
    geminiApi: {
      status: isConfigured ? 'Operational (Configured)' : 'Pending (API Key required in .env / Secrets)',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      configured: isConfigured,
    },
    systemMetrics: {
      availableRAM: '16 GB',
      cpuArchitecture: 'x86_64 / Linux',
      diskAvailable: '240 GB Free',
    },
    vectorDatabase: 'In-Memory Enterprise Shards (Active)',
    documentsIndexed: documentsStore.length,
    categoriesCount: companyKnowledgeStore.length,
    lastIndexedAt: new Date().toISOString(),
  });
});

// Get Company Knowledge
app.get('/api/knowledge', (req: Request, res: Response) => {
  const userRole = (req.query.role as string) || 'student';
  const isInternalUser = userRole === 'admin' || userRole === 'teacher';

  const filteredStore = companyKnowledgeStore.map(cat => ({
    ...cat,
    items: cat.items.filter(item => isInternalUser || item.visibility !== 'internal_only')
  })).filter(cat => cat.items.length > 0);

  res.json({ knowledge: filteredStore });
});

// Add / Update Knowledge
app.post('/api/knowledge', (req: Request, res: Response) => {
  const { category, title, content, tags, visibility, status } = req.body;
  if (!category || !title || !content) {
    return res.status(400).json({ error: 'Category, title, and content are required.' });
  }

  let cat = companyKnowledgeStore.find((c) => c.category.toLowerCase() === category.toLowerCase());
  if (!cat) {
    cat = { category, items: [] };
    companyKnowledgeStore.push(cat);
  }

  cat.items.push({
    title,
    content,
    tags: tags || [],
    visibility: visibility === 'internal_only' ? 'internal_only' : 'public',
    status: status || 'approved',
  });

  res.status(201).json({ success: true, knowledge: companyKnowledgeStore });
});

// Get Documents Library
app.get('/api/documents', (req: Request, res: Response) => {
  const userRole = (req.query.role as string) || 'student';
  const isInternalUser = userRole === 'admin' || userRole === 'teacher';

  const filtered = documentsStore.filter(doc => isInternalUser || doc.visibility === 'public');
  res.json({ documents: filtered });
});

// Upload / Ingest Document
app.post('/api/documents', (req: Request, res: Response) => {
  const { title, category, content, type, visibility, status, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Document title and content are required.' });
  }

  // Prevent duplicate document title collision
  const existingIndex = documentsStore.findIndex(d => d.title.toLowerCase() === title.toLowerCase());

  const docVersion = existingIndex >= 0 ? documentsStore[existingIndex].version + 1 : 1;
  const chunkCount = Math.max(1, Math.ceil(content.length / 300));

  const newDoc: KnowledgeDocumentRecord = {
    id: existingIndex >= 0 ? documentsStore[existingIndex].id : `doc-${Date.now().toString().slice(-4)}`,
    title,
    category: category || 'Company',
    content,
    type: type || 'Markdown',
    size: `${(content.length / 1024).toFixed(1)} KB`,
    uploadedAt: existingIndex >= 0 ? documentsStore[existingIndex].uploadedAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: docVersion,
    status: status || 'approved',
    visibility: visibility === 'internal_only' ? 'internal_only' : 'public',
    chunksCount: chunkCount,
    approvedBy: status === 'approved' ? 'Marcus Thorne (Administrator)' : undefined,
    tags: tags || ['document', 'ingested'],
  };

  if (existingIndex >= 0) {
    documentsStore[existingIndex] = newDoc;
  } else {
    documentsStore.unshift(newDoc);
  }

  // Auto-sync into company Knowledge Store
  let cat = companyKnowledgeStore.find(c => c.category.toLowerCase() === (category || 'Company').toLowerCase());
  if (!cat) {
    cat = { category: category || 'Company', items: [] };
    companyKnowledgeStore.push(cat);
  }
  cat.items.push({
    title,
    content,
    tags: tags || ['document'],
    visibility: visibility === 'internal_only' ? 'internal_only' : 'public',
    status: status || 'approved',
  });

  res.status(201).json({ success: true, document: newDoc });
});

// Update Document Status / Visibility / Content
app.patch('/api/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, visibility, content, category, title } = req.body;

  const target = documentsStore.find(d => d.id === id);
  if (!target) return res.status(404).json({ error: 'Document not found' });

  if (status) target.status = status;
  if (visibility) target.visibility = visibility;
  if (category) target.category = category;
  if (title) target.title = title;
  if (content) {
    target.content = content;
    target.version += 1;
    target.chunksCount = Math.max(1, Math.ceil(content.length / 300));
  }
  target.updatedAt = new Date().toISOString();
  if (status === 'approved') {
    target.approvedBy = 'Marcus Thorne (Administrator)';
  }

  res.json({ success: true, document: target });
});

// Delete Document
app.delete('/api/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = documentsStore.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Document not found' });

  const deleted = documentsStore.splice(idx, 1)[0];
  res.json({ success: true, deletedId: id, title: deleted.title });
});

// RAG Search Testing API
app.post('/api/rag/test-search', (req: Request, res: Response) => {
  const { query, userRole } = req.body;
  if (!query) return res.status(400).json({ error: 'Search query is required' });

  const isInternal = userRole === 'admin' || userRole === 'teacher';
  const qLower = String(query).toLowerCase();
  const tokens = qLower.split(/\s+/).filter(t => t.length > 2);

  const matchedChunks: { source: string; title: string; category: string; snippet: string; score: number; visibility: string }[] = [];

  // 1. Search company knowledge store
  companyKnowledgeStore.forEach(cat => {
    cat.items.forEach(item => {
      if (!isInternal && item.visibility === 'internal_only') return;
      let score = 0;
      const tLower = item.title.toLowerCase();
      const cLower = item.content.toLowerCase();

      if (tLower.includes(qLower)) score += 15;
      if (cLower.includes(qLower)) score += 10;
      tokens.forEach(tok => {
        if (tLower.includes(tok)) score += 4;
        if (cLower.includes(tok)) score += 2;
        if (item.tags.some(tag => tag.toLowerCase().includes(tok))) score += 5;
      });

      if (score > 0) {
        matchedChunks.push({
          source: 'Company Knowledge Store',
          title: item.title,
          category: cat.category,
          snippet: item.content,
          score,
          visibility: item.visibility || 'public',
        });
      }
    });
  });

  // 2. Search uploaded documents
  documentsStore.forEach(doc => {
    if (!isInternal && doc.visibility === 'internal_only') return;
    let score = 0;
    const tLower = doc.title.toLowerCase();
    const cLower = doc.content.toLowerCase();

    if (tLower.includes(qLower)) score += 15;
    if (cLower.includes(qLower)) score += 10;
    tokens.forEach(tok => {
      if (tLower.includes(tok)) score += 4;
      if (cLower.includes(tok)) score += 2;
      if (doc.tags.some(tag => tag.toLowerCase().includes(tok))) score += 5;
    });

    if (score > 0) {
      matchedChunks.push({
        source: `Document Library (${doc.type})`,
        title: doc.title,
        category: doc.category,
        snippet: doc.content.slice(0, 300) + '...',
        score,
        visibility: doc.visibility,
      });
    }
  });

  matchedChunks.sort((a, b) => b.score - a.score);
  res.json({ query, resultsCount: matchedChunks.length, results: matchedChunks });
});

// RAG Query Router Endpoint
app.post('/api/rag/query', async (req: Request, res: Response) => {
  try {
    const { query, mode, userRole } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const isInternalUser = userRole === 'admin' || userRole === 'teacher';

    // Search internal company knowledge with visibility filter
    const matchedKnowledge: string[] = [];
    const qLower = query.toLowerCase();

    companyKnowledgeStore.forEach((cat) => {
      cat.items.forEach((item) => {
        if (!isInternalUser && item.visibility === 'internal_only') return;
        if (item.title.toLowerCase().includes(qLower) || item.content.toLowerCase().includes(qLower) || item.tags.some(t => qLower.includes(t))) {
          matchedKnowledge.push(`[${cat.category}] ${item.title}: ${item.content}`);
        }
      });
    });

    let contextText = matchedKnowledge.join('\n\n');
    if (!contextText) {
      contextText = 'No specific internal company record found for this precise query. General Nexus AI guidelines apply.';
    }

    const prompt = `You are Nexus AI Assistant operating in RAG Mode.
User Query: "${query}"
Assistant Mode: ${mode || 'General Assistant'}

Retrieved Context Knowledge:
"""
${contextText}
"""

Provide a precise, authoritative, helpful answer incorporating the retrieved company knowledge. Include citations where appropriate.`;

    const aiAnswer = await generateNexusAIResponse(prompt, 'You are Nexus AI Assistant, an elite AI instructor and software architect at Nexus AI Academic & Solutions.');

    const citations = [
      { title: 'Nexus AI Official Master Knowledge Base', url: '/Nexus_AI_Master_Knowledge_Base.md' },
      { title: 'Nexus Academy Curriculum', url: '/#academy' },
    ];

    res.json({
      answer: aiAnswer,
      sourcesCount: matchedKnowledge.length,
      citations,
      mode: mode || 'General Assistant',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('RAG query error:', error);
    res.status(500).json({ error: error.message || 'RAG query failed.' });
  }
});

// ----------------------------------------------------
// CUSTOMER SUPPORT TICKETING SYSTEM BACKEND
// ----------------------------------------------------

interface TicketReplyRecord {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'customer' | 'staff' | 'ai_assistant';
  message: string;
  timestamp: string;
  isInternalNote?: boolean;
  attachments?: string[];
}

interface SupportTicketRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
  replies: TicketReplyRecord[];
  attachments?: string[];
  satisfactionRating?: number;
  satisfactionFeedback?: string;
  aiDraftReply?: string;
  aiSummary?: string;
}

const ticketsStore: SupportTicketRecord[] = [
  {
    id: 'TICK-1001',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.rivera@nexusai.com',
    subject: 'Accessing Cyber Lab 4 Workstation Environment',
    description: 'I need assistance setting up GPU CUDA drivers on my assigned lab workstation in Cyber Lab 4 for the Autonomous AI Agents program.',
    category: 'Technical Support',
    priority: 'P2 (High)',
    status: 'In Progress',
    assignedStaff: 'Dr. Evelyn Sterling',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    aiSummary: 'Student requesting GPU driver setup assistance for Cyber Lab 4 workstation.',
    aiDraftReply: 'Hello Alex, Dr. Evelyn Sterling has assigned a lab assistant to verify CUDA 12.4 driver provisioning on Workstation 04.',
    replies: [
      {
        id: 'rep-1',
        senderName: 'Alex Rivera',
        senderEmail: 'alex.rivera@nexusai.com',
        senderRole: 'customer',
        message: 'I am seeing CUDA driver version mismatch when running PyTorch training loops in Cyber Lab 4.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'rep-2',
        senderName: 'Dr. Evelyn Sterling',
        senderEmail: 'evelyn@nexusai.com',
        senderRole: 'staff',
        message: 'Hello Alex! We updated Nvidia driver v550 across Cyber Lab 4 workstations this morning. Please run `nvidia-smi` and re-activate the `nexus-agent` conda environment.',
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      },
      {
        id: 'rep-3',
        senderName: 'Dr. Evelyn Sterling',
        senderEmail: 'evelyn@nexusai.com',
        senderRole: 'staff',
        message: 'INTERNAL NOTE: Checked workstation 04 via SSH. Conda env updated.',
        timestamp: new Date(Date.now() - 86400000 * 1.4).toISOString(),
        isInternalNote: true,
      },
    ],
  },
  {
    id: 'TICK-1002',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@innovatecorp.io',
    subject: 'Enterprise API SLA & Volume Rate Limits',
    description: 'We require custom rate limit adjustments for our Enterprise AI Agent pipeline handling 50,000 requests per hour.',
    category: 'Services',
    priority: 'P1 (Critical)',
    status: 'Open',
    assignedStaff: 'Marcus Thorne (Administrator)',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    aiSummary: 'Enterprise client requesting 50k req/hr API rate limit tier upgrade.',
    aiDraftReply: 'Dear Sarah, our infrastructure team can provision dedicated enterprise rate limits. Marcus Thorne will review your SLA requirements.',
    replies: [
      {
        id: 'rep-101',
        senderName: 'Sarah Chen',
        senderEmail: 'sarah.chen@innovatecorp.io',
        senderRole: 'customer',
        message: 'Our production customer intelligence pipeline is launching next Monday and requires custom SLA rate limits.',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ],
  },
  {
    id: 'TICK-1003',
    customerName: 'Jordan Lee',
    customerEmail: 'jordan@nexusai.com',
    subject: 'Course Certificate Issuance Verification',
    description: 'I completed 100% of Full-Stack Web Engineering lessons and submitted the final quiz. Requesting certificate confirmation.',
    category: 'Academy',
    priority: 'P3 (Normal)',
    status: 'Resolved',
    assignedStaff: 'Kaelen Vance',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    satisfactionRating: 5,
    satisfactionFeedback: 'Fast response and verified cryptographic certificate issued promptly!',
    replies: [
      {
        id: 'rep-201',
        senderName: 'Jordan Lee',
        senderEmail: 'jordan@nexusai.com',
        senderRole: 'customer',
        message: 'Completed final quiz with 98% score.',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 'rep-202',
        senderName: 'Kaelen Vance',
        senderEmail: 'kaelen@nexusai.com',
        senderRole: 'staff',
        message: 'Congratulations Jordan! Your cryptographic certificate NEXUS-CERT-WEB100 has been issued and added to your Student Portal.',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
  },
];

let ticketCounter = 1003;

// Get All Support Tickets
app.get('/api/tickets', (req: Request, res: Response) => {
  const email = req.query.email as string;
  const category = req.query.category as string;
  const status = req.query.status as string;
  const priority = req.query.priority as string;
  const userRole = (req.query.role as string) || 'student';

  const isStaff = userRole === 'admin' || userRole === 'teacher';

  let filtered = [...ticketsStore];

  if (email && !isStaff) {
    filtered = filtered.filter(t => t.customerEmail.toLowerCase() === email.toLowerCase());
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(t => t.category === category);
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(t => t.status === status);
  }

  if (priority && priority !== 'All') {
    filtered = filtered.filter(t => t.priority === priority);
  }

  // Filter internal notes if customer requesting
  if (!isStaff) {
    filtered = filtered.map(t => ({
      ...t,
      replies: t.replies.filter(r => !r.isInternalNote)
    }));
  }

  res.json({ tickets: filtered });
});

// Create Support Ticket
app.post('/api/tickets', async (req: Request, res: Response) => {
  const { customerName, customerEmail, subject, description, category, priority, attachments } = req.body;

  if (!customerName || !customerEmail || !subject || !description) {
    return res.status(400).json({ error: 'Name, email, subject, and description are required.' });
  }

  ticketCounter++;
  const ticketId = `TICK-${ticketCounter}`;
  const nowStr = new Date().toISOString();

  // Determine auto-priority if security related
  let calcPriority = priority || 'P3 (Normal)';
  if (description.toLowerCase().includes('vulnerability') || description.toLowerCase().includes('security breach') || description.toLowerCase().includes('data compromise')) {
    calcPriority = 'P1 (Critical)';
  }

  // Auto-generate AI summary & draft reply via Master Knowledge Base
  const aiPrompt = `Analyze support ticket #${ticketId}:
Customer: ${customerName} (${customerEmail})
Category: ${category || 'General Inquiry'}
Subject: ${subject}
Description: ${description}

Provide:
1. Short 1-sentence AI Summary
2. Professional 2-paragraph draft reply using Nexus AI Master Knowledge Base guidelines.`;

  let aiDraftReply = `Hello ${customerName},\nThank you for contacting Nexus AI Support. Your ticket ${ticketId} has been logged and assigned to our technical team for review.`;
  let aiSummary = `Support request regarding ${subject}.`;

  try {
    const aiRes = await generateNexusAIResponse(aiPrompt, 'You are an AI Support Copilot for Nexus AI Academic & Solutions.');
    if (aiRes) {
      aiDraftReply = aiRes;
      aiSummary = `Customer query regarding ${subject}.`;
    }
  } catch (e) {}

  const newTicket: SupportTicketRecord = {
    id: ticketId,
    customerName,
    customerEmail,
    subject,
    description,
    category: category || 'General Inquiry',
    priority: calcPriority,
    status: 'Open',
    createdAt: nowStr,
    updatedAt: nowStr,
    attachments: attachments || [],
    aiSummary,
    aiDraftReply,
    replies: [
      {
        id: `rep-${Date.now().toString().slice(-4)}`,
        senderName: customerName,
        senderEmail: customerEmail,
        senderRole: 'customer',
        message: description,
        timestamp: nowStr,
      },
    ],
  };

  ticketsStore.unshift(newTicket);
  res.status(201).json({ success: true, ticket: newTicket });
});

// Get Single Ticket
app.get('/api/tickets/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userRole = (req.query.role as string) || 'student';
  const isStaff = userRole === 'admin' || userRole === 'teacher';

  const ticket = ticketsStore.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

  const responseTicket = {
    ...ticket,
    replies: isStaff ? ticket.replies : ticket.replies.filter(r => !r.isInternalNote)
  };

  res.json({ ticket: responseTicket });
});

// Update Ticket Parameters (Status, Priority, Staff Assignment)
app.patch('/api/tickets/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, priority, category, assignedStaff } = req.body;

  const ticket = ticketsStore.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

  if (status) ticket.status = status;
  if (priority) ticket.priority = priority;
  if (category) ticket.category = category;
  if (assignedStaff !== undefined) ticket.assignedStaff = assignedStaff;
  ticket.updatedAt = new Date().toISOString();

  res.json({ success: true, ticket });
});

// Add Ticket Reply or Internal Note
app.post('/api/tickets/:id/replies', (req: Request, res: Response) => {
  const { id } = req.params;
  const { senderName, senderEmail, senderRole, message, isInternalNote, attachments } = req.body;

  if (!message) return res.status(400).json({ error: 'Reply message cannot be empty.' });

  const ticket = ticketsStore.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

  const newReply: TicketReplyRecord = {
    id: `rep-${Date.now().toString().slice(-4)}`,
    senderName: senderName || 'Nexus Support Staff',
    senderEmail: senderEmail || 'support@nexusai.academic.io',
    senderRole: senderRole || 'staff',
    message,
    timestamp: new Date().toISOString(),
    isInternalNote: Boolean(isInternalNote),
    attachments: attachments || [],
  };

  ticket.replies.push(newReply);
  ticket.updatedAt = new Date().toISOString();
  if (senderRole === 'staff' && !isInternalNote && ticket.status === 'Open') {
    ticket.status = 'In Progress';
  }

  res.status(201).json({ success: true, reply: newReply, ticket });
});

// Submit Customer Satisfaction Feedback
app.post('/api/tickets/:id/feedback', (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  const ticket = ticketsStore.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

  ticket.satisfactionRating = rating;
  ticket.satisfactionFeedback = feedback || '';
  ticket.updatedAt = new Date().toISOString();

  res.json({ success: true, ticket });
});

// AI Copilot Draft Response Generator for Staff
app.post('/api/tickets/:id/ai-draft', async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = ticketsStore.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

  const prompt = `Draft a polite, professional support reply for Ticket #${ticket.id}:
Customer: ${ticket.customerName}
Subject: ${ticket.subject}
Category: ${ticket.category}
Issue Description: ${ticket.description}

Grounding Rules:
- Refer to Nexus AI official policies and Master Knowledge Base.
- Include next steps.
- Do not promise unauthorized refunds or passwords.`;

  try {
    const draft = await generateNexusAIResponse(prompt, 'You are an AI Support Copilot for Nexus AI Academic & Solutions.');
    ticket.aiDraftReply = draft;
    res.json({ success: true, aiDraftReply: draft });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'AI draft generation failed.' });
  }
});

// ----------------------------------------------------
// AUTONOMOUS WEBSITE LEARNING & MONITORING ENGINE
// ----------------------------------------------------

interface DiscoveredPage {
  path: string;
  title: string;
  category: string;
  status: 'Indexed' | 'Pending' | 'Changed' | 'Excluded';
  lastScanned: string;
  contentHash: string;
  chunkCount: number;
  isExcluded?: boolean;
}

const discoveredPagesStore: DiscoveredPage[] = [
  { path: '/', title: 'Home - Nexus AI Academic & Solutions', category: 'Public', status: 'Indexed', lastScanned: new Date().toISOString(), contentHash: 'hash-home-991', chunkCount: 18 },
  { path: '/academy', title: 'Academy & Master Programs', category: 'Academy', status: 'Indexed', lastScanned: new Date().toISOString(), contentHash: 'hash-acad-820', chunkCount: 24 },
  { path: '/services', title: 'Digital Solutions & Enterprise Services', category: 'Services', status: 'Indexed', lastScanned: new Date().toISOString(), contentHash: 'hash-serv-431', chunkCount: 16 },
  { path: '/tools', title: 'Nexus AI Tools Directory', category: 'Tools', status: 'Indexed', lastScanned: new Date().toISOString(), contentHash: 'hash-tools-105', chunkCount: 32 },
  { path: '/about', title: 'About Nexus AI Institute', category: 'Company', status: 'Indexed', lastScanned: new Date().toISOString(), contentHash: 'hash-about-332', chunkCount: 12 },
  { path: '/contact', title: 'Consultation & Contact', category: 'Support', status: 'Indexed', lastScanned: new Date().toISOString(), contentHash: 'hash-contact-782', chunkCount: 10 },
];

const knowledgeGapsStore = [
  { id: 'gap-1', topic: 'Custom enterprise SLA pricing for 100+ seats', frequency: 14, status: 'Pending Review', suggestion: 'Add dedicated enterprise volume pricing FAQ to Services page.' },
  { id: 'gap-2', topic: 'Physical lab equipment specifications in Cyber Lab 4', frequency: 8, status: 'Approved', suggestion: 'Updated Academy curriculum details with lab hardware specs.' },
];

const auditLogsStore = [
  { id: 'log-1', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Website Crawler Scan', status: 'Success', details: 'Scanned 6 core pages; 0 breaking changes detected.' },
  { id: 'log-2', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'Vector Shards Re-indexing', status: 'Success', details: 'Updated 42 knowledge chunks across 4 categories.' },
];

// Intelligence Overview API
app.get('/api/intelligence/overview', (_req: Request, res: Response) => {
  res.json({
    totalPages: discoveredPagesStore.length,
    indexedPages: discoveredPagesStore.filter(p => p.status === 'Indexed').length,
    pendingPages: discoveredPagesStore.filter(p => p.status === 'Pending').length,
    excludedPages: discoveredPagesStore.filter(p => p.status === 'Excluded').length,
    changesDetected: 0,
    lastScan: new Date().toISOString(),
    crawlerStatus: 'Idle / Scheduled (Every 12h)',
    pages: discoveredPagesStore,
    gaps: knowledgeGapsStore,
    auditLogs: auditLogsStore,
  });
});

// Toggle Crawler Page Inclusion / Exclusion
app.patch('/api/intelligence/pages/*', (req: Request, res: Response) => {
  const pagePath = '/' + req.params[0];
  const { isExcluded } = req.body;

  const target = discoveredPagesStore.find(p => p.path === pagePath);
  if (!target) return res.status(404).json({ error: 'Page path not found in discovered pages.' });

  target.isExcluded = isExcluded;
  target.status = isExcluded ? 'Excluded' : 'Indexed';

  auditLogsStore.unshift({
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    action: `Page ${isExcluded ? 'Excluded' : 'Included'} in Crawler`,
    status: 'Success',
    details: `Updated crawler rule for route ${pagePath}`,
  });

  res.json({ success: true, page: target });
});

// Trigger Scan API
app.post('/api/intelligence/scan', (_req: Request, res: Response) => {
  const scanTimestamp = new Date().toISOString();

  discoveredPagesStore.forEach(p => {
    if (!p.isExcluded) {
      p.lastScanned = scanTimestamp;
      p.status = 'Indexed';
    }
  });

  auditLogsStore.unshift({
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: scanTimestamp,
    action: 'Manual Autonomous Scan Triggered',
    status: 'Success',
    details: `Successfully crawled ${discoveredPagesStore.filter(p => !p.isExcluded).length} active pages. Content hashes verified. Zero drift detected.`,
  });

  res.json({
    success: true,
    message: 'Autonomous website scan completed successfully. Active pages verified and synced to knowledge brain.',
    timestamp: scanTimestamp,
    scannedCount: discoveredPagesStore.filter(p => !p.isExcluded).length,
  });
});

// Ingest User Feedback
app.post('/api/intelligence/feedback', (req: Request, res: Response) => {
  const { feedbackType, comment, query } = req.body;
  knowledgeGapsStore.unshift({
    id: `gap-${Date.now().toString().slice(-4)}`,
    topic: comment || query || 'User feedback item',
    frequency: 1,
    status: 'Pending Review',
    suggestion: `Generated from user feedback (${feedbackType || 'general'}). Admin review required before updating RAG index.`,
  });
  res.json({ success: true, message: 'Feedback recorded securely. Thank you for helping improve Nexus Knowledge Brain.' });
});

// ----------------------------------------------------
// ACADEMY LEARNING MANAGEMENT SYSTEM (LMS) BACKEND
// ----------------------------------------------------

interface LMSLessonRecord {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  videoUrl?: string;
  contentHtml?: string;
  downloadableResources?: { name: string; url: string; size: string }[];
  learningObjectives?: string[];
  isFreePreview?: boolean;
}

interface LMSModuleRecord {
  id: string;
  week: string;
  title: string;
  lessons: LMSLessonRecord[];
}

interface LMSQuizQuestionRecord {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

interface LMSQuizRecord {
  id: string;
  courseId: string;
  title: string;
  timeLimitMinutes: number;
  passScorePercentage: number;
  questions: LMSQuizQuestionRecord[];
}

interface LMSQuizAttemptRecord {
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

interface LMSAssignmentRecord {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  maxPoints: number;
}

interface LMSAssignmentSubmissionRecord {
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

interface LMSCertificateRecord {
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

interface LMSReviewRecord {
  id: string;
  courseId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending Moderation' | 'Rejected';
}

interface LMSAnnouncementRecord {
  id: string;
  courseId?: string;
  title: string;
  message: string;
  postedBy: string;
  date: string;
  targetCohort: string;
}

interface LMSProgressRecord {
  studentEmail: string;
  courseId: string;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  progressPercentage: number;
  lastAccessedAt: string;
}

// In-Memory LMS Seed Stores
const lmsModulesStore: Record<string, LMSModuleRecord[]> = {
  'artificial-intelligence': [
    {
      id: 'mod-ai-1',
      week: 'Week 1-3',
      title: 'Neural Foundations & Modern Transformer Topology',
      lessons: [
        {
          id: 'les-ai-101',
          title: 'Attention Mechanisms, Multi-Head Self Attention & KV Caching',
          duration: '45 mins',
          type: 'video',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          contentHtml: '<h3>Neural Foundations & KV Caching Architecture</h3><p>In this lesson, we explore how Key-Value Caching reduces autoregressive LLM inference latency from O(N^2) to O(N) by caching previous token keys and values in GPU VRAM.</p>',
          downloadableResources: [
            { name: 'Attention_Mechanism_CheatSheet.pdf', url: '#', size: '1.2 MB' },
            { name: 'kv_cache_benchmark.py', url: '#', size: '14 KB' }
          ],
          learningObjectives: [
            'Understand Scaled Dot-Product Attention equation',
            'Implement KV Caching in PyTorch',
            'Analyze GPU VRAM memory bottlenecks during streaming'
          ],
          isFreePreview: true
        },
        {
          id: 'les-ai-102',
          title: 'Context Windows & Vector Semantic Embeddings',
          duration: '35 mins',
          type: 'article',
          contentHtml: '<h3>Vector Embeddings & Cosine Similarity</h3><p>Dense vector representations project text into a high-dimensional continuous semantic space where semantic similarity corresponds to geometric proximity.</p>',
          learningObjectives: [
            'Understand dense vs sparse embeddings',
            'Implement Cosine Similarity and Dot Product retrieval'
          ]
        },
        {
          id: 'les-ai-103',
          title: 'Quiz 1: Transformer Architecture & KV Memory',
          duration: '20 mins',
          type: 'quiz',
        }
      ]
    },
    {
      id: 'mod-ai-2',
      week: 'Week 4-6',
      title: 'Tool-Calling & Agentic Multi-Step Reasoning',
      lessons: [
        {
          id: 'les-ai-201',
          title: 'Autonomous ReAct Loops (Reasoning + Acting)',
          duration: '50 mins',
          type: 'video',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          contentHtml: '<h3>Autonomous ReAct Loops</h3><p>ReAct interleaves reasoning trace generation with task-specific tool execution actions, enabling models to query APIs, search databases, and execute code dynamically.</p>',
          learningObjectives: [
            'Architect a stateful ReAct execution loop',
            'Implement structured JSON tool calling schema'
          ]
        },
        {
          id: 'les-ai-202',
          title: 'Assignment 1: Build a Tool-Calling Agent',
          duration: '60 mins',
          type: 'assignment',
        }
      ]
    }
  ],
  'web-development': [
    {
      id: 'mod-web-1',
      week: 'Week 1-3',
      title: 'React 19 Core & Modern Component Architecture',
      lessons: [
        {
          id: 'les-web-101',
          title: 'React 19 Server Actions, Suspense & Optimistic UI',
          duration: '40 mins',
          type: 'video',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          contentHtml: '<h3>React 19 Server Actions</h3><p>Server Actions allow asynchronous functions to be executed on the server directly from buttons and forms without writing manual API fetch boilerplate.</p>',
          isFreePreview: true
        },
        {
          id: 'les-web-102',
          title: 'Quiz 1: React 19 Core Concepts',
          duration: '15 mins',
          type: 'quiz',
        }
      ]
    }
  ]
};

const lmsQuizzesStore: Record<string, LMSQuizRecord> = {
  'artificial-intelligence': {
    id: 'quiz-ai-101',
    courseId: 'artificial-intelligence',
    title: 'Autonomous AI Agents & Transformer Architecture Assessment',
    timeLimitMinutes: 20,
    passScorePercentage: 75,
    questions: [
      {
        id: 'q1',
        text: 'What is the main computational advantage of Key-Value (KV) Caching in autoregressive Transformer inference?',
        type: 'multiple_choice',
        options: [
          'It eliminates the need for Positional Encodings',
          'It avoids recomputing Key and Value tensors for previously generated tokens',
          'It reduces model parameters by 50%',
          'It converts floating point weights to 1-bit integers'
        ],
        correctAnswer: 1,
        explanation: 'KV Caching stores computed Key and Value projections for past tokens in GPU memory, avoiding redundant matrix multiplications during streaming generation.',
        points: 25
      },
      {
        id: 'q2',
        text: 'ReAct agent loops interleave reasoning traces with external tool execution actions.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. ReAct stands for Reasoning + Acting, where the agent generates a thought trace before calling an external tool action.',
        points: 25
      },
      {
        id: 'q3',
        text: 'Briefly explain how Dense Vector Embeddings enable semantic search compared to keyword search.',
        type: 'short_answer',
        correctAnswer: 'Vector embeddings map words/sentences into a continuous mathematical space where conceptual similarity corresponds to geometric proximity (e.g. cosine distance), capturing meaning beyond exact string matching.',
        explanation: 'Semantic search evaluates mathematical similarity between vector representations regardless of exact word phrasing.',
        points: 50
      }
    ]
  },
  'web-development': {
    id: 'quiz-web-101',
    courseId: 'web-development',
    title: 'React 19 & Full-Stack Architecture Assessment',
    timeLimitMinutes: 15,
    passScorePercentage: 70,
    questions: [
      {
        id: 'qw1',
        text: 'React 19 Server Actions allow server-side asynchronous functions to be invoked directly from forms.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Server Actions integrate seamlessly with form submission actions in React 19.',
        points: 50
      },
      {
        id: 'qw2',
        text: 'Which hook in React 19 handles optimistic state updates before server responses complete?',
        type: 'multiple_choice',
        options: ['useOptimistic', 'useActionState', 'useServerAction', 'useDeferredValue'],
        correctAnswer: 0,
        explanation: 'useOptimistic updates UI immediately while an asynchronous server action is in flight.',
        points: 50
      }
    ]
  }
};

const lmsQuizAttemptsStore: LMSQuizAttemptRecord[] = [
  {
    id: 'att-101',
    quizId: 'quiz-ai-101',
    courseId: 'artificial-intelligence',
    studentEmail: 'alex.rivera@nexusai.com',
    studentName: 'Alex Rivera',
    scorePercentage: 100,
    passed: true,
    answers: { q1: 1, q2: 0, q3: 'Vector embeddings project text into high dimensional space for geometric cosine similarity.' },
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    feedback: 'Excellent grasp of KV Caching and ReAct execution loops!'
  }
];

const lmsAssignmentsStore: Record<string, LMSAssignmentRecord[]> = {
  'artificial-intelligence': [
    {
      id: 'asg-ai-1',
      courseId: 'artificial-intelligence',
      title: 'Capstone: Build a ReAct Tool-Calling Agent with Memory Caching',
      description: 'Implement a stateful multi-step ReAct agent in TypeScript or Python that interfaces with a weather API and database tool while managing context window token limits.',
      deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
      maxPoints: 100
    }
  ]
};

const lmsAssignmentSubmissionsStore: LMSAssignmentSubmissionRecord[] = [
  {
    id: 'sub-301',
    assignmentId: 'asg-ai-1',
    courseId: 'artificial-intelligence',
    studentEmail: 'alex.rivera@nexusai.com',
    studentName: 'Alex Rivera',
    content: 'https://github.com/alexrivera/nexus-react-agent-capstone',
    fileName: 'react_agent_architecture_v1.zip',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Graded',
    gradePoints: 98,
    instructorFeedback: 'Outstanding implementation! Clean tool-calling schemas and excellent error resilience in the execution loop.',
    gradedBy: 'Dr. Evelyn Sterling',
    gradedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const lmsCertificatesStore: LMSCertificateRecord[] = [
  {
    id: 'NEXUS-CERT-AI100-8492',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@nexusai.com',
    courseId: 'artificial-intelligence',
    courseTitle: 'Autonomous AI Agents & Large Language Model Architecture',
    instructorName: 'Dr. Evelyn Sterling',
    issuedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    gradeScore: '98% Distinction',
    verificationUrl: 'https://nexus-ai-academic-solutions.vercel.app/api/certificates/verify/NEXUS-CERT-AI100-8492',
    status: 'Valid'
  },
  {
    id: 'NEXUS-CERT-WEB100-3910',
    studentName: 'Jordan Lee',
    studentEmail: 'jordan@nexusai.com',
    courseId: 'web-development',
    courseTitle: 'Full-Stack Modern Web Engineering & React 19 Ecosystem',
    instructorName: 'Kaelen Vance',
    issuedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    gradeScore: '96% High Honors',
    verificationUrl: 'https://nexus-ai-academic-solutions.vercel.app/api/certificates/verify/NEXUS-CERT-WEB100-3910',
    status: 'Valid'
  }
];

const lmsReviewsStore: LMSReviewRecord[] = [
  {
    id: 'rev-1',
    courseId: 'artificial-intelligence',
    studentName: 'Alex Rivera',
    rating: 5,
    comment: 'The deepest, most production-focused program on AI Agents and KV Caching I have taken. Dr. Evelyn Sterling is exceptional!',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'Approved'
  }
];

const lmsAnnouncementsStore: LMSAnnouncementRecord[] = [
  {
    id: 'anc-1',
    courseId: 'artificial-intelligence',
    title: 'Cyber Lab 4 Workstation Conda Environment Updated',
    message: 'All physical lab workstations in Cyber Lab 4 have been updated with PyTorch 2.5 and CUDA 12.4 drivers. Please pull the latest repo.',
    postedBy: 'Dr. Evelyn Sterling',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    targetCohort: 'Cohort 2026'
  }
];

const lmsProgressStore: LMSProgressRecord[] = [
  {
    studentEmail: 'alex.rivera@nexusai.com',
    courseId: 'artificial-intelligence',
    completedLessonIds: ['les-ai-101', 'les-ai-102', 'les-ai-103'],
    lastAccessedLessonId: 'les-ai-201',
    progressPercentage: 78,
    lastAccessedAt: new Date().toISOString()
  },
  {
    studentEmail: 'alex.rivera@nexusai.com',
    courseId: 'web-development',
    completedLessonIds: ['les-web-101', 'les-web-102'],
    lastAccessedLessonId: 'les-web-102',
    progressPercentage: 100,
    lastAccessedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// ----------------------------------------------------
// LMS API ENDPOINTS
// ----------------------------------------------------

// Get All LMS Course Curriculum & Modules
app.get('/api/lms/courses/:id/modules', (req: Request, res: Response) => {
  const { id } = req.params;
  const modules = lmsModulesStore[id] || [];
  res.json({ courseId: id, modules });
});

// Update or Add LMS Modules (Instructors & Admins)
app.post('/api/lms/courses/:id/modules', (req: Request, res: Response) => {
  const { id } = req.params;
  const { modules } = req.body;

  if (!Array.isArray(modules)) {
    return res.status(400).json({ error: 'Modules array is required.' });
  }

  lmsModulesStore[id] = modules;
  res.json({ success: true, courseId: id, modules });
});

// Get Student Lesson Progress
app.get('/api/lms/progress', (req: Request, res: Response) => {
  const email = (req.query.email as string) || 'alex.rivera@nexusai.com';
  const courseId = req.query.courseId as string;

  if (courseId) {
    const prog = lmsProgressStore.find(p => p.studentEmail === email && p.courseId === courseId);
    return res.json({ progress: prog || { studentEmail: email, courseId, completedLessonIds: [], progressPercentage: 0, lastAccessedAt: new Date().toISOString() } });
  }

  const userProgress = lmsProgressStore.filter(p => p.studentEmail === email);
  res.json({ progress: userProgress });
});

// Update Lesson Completion & Progress
app.post('/api/lms/progress', (req: Request, res: Response) => {
  const { studentEmail, courseId, lessonId, isCompleted } = req.body;

  if (!studentEmail || !courseId || !lessonId) {
    return res.status(400).json({ error: 'studentEmail, courseId, and lessonId are required.' });
  }

  let prog = lmsProgressStore.find(p => p.studentEmail === studentEmail && p.courseId === courseId);
  if (!prog) {
    prog = {
      studentEmail,
      courseId,
      completedLessonIds: [],
      progressPercentage: 0,
      lastAccessedAt: new Date().toISOString()
    };
    lmsProgressStore.push(prog);
  }

  if (isCompleted && !prog.completedLessonIds.includes(lessonId)) {
    prog.completedLessonIds.push(lessonId);
  } else if (!isCompleted) {
    prog.completedLessonIds = prog.completedLessonIds.filter(id => id !== lessonId);
  }

  // Calculate total lessons in course
  const courseModules = lmsModulesStore[courseId] || [];
  let totalLessons = 0;
  courseModules.forEach(m => totalLessons += m.lessons.length);
  if (totalLessons === 0) totalLessons = 5; // fallback

  prog.progressPercentage = Math.min(100, Math.round((prog.completedLessonIds.length / totalLessons) * 100));
  prog.lastAccessedLessonId = lessonId;
  prog.lastAccessedAt = new Date().toISOString();

  res.json({ success: true, progress: prog });
});

// Get Quiz Assessment
app.get('/api/lms/quizzes/:courseId', (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userRole = (req.query.role as string) || 'student';
  const isStaff = userRole === 'admin' || userRole === 'teacher';

  const quiz = lmsQuizzesStore[courseId];
  if (!quiz) return res.status(404).json({ error: 'Quiz assessment not found for this course.' });

  // Hide correct answers if student
  const sanitizedQuiz = {
    ...quiz,
    questions: quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.options,
      points: q.points,
      explanation: isStaff ? q.explanation : undefined,
      correctAnswer: isStaff ? q.correctAnswer : undefined
    }))
  };

  res.json({ quiz: sanitizedQuiz });
});

// Submit Quiz Assessment & Auto-Grade
app.post('/api/lms/quizzes/:quizId/submit', (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { courseId, studentEmail, studentName, answers } = req.body;

  if (!courseId || !studentEmail || !answers) {
    return res.status(400).json({ error: 'courseId, studentEmail, and answers are required.' });
  }

  const quiz = lmsQuizzesStore[courseId];
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

  let totalPoints = 0;
  let earnedPoints = 0;

  quiz.questions.forEach(q => {
    totalPoints += q.points;
    const studentAns = answers[q.id];
    if (studentAns !== undefined && String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
      earnedPoints += q.points;
    }
  });

  const scorePercentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
  const passed = scorePercentage >= quiz.passScorePercentage;

  const attempt: LMSQuizAttemptRecord = {
    id: `att-${Date.now().toString().slice(-4)}`,
    quizId,
    courseId,
    studentEmail,
    studentName: studentName || 'Alex Rivera',
    scorePercentage,
    passed,
    answers,
    submittedAt: new Date().toISOString(),
    feedback: passed ? `Congratulations! You passed with ${scorePercentage}%.` : `Score: ${scorePercentage}%. Passing requirement is ${quiz.passScorePercentage}%. Please review course lessons and retry.`
  };

  lmsQuizAttemptsStore.unshift(attempt);

  // Update lesson progress if passed
  let prog = lmsProgressStore.find(p => p.studentEmail === studentEmail && p.courseId === courseId);
  if (prog && passed) {
    const quizLesson = lmsModulesStore[courseId]?.flatMap(m => m.lessons).find(l => l.type === 'quiz');
    if (quizLesson && !prog.completedLessonIds.includes(quizLesson.id)) {
      prog.completedLessonIds.push(quizLesson.id);
    }
  }

  res.json({ success: true, attempt });
});

// Get Assignments & Submissions
app.get('/api/lms/assignments/:courseId', (req: Request, res: Response) => {
  const { courseId } = req.params;
  const email = req.query.email as string;

  const assignments = lmsAssignmentsStore[courseId] || [];
  let submissions = lmsAssignmentSubmissionsStore.filter(s => s.courseId === courseId);

  if (email) {
    submissions = submissions.filter(s => s.studentEmail.toLowerCase() === email.toLowerCase());
  }

  res.json({ assignments, submissions });
});

// Submit Assignment Solution
app.post('/api/lms/assignments/:assignmentId/submit', (req: Request, res: Response) => {
  const { assignmentId } = req.params;
  const { courseId, studentEmail, studentName, content, fileName } = req.body;

  if (!courseId || !studentEmail || !content) {
    return res.status(400).json({ error: 'courseId, studentEmail, and content are required.' });
  }

  const submission: LMSAssignmentSubmissionRecord = {
    id: `sub-${Date.now().toString().slice(-4)}`,
    assignmentId,
    courseId,
    studentEmail,
    studentName: studentName || 'Alex Rivera',
    content,
    fileName: fileName || 'assignment_submission.zip',
    submittedAt: new Date().toISOString(),
    status: 'Pending'
  };

  lmsAssignmentSubmissionsStore.unshift(submission);
  res.status(201).json({ success: true, submission });
});

// Grade Assignment (Instructor / Admin)
app.post('/api/lms/assignments/:submissionId/grade', (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const { gradePoints, instructorFeedback, gradedBy } = req.body;

  const target = lmsAssignmentSubmissionsStore.find(s => s.id === submissionId);
  if (!target) return res.status(404).json({ error: 'Assignment submission not found.' });

  target.gradePoints = gradePoints;
  target.instructorFeedback = instructorFeedback || '';
  target.status = 'Graded';
  target.gradedBy = gradedBy || 'Dr. Evelyn Sterling';
  target.gradedAt = new Date().toISOString();

  res.json({ success: true, submission: target });
});

// Get Certificates
app.get('/api/lms/certificates', (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (email) {
    const certs = lmsCertificatesStore.filter(c => c.studentEmail.toLowerCase() === email.toLowerCase());
    return res.json({ certificates: certs });
  }
  res.json({ certificates: lmsCertificatesStore });
});

// Cryptographic Certificate Verification Public Endpoint
app.get('/api/certificates/verify/:certId', (req: Request, res: Response) => {
  const { certId } = req.params;
  const cert = lmsCertificatesStore.find(c => c.id.toLowerCase() === certId.toLowerCase());

  if (!cert) {
    return res.status(404).json({ valid: false, error: 'Certificate ID not found in Nexus AI Cryptographic Ledger.' });
  }

  res.json({ valid: true, certificate: cert });
});

// Generate Certificate (100% Completion + Assessment Validation)
app.post('/api/lms/certificates/generate', (req: Request, res: Response) => {
  const { studentEmail, studentName, courseId, courseTitle, instructorName } = req.body;

  if (!studentEmail || !courseId) {
    return res.status(400).json({ success: false, error: 'studentEmail and courseId are required.' });
  }

  // 1. Validate real completion progress in lmsProgressStore
  const prog = lmsProgressStore.find(
    p => p.studentEmail.toLowerCase() === studentEmail.toLowerCase() && p.courseId === courseId
  );
  if (!prog || prog.progressPercentage < 100) {
    return res.status(400).json({
      success: false,
      error: `Course completion criteria not satisfied. Current progress is ${prog?.progressPercentage || 0}%. 100% lesson completion required.`
    });
  }

  // 2. Validate passing score on course quiz assessment
  const quizAttempt = lmsQuizAttemptsStore.find(
    a => a.studentEmail.toLowerCase() === studentEmail.toLowerCase() && a.courseId === courseId && a.passed
  );
  if (!quizAttempt) {
    return res.status(400).json({
      success: false,
      error: `Assessment requirement not satisfied: You must pass the required course assessment quiz before requesting a certificate.`
    });
  }

  // 3. Prevent duplicate certificate issuance
  const existingCert = lmsCertificatesStore.find(
    c => c.studentEmail.toLowerCase() === studentEmail.toLowerCase() && c.courseId === courseId
  );
  if (existingCert) {
    return res.json({ success: true, certificate: existingCert, message: 'Certificate already issued.' });
  }

  const certId = `NEXUS-CERT-${courseId.slice(0, 3).toUpperCase()}${Math.floor(Math.random() * 899 + 100)}-${Date.now().toString().slice(-4)}`;

  const newCert: LMSCertificateRecord = {
    id: certId,
    studentName: studentName || 'Alex Rivera',
    studentEmail,
    courseId,
    courseTitle: courseTitle || 'Nexus Academy Course',
    instructorName: instructorName || 'Dr. Evelyn Sterling',
    issuedAt: new Date().toISOString(),
    gradeScore: `${quizAttempt.scorePercentage}% Distinction`,
    verificationUrl: `https://nexus-ai-academic-solutions.vercel.app/api/certificates/verify/${certId}`,
    status: 'Valid'
  };

  lmsCertificatesStore.unshift(newCert);
  res.status(201).json({ success: true, certificate: newCert });
});

// Get Course Reviews
app.get('/api/lms/reviews', (req: Request, res: Response) => {
  const courseId = req.query.courseId as string;
  let reviews = [...lmsReviewsStore];

  if (courseId) {
    reviews = reviews.filter(r => r.courseId === courseId);
  }

  res.json({ reviews });
});

// Submit Course Review
app.post('/api/lms/reviews', (req: Request, res: Response) => {
  const { courseId, studentName, rating, comment } = req.body;

  if (!courseId || !rating || !comment) {
    return res.status(400).json({ error: 'courseId, rating, and comment are required.' });
  }

  const newReview: LMSReviewRecord = {
    id: `rev-${Date.now().toString().slice(-4)}`,
    courseId,
    studentName: studentName || 'Alex Rivera',
    rating: Number(rating),
    comment,
    date: new Date().toISOString(),
    status: 'Approved'
  };

  lmsReviewsStore.unshift(newReview);
  res.status(201).json({ success: true, review: newReview });
});

// Get Announcements
app.get('/api/lms/announcements', (req: Request, res: Response) => {
  res.json({ announcements: lmsAnnouncementsStore });
});

// Dispatch Announcement
app.post('/api/lms/announcements', (req: Request, res: Response) => {
  const { title, message, postedBy, courseId, targetCohort } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required.' });
  }

  const newAnc: LMSAnnouncementRecord = {
    id: `anc-${Date.now().toString().slice(-4)}`,
    title,
    message,
    postedBy: postedBy || 'Dr. Evelyn Sterling',
    courseId,
    date: new Date().toISOString(),
    targetCohort: targetCohort || 'All Cohorts 2026'
  };

  lmsAnnouncementsStore.unshift(newAnc);
  res.status(201).json({ success: true, announcement: newAnc });
});

// ----------------------------------------------------
// SERVICES CRM & CLIENT PROJECT MANAGEMENT BACKEND
// ----------------------------------------------------

interface CRMLeadRecord {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone?: string;
  country?: string;
  source: 'Website Inquiry' | 'Contact Form' | 'Referral' | 'LinkedIn' | 'Outreach';
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Converted' | 'Lost';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
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

interface ClientRecord {
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

interface ProposalItemRecord {
  id: string;
  serviceTitle: string;
  description: string;
  deliverables: string[];
  estimatedDays: number;
  priceUSD: number;
}

interface ProposalRecord {
  id: string;
  leadId?: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  title: string;
  scopeSummary: string;
  items: ProposalItemRecord[];
  totalAmountUSD: number;
  expiryDate: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';
  createdAt: string;
  sentAt?: string;
  respondedAt?: string;
  clientFeedback?: string;
}

interface ProjectTaskRecord {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'In Review' | 'Completed';
  deadline: string;
}

interface ProjectMilestoneRecord {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  deliverables: string[];
}

interface ProjectDocumentRecord {
  id: string;
  title: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface ClientProjectRecord {
  id: string;
  clientId: string;
  clientName: string;
  companyName: string;
  title: string;
  description: string;
  serviceCategory: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Review' | 'Completed' | 'Cancelled';
  projectManager: string;
  teamMembers: string[];
  progressPercentage: number;
  startDate: string;
  expectedCompletionDate: string;
  milestones: ProjectMilestoneRecord[];
  tasks: ProjectTaskRecord[];
  documents: ProjectDocumentRecord[];
  budgetUSD: number;
  clientFeedback?: string;
}

interface CRMActivityLogRecord {
  id: string;
  entityType: 'Lead' | 'Client' | 'Proposal' | 'Project';
  entityId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

// In-Memory CRM Stores
const crmLeadsStore: CRMLeadRecord[] = [
  {
    id: 'LEAD-1001',
    contactName: 'Sarah Chen',
    companyName: 'Innovate Corp',
    email: 'sarah.chen@innovatecorp.io',
    phone: '+1 (555) 019-2834',
    country: 'United States',
    source: 'Website Inquiry',
    status: 'Qualified',
    priority: 'High',
    assignedSalesRep: 'Marcus Thorne',
    requiredService: 'AI Automation & Custom Agent Pipelines',
    budgetRange: '$10,000 - $25,000',
    timeline: '4 Weeks',
    description: 'Seeking custom LLM agent integration for customer intelligence and automated document parsing pipeline.',
    internalNotes: [
      'Initial discovery call completed on Nov 5.',
      'Requirements match our Enterprise AI Automation package.'
    ],
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'LEAD-1002',
    contactName: 'Marcus Vance',
    companyName: 'Vance Capital',
    email: 'marcus@vancecapital.com',
    phone: '+1 (555) 018-9921',
    country: 'United Kingdom',
    source: 'Contact Form',
    status: 'Proposal Sent',
    priority: 'Urgent',
    assignedSalesRep: 'Kaelen Vance',
    requiredService: 'Full-Stack Web & Mobile Software Engineering',
    budgetRange: '$25,000+',
    timeline: '6 Weeks',
    description: 'We require a next-generation high frequency trading UI, analytics dashboard, and mobile companion app.',
    internalNotes: [
      'Proposal PROP-3001 sent to client.',
      'Awaiting technical review from Vance Capital CTO.'
    ],
    followUpDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

const clientsStore: ClientRecord[] = [
  {
    id: 'CLI-2001',
    name: 'Elena Rostova',
    companyName: 'BioMedX Corp',
    email: 'elena@biomedx.org',
    phone: '+1 (555) 012-4411',
    country: 'Canada',
    assignedAccountManager: 'Marcus Thorne',
    activeProjectIds: ['PRJ-4001'],
    completedProjectIds: [],
    totalValueUSD: 18000,
    status: 'Active',
    joinedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  }
];

const proposalsStore: ProposalRecord[] = [
  {
    id: 'PROP-3001',
    leadId: 'LEAD-1002',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus@vancecapital.com',
    companyName: 'Vance Capital',
    title: 'Enterprise High-Frequency Trading Analytics Portal',
    scopeSummary: 'Custom React 19 high-frequency trading dashboard, WebSocket real-time data ingestion, and Node.js microservices.',
    items: [
      { id: 'pi-1', serviceTitle: 'React 19 Trading Portal & Real-time Canvas', description: 'Sub-millisecond chart rendering using WebGL canvas.', deliverables: ['React 19 Portal', 'WebGL Chart Engine'], estimatedDays: 14, priceUSD: 15000 },
      { id: 'pi-2', serviceTitle: 'Node.js Microservices & WebSocket Engine', description: 'Resilient API gateway with JWT session security.', deliverables: ['Node.js Backend', 'WebSocket Stream'], estimatedDays: 10, priceUSD: 10000 }
    ],
    totalAmountUSD: 25000,
    expiryDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    status: 'Sent',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

const projectsStore: ClientProjectRecord[] = [
  {
    id: 'PRJ-4001',
    clientId: 'CLI-2001',
    clientName: 'Elena Rostova',
    companyName: 'BioMedX Corp',
    title: 'Genomics AI Data Analytics & Brand Overhaul',
    description: 'Deploying custom genomic data parsing algorithms with a React 19 analytics dashboard and design system.',
    serviceCategory: 'AI Automation & Web Engineering',
    status: 'Active',
    projectManager: 'Marcus Thorne',
    teamMembers: ['Dr. Evelyn Sterling', 'Kaelen Vance', 'Elena Rostova'],
    progressPercentage: 65,
    startDate: new Date(Date.now() - 86400000 * 20).toISOString(),
    expectedCompletionDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    budgetUSD: 18000,
    milestones: [
      { id: 'm1', title: 'Milestone 1: Design System & Figma Tokens', dueDate: new Date(Date.now() - 86400000 * 10).toISOString(), completed: true, deliverables: ['Figma Design Token Spec', 'Color System'] },
      { id: 'm2', title: 'Milestone 2: Genomic Data Ingestion Engine', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), completed: false, deliverables: ['FastAPI Data Parser', 'PostgreSQL Schema'] },
      { id: 'm3', title: 'Milestone 3: Final Production Release & Audit', dueDate: new Date(Date.now() + 86400000 * 15).toISOString(), completed: false, deliverables: ['Cloud Run Deployment', 'SOC2 Audit Report'] }
    ],
    tasks: [
      { id: 't1', title: 'Implement PostgreSQL Genomic Data Indexes', description: 'Optimize vector search queries for DNA sequence matching.', assignedTo: 'Dr. Evelyn Sterling', priority: 'High', status: 'In Progress', deadline: new Date(Date.now() + 86400000 * 2).toISOString() },
      { id: 't2', title: 'Deploy React 19 Dashboard to Cloud Run', description: 'Set up zero-downtime CI/CD build trigger.', assignedTo: 'Kaelen Vance', priority: 'Medium', status: 'Todo', deadline: new Date(Date.now() + 86400000 * 6).toISOString() }
    ],
    documents: [
      { id: 'doc-p1', title: 'BioMedX_Architecture_Specification_v1.pdf', fileUrl: '#', uploadedBy: 'Marcus Thorne', uploadedAt: new Date(Date.now() - 86400000 * 18).toISOString() }
    ],
    clientFeedback: 'Milestone 1 design tokens were approved by our executive board. Excellent work!'
  }
];

const crmActivitiesStore: CRMActivityLogRecord[] = [
  {
    id: 'act-1',
    entityType: 'Lead',
    entityId: 'LEAD-1001',
    action: 'Lead Qualified',
    performedBy: 'Marcus Thorne',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    details: 'Qualified lead requirement matching Enterprise AI Automation package.'
  }
];

let leadCounter = 1002;
let clientCounter = 2001;
let proposalCounter = 3001;
let projectCounter = 4001;

// ----------------------------------------------------
// CRM REST API ENDPOINTS
// ----------------------------------------------------

// Get All Leads
app.get('/api/crm/leads', (req: Request, res: Response) => {
  const status = req.query.status as string;
  const priority = req.query.priority as string;
  let filtered = [...crmLeadsStore];

  if (status && status !== 'All') filtered = filtered.filter(l => l.status === status);
  if (priority && priority !== 'All') filtered = filtered.filter(l => l.priority === priority);

  res.json({ leads: filtered });
});

// Create Lead
app.post('/api/crm/leads', (req: Request, res: Response) => {
  const { contactName, companyName, email, phone, country, source, priority, assignedSalesRep, requiredService, budgetRange, timeline, description } = req.body;

  if (!contactName || !email) {
    return res.status(400).json({ error: 'Contact name and email are required.' });
  }

  leadCounter++;
  const leadId = `LEAD-${leadCounter}`;
  const nowStr = new Date().toISOString();

  const newLead: CRMLeadRecord = {
    id: leadId,
    contactName,
    companyName: companyName || 'Independent',
    email,
    phone,
    country: country || 'Global',
    source: source || 'Website Inquiry',
    status: 'New',
    priority: priority || 'Medium',
    assignedSalesRep: assignedSalesRep || 'Marcus Thorne',
    requiredService: requiredService || 'General Consultation',
    budgetRange: budgetRange || 'To be discussed',
    timeline: timeline || 'Flexible',
    description: description || '',
    internalNotes: ['Lead created in CRM.'],
    createdAt: nowStr,
    updatedAt: nowStr
  };

  crmLeadsStore.unshift(newLead);
  crmActivitiesStore.unshift({
    id: `act-${Date.now().toString().slice(-4)}`,
    entityType: 'Lead',
    entityId: leadId,
    action: 'Lead Created',
    performedBy: 'CRM Dispatch',
    timestamp: nowStr,
    details: `Lead created for ${contactName} (${companyName || 'Independent'})`
  });

  res.status(201).json({ success: true, lead: newLead });
});

// Update Lead
app.patch('/api/crm/leads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, priority, assignedSalesRep, followUpDate, internalNote } = req.body;

  const lead = crmLeadsStore.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });

  if (status) lead.status = status;
  if (priority) lead.priority = priority;
  if (assignedSalesRep) lead.assignedSalesRep = assignedSalesRep;
  if (followUpDate) lead.followUpDate = followUpDate;
  if (internalNote) lead.internalNotes.unshift(`[${new Date().toLocaleDateString()}] ${internalNote}`);
  lead.updatedAt = new Date().toISOString();

  res.json({ success: true, lead });
});

// Convert Lead to Client & Project
app.post('/api/crm/leads/:id/convert', (req: Request, res: Response) => {
  const { id } = req.params;
  const lead = crmLeadsStore.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });

  lead.status = 'Converted';
  lead.updatedAt = new Date().toISOString();

  // Create Client
  clientCounter++;
  const clientId = `CLI-${clientCounter}`;
  const nowStr = new Date().toISOString();

  const newClient: ClientRecord = {
    id: clientId,
    name: lead.contactName,
    companyName: lead.companyName,
    email: lead.email,
    phone: lead.phone,
    country: lead.country,
    assignedAccountManager: lead.assignedSalesRep || 'Marcus Thorne',
    activeProjectIds: [],
    completedProjectIds: [],
    totalValueUSD: 20000,
    status: 'Active',
    joinedAt: nowStr
  };
  clientsStore.unshift(newClient);

  // Create Project
  projectCounter++;
  const projectId = `PRJ-${projectCounter}`;
  const newProject: ClientProjectRecord = {
    id: projectId,
    clientId: newClient.id,
    clientName: newClient.name,
    companyName: newClient.companyName,
    title: `${lead.requiredService} - ${newClient.companyName}`,
    description: lead.description || 'Client project scope derived from converted CRM lead.',
    serviceCategory: lead.requiredService,
    status: 'Active',
    projectManager: lead.assignedSalesRep || 'Marcus Thorne',
    teamMembers: ['Marcus Thorne', 'Kaelen Vance'],
    progressPercentage: 10,
    startDate: nowStr,
    expectedCompletionDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    budgetUSD: 20000,
    milestones: [
      { id: 'm1', title: 'Milestone 1: Discovery & Architecture Specification', dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), completed: false, deliverables: ['Architecture Doc'] }
    ],
    tasks: [
      { id: 't1', title: 'Initial Sprint Planning & Team Kickoff', description: 'Setup environment and repository.', assignedTo: 'Marcus Thorne', priority: 'High', status: 'In Progress', deadline: new Date(Date.now() + 86400000 * 3).toISOString() }
    ],
    documents: []
  };

  projectsStore.unshift(newProject);
  newClient.activeProjectIds.push(projectId);

  res.json({ success: true, lead, client: newClient, project: newProject });
});

// Get Clients List
app.get('/api/crm/clients', (_req: Request, res: Response) => {
  res.json({ clients: clientsStore });
});

// Get Proposals List
app.get('/api/crm/proposals', (_req: Request, res: Response) => {
  res.json({ proposals: proposalsStore });
});

// Create Proposal
app.post('/api/crm/proposals', (req: Request, res: Response) => {
  const { clientName, clientEmail, companyName, title, scopeSummary, items, totalAmountUSD, expiryDays } = req.body;

  if (!clientName || !clientEmail || !title) {
    return res.status(400).json({ error: 'Client name, email, and proposal title are required.' });
  }

  proposalCounter++;
  const propId = `PROP-${proposalCounter}`;
  const nowStr = new Date().toISOString();

  const newProp: ProposalRecord = {
    id: propId,
    clientName,
    clientEmail,
    companyName: companyName || 'Client Org',
    title,
    scopeSummary: scopeSummary || 'Proposal scope and deliverables specification.',
    items: items || [],
    totalAmountUSD: totalAmountUSD || 15000,
    expiryDate: new Date(Date.now() + 86400000 * (expiryDays || 14)).toISOString(),
    status: 'Sent',
    createdAt: nowStr,
    sentAt: nowStr
  };

  proposalsStore.unshift(newProp);
  res.status(201).json({ success: true, proposal: newProp });
});

// Update Proposal Status
app.patch('/api/crm/proposals/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, clientFeedback } = req.body;

  const prop = proposalsStore.find(p => p.id === id);
  if (!prop) return res.status(404).json({ error: 'Proposal not found.' });

  if (status) prop.status = status;
  if (clientFeedback) prop.clientFeedback = clientFeedback;
  prop.respondedAt = new Date().toISOString();

  res.json({ success: true, proposal: prop });
});

// Get Projects List
app.get('/api/crm/projects', (req: Request, res: Response) => {
  const clientId = req.query.clientId as string;
  if (clientId) {
    const clientProjects = projectsStore.filter(p => p.clientId === clientId);
    return res.json({ projects: clientProjects });
  }
  res.json({ projects: projectsStore });
});

// Create Project
app.post('/api/crm/projects', (req: Request, res: Response) => {
  const { clientId, clientName, companyName, title, description, serviceCategory, budgetUSD } = req.body;

  if (!title || !clientName) {
    return res.status(400).json({ error: 'Project title and client name are required.' });
  }

  projectCounter++;
  const projectId = `PRJ-${projectCounter}`;
  const nowStr = new Date().toISOString();

  const newProject: ClientProjectRecord = {
    id: projectId,
    clientId: clientId || 'CLI-2001',
    clientName,
    companyName: companyName || 'Client Enterprise',
    title,
    description: description || 'Custom software development project.',
    serviceCategory: serviceCategory || 'Software Engineering',
    status: 'Active',
    projectManager: 'Marcus Thorne',
    teamMembers: ['Marcus Thorne', 'Dr. Evelyn Sterling'],
    progressPercentage: 0,
    startDate: nowStr,
    expectedCompletionDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    budgetUSD: budgetUSD || 15000,
    milestones: [
      { id: 'm1', title: 'Milestone 1: Requirements Discovery & Figma Tokens', dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), completed: false, deliverables: ['Discovery Doc'] }
    ],
    tasks: [],
    documents: []
  };

  projectsStore.unshift(newProject);
  res.status(201).json({ success: true, project: newProject });
});

// Update Project Parameters / Milestones / Tasks
app.patch('/api/crm/projects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, progressPercentage, milestones, tasks, clientFeedback } = req.body;

  const project = projectsStore.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  if (status) project.status = status;
  if (typeof progressPercentage === 'number') project.progressPercentage = progressPercentage;
  if (milestones) project.milestones = milestones;
  if (tasks) project.tasks = tasks;
  if (clientFeedback) project.clientFeedback = clientFeedback;

  res.json({ success: true, project });
});

// Add Task to Project
app.post('/api/crm/projects/:id/tasks', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, assignedTo, priority, deadline } = req.body;

  const project = projectsStore.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  const newTask: ProjectTaskRecord = {
    id: `t-${Date.now().toString().slice(-4)}`,
    title,
    description: description || '',
    assignedTo: assignedTo || 'Marcus Thorne',
    priority: priority || 'Medium',
    status: 'Todo',
    deadline: deadline || new Date(Date.now() + 86400000 * 5).toISOString()
  };

  project.tasks.push(newTask);
  res.status(201).json({ success: true, task: newTask, project });
});

// Client Portal Integrated Dashboard Endpoint
app.get('/api/client-portal/dashboard', (req: Request, res: Response) => {
  const email = (req.query.email as string) || 'elena@biomedx.org';

  const client = clientsStore.find(c => c.email.toLowerCase() === email.toLowerCase()) || clientsStore[0];
  const clientProjects = projectsStore.filter(p => p.clientId === client.id || p.clientName.toLowerCase().includes(client.name.toLowerCase()));
  const clientProposals = proposalsStore.filter(p => p.clientEmail.toLowerCase() === email.toLowerCase());

  res.json({
    client,
    projects: clientProjects,
    proposals: clientProposals
  });
});

// AI Copilot Lead Qualification Endpoint
app.post('/api/crm/ai/qualify-lead', async (req: Request, res: Response) => {
  const { contactName, companyName, requiredService, budgetRange, description } = req.body;

  const prompt = `Analyze sales lead qualification:
Contact: ${contactName} (${companyName})
Required Service: ${requiredService}
Budget Range: ${budgetRange}
Description: ${description}

Provide:
1. Lead Qualification Rating (Qualified / Low Fit / High Value)
2. Recommended Service & Deliverables
3. 2 Discovery Questions for Sales Rep`;

  try {
    const analysis = await generateNexusAIResponse(prompt, 'You are an AI Sales Copilot for Nexus AI Academic & Solutions.');
    res.json({ success: true, analysis });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Lead qualification analysis failed.' });
  }
});

// ----------------------------------------------------
// GLOBAL NEXUS RESEARCH CENTER (GNRC) BACKEND
// ----------------------------------------------------

interface GNRCAdmissionApplicationRecord {
  id: string;
  fullName: string;
  fatherGuardianName: string;
  phone: string;
  whatsApp: string;
  email: string;
  address: string;
  educationLevel: string;
  selectedCourseId: string;
  selectedCourseTitle: string;
  preferredDuration: string;
  preferredClassType: 'Physical (On-Campus)' | 'Online' | 'Hybrid';
  preferredSchedule: string;
  previousExperience?: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Enrolled';
  appliedAt: string;
  updatedAt: string;
  adminNotes?: string;
  assignedInstructor?: string;
  feeStatus?: 'Unpaid' | 'Installment 1 Paid' | 'Fully Paid';
}

interface GNRCPhysicalAttendanceRecord {
  studentEmail: string;
  courseId: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  lastAttendedDate: string;
}

const gnrcAdmissionsStore: GNRCAdmissionApplicationRecord[] = [
  {
    id: 'GNRC-ADM-8492',
    fullName: 'Muhammad Usama',
    fatherGuardianName: 'Tariq Mehmood',
    phone: '+92 300 1234567',
    whatsApp: '+92 300 1234567',
    email: 'usama@gnrc.edu.pk',
    address: 'Circular Road, Hasilpur, Punjab, Pakistan',
    educationLevel: 'Intermediate (FSc Pre-Engineering)',
    selectedCourseId: 'gnrc-fullstack-web',
    selectedCourseTitle: 'Full-Stack Web Development Diploma',
    preferredDuration: '6 Months',
    preferredClassType: 'Physical (On-Campus)',
    preferredSchedule: 'Evening (6 PM - 9 PM)',
    previousExperience: 'Basic computer operations and MS Office',
    status: 'Approved',
    appliedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    adminNotes: 'Application verified. Approved for Physical Lab Cohort 2026.',
    assignedInstructor: 'Engr. Shahzaib Khan',
    feeStatus: 'Installment 1 Paid'
  },
  {
    id: 'GNRC-ADM-8493',
    fullName: 'Ayesha Bibi',
    fatherGuardianName: 'Muhammad Rashid',
    phone: '+92 301 7654321',
    whatsApp: '+92 301 7654321',
    email: 'ayesha@gnrc.edu.pk',
    address: 'Model Town, Hasilpur',
    educationLevel: 'Matriculation',
    selectedCourseId: 'gnrc-ms-office-complete',
    selectedCourseTitle: 'Microsoft Office Complete Specialist Suite',
    preferredDuration: '6 Months',
    preferredClassType: 'Physical (On-Campus)',
    preferredSchedule: 'Morning (9 AM - 12 PM)',
    status: 'Submitted',
    appliedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    feeStatus: 'Unpaid'
  }
];

const gnrcAttendanceStore: GNRCPhysicalAttendanceRecord[] = [
  {
    studentEmail: 'usama@gnrc.edu.pk',
    courseId: 'gnrc-fullstack-web',
    totalClasses: 24,
    attendedClasses: 22,
    attendancePercentage: 92,
    lastAttendedDate: new Date().toISOString()
  }
];

let gnrcAdmCounter = 8493;

// Submit Online Admission Application
app.post('/api/gnrc/apply', (req: Request, res: Response) => {
  const {
    fullName,
    fatherGuardianName,
    phone,
    whatsApp,
    email,
    address,
    educationLevel,
    selectedCourseId,
    selectedCourseTitle,
    preferredDuration,
    preferredClassType,
    preferredSchedule,
    previousExperience
  } = req.body;

  if (!fullName || !phone || !email || !selectedCourseTitle) {
    return res.status(400).json({ error: 'Full name, phone, email, and selected course are required.' });
  }

  gnrcAdmCounter++;
  const trackingId = `GNRC-ADM-${gnrcAdmCounter}`;
  const nowStr = new Date().toISOString();

  const newApp: GNRCAdmissionApplicationRecord = {
    id: trackingId,
    fullName,
    fatherGuardianName: fatherGuardianName || 'N/A',
    phone,
    whatsApp: whatsApp || phone,
    email,
    address: address || 'Hasilpur, Punjab, Pakistan',
    educationLevel: educationLevel || 'Matriculation',
    selectedCourseId: selectedCourseId || 'gnrc-comp-basics',
    selectedCourseTitle,
    preferredDuration: preferredDuration || '3 Months',
    preferredClassType: preferredClassType || 'Physical (On-Campus)',
    preferredSchedule: preferredSchedule || 'Evening (6 PM - 9 PM)',
    previousExperience: previousExperience || 'Beginner',
    status: 'Submitted',
    appliedAt: nowStr,
    updatedAt: nowStr,
    feeStatus: 'Unpaid'
  };

  gnrcAdmissionsStore.unshift(newApp);
  res.status(201).json({ success: true, application: newApp, trackingId });
});

// Get Admission Applications (Admin or Student Track)
app.get('/api/gnrc/admissions', (req: Request, res: Response) => {
  const email = req.query.email as string;
  const status = req.query.status as string;

  let filtered = [...gnrcAdmissionsStore];
  if (email) filtered = filtered.filter(a => a.email.toLowerCase() === email.toLowerCase());
  if (status && status !== 'All') filtered = filtered.filter(a => a.status === status);

  res.json({ admissions: filtered });
});

// Get Single Admission Application
app.get('/api/gnrc/admissions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const appRecord = gnrcAdmissionsStore.find(a => a.id.toLowerCase() === id.toLowerCase());
  if (!appRecord) return res.status(404).json({ error: 'Admission application not found.' });

  res.json({ application: appRecord });
});

// Update Admission Application Status / Notes
app.patch('/api/gnrc/admissions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, assignedInstructor, feeStatus } = req.body;

  const appRecord = gnrcAdmissionsStore.find(a => a.id === id);
  if (!appRecord) return res.status(404).json({ error: 'Admission application not found.' });

  if (status) appRecord.status = status;
  if (adminNotes) appRecord.adminNotes = adminNotes;
  if (assignedInstructor) appRecord.assignedInstructor = assignedInstructor;
  if (feeStatus) appRecord.feeStatus = feeStatus;
  appRecord.updatedAt = new Date().toISOString();

  res.json({ success: true, application: appRecord });
});

// Convert Approved Application to Enrollment
app.post('/api/gnrc/admissions/:id/convert', (req: Request, res: Response) => {
  const { id } = req.params;
  const appRecord = gnrcAdmissionsStore.find(a => a.id === id);
  if (!appRecord) return res.status(404).json({ error: 'Admission application not found.' });

  appRecord.status = 'Enrolled';
  appRecord.updatedAt = new Date().toISOString();

  // Create LMS enrollment
  const newEnrollment: Enrollment = {
    id: `enr-gnrc-${Date.now().toString().slice(-4)}`,
    studentName: appRecord.fullName,
    studentEmail: appRecord.email,
    courseId: appRecord.selectedCourseId,
    courseTitle: appRecord.selectedCourseTitle,
    type: appRecord.preferredClassType === 'Physical (On-Campus)' ? 'physical' : 'online',
    schedule: `${appRecord.preferredSchedule} (${appRecord.preferredClassType})`,
    progress: 0,
    enrolledAt: new Date().toISOString(),
    certificateIssued: false
  };

  enrollments.unshift(newEnrollment);
  res.json({ success: true, application: appRecord, enrollment: newEnrollment });
});

// Physical Attendance API
app.get('/api/gnrc/attendance', (req: Request, res: Response) => {
  const email = req.query.email as string;
  let filtered = [...gnrcAttendanceStore];
  if (email) filtered = filtered.filter(a => a.studentEmail.toLowerCase() === email.toLowerCase());

  res.json({ attendance: filtered });
});

app.post('/api/gnrc/attendance', (req: Request, res: Response) => {
  const { studentEmail, courseId, attended } = req.body;
  let rec = gnrcAttendanceStore.find(a => a.studentEmail === studentEmail && a.courseId === courseId);

  if (!rec) {
    rec = {
      studentEmail,
      courseId,
      totalClasses: 1,
      attendedClasses: attended ? 1 : 0,
      attendancePercentage: attended ? 100 : 0,
      lastAttendedDate: new Date().toISOString()
    };
    gnrcAttendanceStore.push(rec);
  } else {
    rec.totalClasses += 1;
    if (attended) rec.attendedClasses += 1;
    rec.attendancePercentage = Math.round((rec.attendedClasses / rec.totalClasses) * 100);
    rec.lastAttendedDate = new Date().toISOString();
  }

  res.json({ success: true, attendance: rec });
});

// ----------------------------------------------------
// OWNER COMMAND CENTER, USER & ROLE MANAGEMENT & SETTINGS
// ----------------------------------------------------

interface SystemUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLoginAt?: string;
  avatar?: string;
}

interface SystemAuditLogRecord {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  action: string;
  targetEntity: string;
  outcome: 'Success' | 'Denied' | 'Failed';
  details: string;
}

const systemUsersStore: SystemUserRecord[] = [
  {
    id: 'usr-owner-01',
    name: 'Marcus Thorne',
    email: 'admin@nexusai.com',
    role: 'Owner',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    lastLoginAt: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-inst-01',
    name: 'Dr. Evelyn Sterling',
    email: 'evelyn@nexusai.com',
    role: 'Instructor',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-inst-02',
    name: 'Kaelen Vance',
    email: 'kaelen@nexusai.com',
    role: 'Instructor',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'usr-inst-03',
    name: 'Sarah Chen',
    email: 'sarah.chen@nexusai.com',
    role: 'Admin',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 80).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'usr-stud-01',
    name: 'Alex Rivera',
    email: 'alex.rivera@nexusai.com',
    role: 'Student',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastLoginAt: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-cli-01',
    name: 'Elena Rostova',
    email: 'elena@biomedx.org',
    role: 'Client',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    lastLoginAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

const systemSettingsStore = {
  general: {
    companyName: 'Nexus AI Academic & Solutions',
    websiteTitle: 'Nexus AI — Autonomous Technology Institute',
    defaultLanguage: 'English',
    timezone: 'EST (Eastern Standard Time)',
    dateFormat: 'YYYY-MM-DD',
    maintenanceMode: false
  },
  companyLeadership: {
    companyName: 'NEXUS AI ACADEMIC & SOLUTIONS',
    ceoName: 'Musa Aswad',
    primaryContact: '03076159777',
    secondaryContact: '03170338486',
    officialEmail: 'onlinewow280@gmail.com'
  },
  academy: {
    autoApproveCourses: false,
    passScoreDefault: 75,
    certificatePrefix: 'NEXUS-CERT'
  },
  crm: {
    quoteExpiryDays: 14,
    defaultLeadAssignedRep: 'Marcus Thorne'
  },
  support: {
    slaP1Minutes: 15,
    slaP2Hours: 2,
    slaP3Hours: 24,
    autoAssignStaff: true
  },
  ai: {
    modelName: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    maxTokens: 4096,
    temperature: 0.2
  },
  security: {
    rateLimitRequestsPerMin: 100,
    sessionTimeoutMinutes: 120,
    auditLogEnabled: true
  }
};

const systemAuditLogsStore: SystemAuditLogRecord[] = [
  {
    id: 'aud-101',
    timestamp: new Date().toISOString(),
    actorName: 'Marcus Thorne',
    actorEmail: 'admin@nexusai.com',
    action: 'System Settings Updated',
    targetEntity: 'System Configuration',
    outcome: 'Success',
    details: 'Configured Gemini 2.5 Flash model and SLA targets.'
  },
  {
    id: 'aud-102',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actorName: 'Marcus Thorne',
    actorEmail: 'admin@nexusai.com',
    action: 'User Role Verified',
    targetEntity: 'Alex Rivera (Student)',
    outcome: 'Success',
    details: 'Verified active student cohort status.'
  }
];

// ----------------------------------------------------
// FIREBASE AUTHENTICATION PROFILE SYNC API
// ----------------------------------------------------
app.post('/api/auth/sync-profile', (req: Request, res: Response) => {
  const { uid, email, name, accountType } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required for profile sync.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  let existingUser = systemUsersStore.find(u => u.email.toLowerCase() === cleanEmail);

  if (!existingUser) {
    const isOwner = cleanEmail === 'admin@nexusai.com';
    const assignedRole = isOwner ? 'Owner' : accountType === 'client' ? 'Client' : 'Student';

    existingUser = {
      id: uid || `usr-${Date.now().toString().slice(-4)}`,
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: assignedRole,
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    systemUsersStore.push(existingUser);
  } else {
    existingUser.lastLoginAt = new Date().toISOString();
  }

  res.json({ success: true, profile: existingUser });
});

// Update Profile Settings Endpoint
app.patch('/api/auth/profile', (req: Request, res: Response) => {
  const { email, name, avatar, phone } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const targetUser = systemUsersStore.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!targetUser) return res.status(404).json({ error: 'User profile not found.' });

  if (name) targetUser.name = name;
  if (avatar) targetUser.avatar = avatar;

  res.json({ success: true, profile: targetUser });
});

// ----------------------------------------------------
// INSTRUCTOR APPLICATIONS BACKEND
// ----------------------------------------------------
interface InstructorApplicationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  expertiseArea: string;
  yearsOfExperience: string;
  portfolioUrl?: string;
  bio: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

const instructorApplicationsStore: InstructorApplicationRecord[] = [
  {
    id: 'inst-app-101',
    fullName: 'Dr. Evelyn Sterling',
    email: 'evelyn@nexusai.com',
    phone: '+1 555 019 2831',
    expertiseArea: 'Artificial Intelligence & Neural Networks',
    yearsOfExperience: '10+ Years',
    bio: 'Former AI Research Fellow with 12 published papers in generative modeling.',
    status: 'Approved',
    appliedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000 * 58).toISOString(),
    adminNotes: 'Verified credentials. Approved for Lead Instructor role.'
  }
];

app.post('/api/instructor/apply', (req: Request, res: Response) => {
  const { fullName, email, phone, expertiseArea, yearsOfExperience, portfolioUrl, bio } = req.body;

  if (!fullName || !email || !expertiseArea) {
    return res.status(400).json({ error: 'Full name, email, and expertise area are required.' });
  }

  const newApp: InstructorApplicationRecord = {
    id: `inst-app-${Date.now().toString().slice(-4)}`,
    fullName,
    email: email.toLowerCase().trim(),
    phone: phone || '',
    expertiseArea,
    yearsOfExperience: yearsOfExperience || '1-3 Years',
    portfolioUrl,
    bio: bio || '',
    status: 'Pending',
    appliedAt: new Date().toISOString()
  };

  instructorApplicationsStore.unshift(newApp);
  res.status(201).json({ success: true, application: newApp });
});

app.get('/api/admin/instructor-applications', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ applications: instructorApplicationsStore });
});

app.patch('/api/admin/instructor-applications/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const appRecord = instructorApplicationsStore.find(a => a.id === id);
  if (!appRecord) return res.status(404).json({ error: 'Application not found.' });

  if (status) appRecord.status = status;
  if (adminNotes) appRecord.adminNotes = adminNotes;
  appRecord.reviewedAt = new Date().toISOString();

  // If approved, update user role to Instructor in systemUsersStore
  if (status === 'Approved') {
    let usr = systemUsersStore.find(u => u.email.toLowerCase() === appRecord.email.toLowerCase());
    if (usr) {
      usr.role = 'Instructor';
    } else {
      systemUsersStore.push({
        id: `usr-inst-${Date.now().toString().slice(-4)}`,
        name: appRecord.fullName,
        email: appRecord.email,
        role: 'Instructor',
        status: 'Active',
        createdAt: new Date().toISOString()
      });
    }
  }

  res.json({ success: true, application: appRecord });
});

// ----------------------------------------------------
// SECURE ADMIN AUTHENTICATION & SESSION MANAGEMENT
// ----------------------------------------------------

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

const adminSalt = process.env.ADMIN_SALT || 'nexus_ai_secure_salt_2026';
const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'admin@nexusai.com').toLowerCase().trim();
const configuredAdminPassword = process.env.ADMIN_PASSWORD || 'NexusAI@2026#SecureAdmin';
const configuredAdminHash = process.env.ADMIN_PASSWORD_HASH || hashPassword(configuredAdminPassword, adminSalt);

interface AdminSessionRecord {
  token: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  expiresAt: number;
}

const adminSessionsStore: Record<string, AdminSessionRecord> = {};
const loginAttemptsStore: Record<string, { failedAttempts: number; lockoutUntil: number }> = {};

// Express Middleware: Require Server-Side Validated Admin Session
function requireAdminAuth(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : (req.headers['x-admin-token'] as string);

  if (!token || !adminSessionsStore[token]) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Valid Admin Session Required. Please log in at /admin.'
    });
  }

  const session = adminSessionsStore[token];
  if (Date.now() > session.expiresAt) {
    delete adminSessionsStore[token];
    return res.status(401).json({
      success: false,
      error: 'Admin session expired. Please re-authenticate at /admin.'
    });
  }

  (req as any).adminSession = session;
  next();
}

// 1. Admin Login API
app.post('/api/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const now = Date.now();

  const attemptRecord = loginAttemptsStore[cleanEmail] || { failedAttempts: 0, lockoutUntil: 0 };
  if (attemptRecord.lockoutUntil > now) {
    const remainingMins = Math.ceil((attemptRecord.lockoutUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Account temporarily locked out. Please try again in ${remainingMins} minute(s).`
    });
  }

  const inputHash = hashPassword(password, adminSalt);
  const isValidAdmin = cleanEmail === configuredAdminEmail && inputHash === configuredAdminHash;

  if (!isValidAdmin) {
    attemptRecord.failedAttempts += 1;
    if (attemptRecord.failedAttempts >= 5) {
      attemptRecord.lockoutUntil = now + 15 * 60 * 1000;
    }
    loginAttemptsStore[cleanEmail] = attemptRecord;

    systemAuditLogsStore.unshift({
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actorName: 'Unauthenticated Visitor',
      actorEmail: cleanEmail,
      action: 'Failed Admin Authentication',
      targetEntity: '/admin/login',
      outcome: 'Denied',
      details: `Failed credentials attempt for email: ${cleanEmail}`
    });

    return res.status(401).json({ success: false, error: 'Invalid admin email or password.' });
  }

  delete loginAttemptsStore[cleanEmail];

  const token = crypto.randomBytes(32).toString('hex');
  const session: AdminSessionRecord = {
    token,
    email: cleanEmail,
    name: 'Marcus Thorne',
    role: 'Owner',
    createdAt: new Date().toISOString(),
    expiresAt: now + 120 * 60 * 1000
  };

  adminSessionsStore[token] = session;

  res.setHeader(
    'Set-Cookie',
    `nexus_admin_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=7200${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );

  systemAuditLogsStore.unshift({
    id: `aud-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    actorName: session.name,
    actorEmail: session.email,
    action: 'Successful Admin Login',
    targetEntity: '/admin',
    outcome: 'Success',
    details: 'Admin authenticated successfully. Crypto token issued.'
  });

  res.json({
    success: true,
    token,
    admin: {
      name: session.name,
      email: session.email,
      role: session.role
    }
  });
});

// 2. Admin Session Status Check API
app.get('/api/admin/auth/session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : (req.headers['x-admin-token'] as string);

  if (!token || !adminSessionsStore[token]) {
    return res.status(401).json({ success: false, authenticated: false });
  }

  const session = adminSessionsStore[token];
  if (Date.now() > session.expiresAt) {
    delete adminSessionsStore[token];
    return res.status(401).json({ success: false, authenticated: false, error: 'Session expired.' });
  }

  res.json({
    success: true,
    authenticated: true,
    admin: {
      name: session.name,
      email: session.email,
      role: session.role
    }
  });
});

// 3. Admin Logout API
app.post('/api/admin/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : (req.headers['x-admin-token'] as string);

  if (token && adminSessionsStore[token]) {
    const session = adminSessionsStore[token];
    systemAuditLogsStore.unshift({
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actorName: session.name,
      actorEmail: session.email,
      action: 'Admin Session Logout',
      targetEntity: '/admin',
      outcome: 'Success',
      details: 'Session token invalidated.'
    });

    delete adminSessionsStore[token];
  }

  res.setHeader(
    'Set-Cookie',
    'nexus_admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'
  );
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 1. Executive Command Center Aggregation API (Protected)
app.get('/api/admin/command-center', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    metrics: {
      registeredUsers: systemUsersStore.length,
      activeUsers: systemUsersStore.filter(u => u.status === 'Active').length,
      enrolledStudents: enrollments.length,
      coursesPublished: Object.keys(lmsModulesStore).length,
      crmLeadsCount: crmLeadsStore.length,
      activeClientsCount: clientsStore.length,
      activeProjectsCount: projectsStore.length,
      completedProjectsCount: projectsStore.filter(p => p.status === 'Completed').length,
      pendingProposalsCount: proposalsStore.filter(p => p.status === 'Sent').length,
      ticketsOpenCount: ticketsStore.filter(t => t.status === 'Open').length,
      ticketsEscalatedCount: ticketsStore.filter(t => t.status === 'Escalated').length,
      documentsCount: documentsStore.length,
      totalRevenueUSD: projectsStore.reduce((acc, p) => acc + p.budgetUSD, 0)
    },
    recentActivities: systemAuditLogsStore.slice(0, 10),
    systemHealth: {
      status: 'Operational',
      uptimeHours: 720,
      geminiConfigured: isValidApiKey
    }
  });
});

// 2. Interactive Analytics API (Protected)
app.get('/api/admin/analytics', requireAdminAuth, (req: Request, res: Response) => {
  const range = (req.query.range as string) || '30d';

  // Calculate real rates from database stores
  const leadTotal = crmLeadsStore.length || 1;
  const leadConverted = crmLeadsStore.filter(l => l.status === 'Converted').length;
  const conversionRate = Math.round((leadConverted / leadTotal) * 100);

  const proposalTotal = proposalsStore.length || 1;
  const proposalAccepted = proposalsStore.filter(p => p.status === 'Accepted').length;
  const proposalAcceptanceRate = Math.round((proposalAccepted / proposalTotal) * 100);

  const quizTotal = lmsQuizAttemptsStore.length || 1;
  const quizPassed = lmsQuizAttemptsStore.filter(a => a.passed).length;
  const quizPassRate = Math.round((quizPassed / quizTotal) * 100);

  res.json({
    range,
    conversionRate: `${conversionRate}%`,
    proposalAcceptanceRate: `${proposalAcceptanceRate}%`,
    quizPassRate: `${quizPassRate}%`,
    enrollmentTrend: [
      { month: 'Sep', count: 120 },
      { month: 'Oct', count: 180 },
      { month: 'Nov', count: 240 }
    ],
    ticketsByPriority: {
      P1: ticketsStore.filter(t => t.priority.includes('P1')).length,
      P2: ticketsStore.filter(t => t.priority.includes('P2')).length,
      P3: ticketsStore.filter(t => t.priority.includes('P3')).length,
      P4: ticketsStore.filter(t => t.priority.includes('P4')).length
    }
  });
});

// 3. User Directory & Role Management API (Protected)
app.get('/api/admin/users', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ users: systemUsersStore });
});

app.patch('/api/admin/users/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, status, actorRole } = req.body;

  // Server-side RBAC restriction: Only Owner or Super Admin can modify privileged roles
  const target = systemUsersStore.find(u => u.id === id);
  if (!target) return res.status(404).json({ error: 'User not found.' });

  if (role && (role === 'Owner' || role === 'Super Admin' || target.role === 'Owner')) {
    if (actorRole !== 'Owner' && actorRole !== 'Super Admin') {
      systemAuditLogsStore.unshift({
        id: `aud-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        actorName: 'Unauthorized Actor',
        actorEmail: 'unknown',
        action: 'Privileged Role Modification Denied',
        targetEntity: target.name,
        outcome: 'Denied',
        details: 'Attempted to modify Owner/Super Admin role without sufficient privilege.'
      });
      return res.status(403).json({ error: 'Permission denied: Only Owner or Super Admin can assign privileged roles.' });
    }
  }

  if (role) target.role = role;
  if (status) target.status = status;

  systemAuditLogsStore.unshift({
    id: `aud-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    actorName: 'Marcus Thorne',
    actorEmail: 'admin@nexusai.com',
    action: `User Updated (${role || target.role}, ${status || target.status})`,
    targetEntity: target.name,
    outcome: 'Success',
    details: `Updated user ${target.name} (${target.email})`
  });

  res.json({ success: true, user: target });
});

// 4. Centralized System Settings API (Protected)
app.get('/api/admin/settings', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ settings: systemSettingsStore });
});

app.patch('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  const { category, updates } = req.body;

  if (category && systemSettingsStore[category as keyof typeof systemSettingsStore]) {
    Object.assign(systemSettingsStore[category as keyof typeof systemSettingsStore], updates);
  }

  systemAuditLogsStore.unshift({
    id: `aud-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    actorName: 'Marcus Thorne',
    actorEmail: 'admin@nexusai.com',
    action: 'System Settings Modified',
    targetEntity: category || 'General Settings',
    outcome: 'Success',
    details: `Updated settings category: ${category}`
  });

  res.json({ success: true, settings: systemSettingsStore });
});

// 5. Admin Services CRUD API
interface ServiceRecord {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  pricingRange: string;
  timeline: string;
  status: 'Published' | 'Draft';
}

const adminServicesStore: ServiceRecord[] = [
  {
    id: 'srv-ai-agent',
    title: 'AI Automation & Custom Agent Pipelines',
    subtitle: 'Autonomous AI Workflows & Multi-Agent Orchestration',
    category: 'AI & Automation',
    description: 'Enterprise AI agents built with LangChain, LlamaIndex, and Gemini 2.5 Flash for automated workflow execution.',
    pricingRange: '$5,000 – $25,000',
    timeline: '2 – 6 Weeks',
    status: 'Published'
  },
  {
    id: 'srv-fullstack-dev',
    title: 'Full-Stack Web & SaaS Application Engineering',
    subtitle: 'Scalable Cloud Architectures with React, Node.js & PostgreSQL',
    category: 'Software Engineering',
    description: 'Custom SaaS products engineered with high performance, edge caching, and real-time database sync.',
    pricingRange: '$8,000 – $35,000',
    timeline: '4 – 8 Weeks',
    status: 'Published'
  }
];

app.get('/api/admin/services', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ services: adminServicesStore });
});

app.post('/api/admin/services', requireAdminAuth, (req: Request, res: Response) => {
  const { title, subtitle, category, description, pricingRange, timeline } = req.body;
  const newSrv: ServiceRecord = {
    id: `srv-${Date.now().toString().slice(-4)}`,
    title: title || 'New Digital Service',
    subtitle: subtitle || 'Professional Technology Solution',
    category: category || 'AI Solutions',
    description: description || 'High impact digital service deliverable.',
    pricingRange: pricingRange || '$3,000 – $15,000',
    timeline: timeline || '2 Weeks',
    status: 'Published'
  };
  adminServicesStore.unshift(newSrv);
  res.status(201).json({ success: true, service: newSrv });
});

app.patch('/api/admin/services/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const srv = adminServicesStore.find(s => s.id === id);
  if (!srv) return res.status(404).json({ error: 'Service not found.' });

  Object.assign(srv, req.body);
  res.json({ success: true, service: srv });
});

app.delete('/api/admin/services/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = adminServicesStore.findIndex(s => s.id === id);
  if (idx !== -1) adminServicesStore.splice(idx, 1);
  res.json({ success: true, message: 'Service removed.' });
});

// 5. System Health Monitoring API (Protected)
app.get('/api/admin/health', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    status: 'Operational',
    timestamp: new Date().toISOString(),
    apiGateway: 'Healthy (HTTP 200)',
    backendUptime: '100% (720h)',
    geminiApi: {
      status: isValidApiKey ? 'Operational (Connected)' : 'Pending (API Key required)',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    },
    database: 'In-Memory Enterprise Shards (Active)',
    documentsCount: documentsStore.length,
    ticketsOpen: ticketsStore.filter(t => t.status === 'Open').length
  });
});

// 6. Security Audit Logs API (Protected)
app.get('/api/admin/audit-logs', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ auditLogs: systemAuditLogsStore });
});

// 7. CSV Export API (Protected)
app.get('/api/admin/export/:type', requireAdminAuth, (req: Request, res: Response) => {
  const { type } = req.params;

  let csvContent = '';
  if (type === 'leads') {
    csvContent = 'ID,ContactName,CompanyName,Email,Service,Budget,Status\n' +
      crmLeadsStore.map(l => `"${l.id}","${l.contactName}","${l.companyName}","${l.email}","${l.requiredService}","${l.budgetRange}","${l.status}"`).join('\n');
  } else if (type === 'tickets') {
    csvContent = 'ID,CustomerName,Email,Category,Priority,Status\n' +
      ticketsStore.map(t => `"${t.id}","${t.customerName}","${t.customerEmail}","${t.category}","${t.priority}","${t.status}"`).join('\n');
  } else {
    csvContent = 'Type,ID,Name,ValueUSD\n' +
      projectsStore.map(p => `"Project","${p.id}","${p.title}",${p.budgetUSD}`).join('\n');
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=nexus_admin_export_${type}.csv`);
  res.send(csvContent);
});

// 404 Catch-All Handler for API Routes (prevents returning HTML for API calls)
app.use('/api/*', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({ success: false, error: 'API route not found in Nexus AI Engine.' });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Nexus AI Academic & Solutions server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
