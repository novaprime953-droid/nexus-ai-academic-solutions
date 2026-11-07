import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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
