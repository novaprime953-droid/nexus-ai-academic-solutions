import React, { useState, useRef } from 'react';
import { AIToolItem } from '../types';
import { PDFDocument } from 'pdf-lib';
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Send,
  Loader2,
  RefreshCw,
  Sparkles,
  FileText,
  Upload,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface ToolDetailPageProps {
  tool: AIToolItem;
  onBack: () => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common tool inputs
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Greetings. I am your Nexus AI Assistant. How can I assist your engineering, curriculum, or architecture workflows today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Content & Text fields
  const [topic, setTopic] = useState('Next-Generation Autonomous AI Agents in Enterprise Systems');
  const [tone, setTone] = useState('Authoritative & Insightful');
  const [format, setFormat] = useState('Executive Architecture Brief');
  const [keywords, setKeywords] = useState('autonomous agents, transformer memory, vector embeddings');
  const [recipient, setRecipient] = useState('Chief Technology Officer');
  const [purpose, setPurpose] = useState('Proposing an AI automation audit and technical proof of concept');
  const [textInput, setTextInput] = useState('');
  const [outputResult, setOutputResult] = useState('');

  // Code Assistant fields
  const [codeLang, setCodeLang] = useState('TypeScript / React');
  const [codeTask, setCodeTask] = useState('Create a resilient caching hook with exponential backoff and retry');
  const [codeSnippet, setCodeSnippet] = useState('');

  // Image & Canvas Tools
  const [imagePrompt, setImagePrompt] = useState('Cybernetic neural nexus core with glowing fiber optics and isometric geometry');
  const [imageStyle, setImageStyle] = useState('Holographic Minimalist');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageQuality, setImageQuality] = useState(70);
  const [imageFormatTarget, setImageFormatTarget] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);

  // PDF tools
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [splitPageRange, setSplitPageRange] = useState('1');
  const [pdfOutputBlobUrl, setPdfOutputBlobUrl] = useState<string | null>(null);

  // Canvas ref for image tools
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. CHAT
  const handleSendChat = async () => {
    if (!chatInput.trim() || loading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    const updated = [...chatMessages, { role: 'user' as const, text: userMsg }];
    setChatMessages(updated);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setChatMessages([...updated, { role: 'assistant', text: data.reply }]);
    } catch (err: any) {
      setError(err.message || 'Chat generation failed. Check API key status.');
    } finally {
      setLoading(false);
    }
  };

  // 2. CONTENT WRITER
  const handleGenerateContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/content-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, format }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Content generation failed');
      setOutputResult(data.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. BLOG GENERATOR
  const handleGenerateBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/blog-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Blog generation failed');
      setOutputResult(data.article);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. EMAIL WRITER
  const handleGenerateEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/email-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose,
          recipientRole: recipient,
          keyPoints: topic,
          tone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Email generation failed');
      setOutputResult(data.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. SUMMARIZER
  const handleSummarize = async () => {
    if (!textInput.trim()) {
      setError('Please paste text to summarize.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Summarization failed');
      setOutputResult(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. SEO META
  const handleGenerateSEOMeta = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/seo-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: topic,
          pageDescription: textInput || 'High performance AI education and software solutions.',
          targetKeywords: keywords,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'SEO generation failed');
      setOutputResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 7. KEYWORD ANALYZER
  const handleAnalyzeKeywords = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/keyword-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: topic,
          niche: 'AI & Enterprise Software',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Keyword analysis failed');
      setOutputResult(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 8. CODE ASSISTANT
  const handleGenerateCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/code-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: codeLang,
          task: codeTask,
          codeSnippet,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Code generation failed');
      setOutputResult(data.code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 9. AI IMAGE GENERATOR (Creative procedural canvas synth)
  const handleGenerateCanvasArt = () => {
    setLoading(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setLoading(false);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = (canvas.width = 1024);
      const h = (canvas.height = 768);

      // Procedural artistic neural landscape
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#101A3B');
      grad.addColorStop(0.5, '#172554');
      grad.addColorStop(1, '#1E2958');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Abstract geometric grid & glowing concentric energy nodes
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.strokeStyle = 'rgba(67, 97, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Central Luminous Core
      const radial = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 380);
      radial.addColorStop(0, '#00D9FF');
      radial.addColorStop(0.2, 'rgba(67, 97, 255, 0.8)');
      radial.addColorStop(0.6, 'rgba(139, 92, 246, 0.3)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 380, 0, Math.PI * 2);
      ctx.fill();

      // Cybernetic rings and data lines
      for (let i = 0; i < 7; i++) {
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 217, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70 + i * 40, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Typography overlay
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(imagePrompt, w / 2, h - 80);

      ctx.fillStyle = 'rgba(0, 217, 255, 0.8)';
      ctx.font = '500 14px "JetBrains Mono", monospace';
      ctx.fillText(`NEXUS SYNTHESIS // STYLE: ${imageStyle.toUpperCase()}`, w / 2, h - 45);

      setLoading(false);
    }, 600);
  };

  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nexus_ai_render_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // 10. PDF MERGER (Real browser pdf-lib implementation)
  const handleMergePDFs = async () => {
    if (pdfFiles.length < 2) {
      setError('Please upload at least two PDF files to merge.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of pdfFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfOutputBlobUrl(url);
    } catch (err: any) {
      setError('Failed to merge PDFs. Verify files are valid non-encrypted PDFs.');
    } finally {
      setLoading(false);
    }
  };

  // 11. PDF SPLITTER
  const handleSplitPDF = async () => {
    if (pdfFiles.length === 0) {
      setError('Please upload a PDF file to split.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const arrayBuffer = await pdfFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      const pageNum = parseInt(splitPageRange.trim(), 10);
      if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Page must be between 1 and ${totalPages}`);
      }

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNum - 1]);
      newPdf.addPage(copiedPage);

      const bytes = await newPdf.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfOutputBlobUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to split PDF.');
    } finally {
      setLoading(false);
    }
  };

  // 12. IMAGE COMPRESSOR & CONVERTER
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageCompression = () => {
    if (!filePreview) return;
    const img = new window.Image();
    img.src = filePreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setCompressedBlobUrl(url);
          }
        },
        imageFormatTarget,
        imageQuality / 100
      );
    };
  };

  // 13. BACKGROUND REMOVER (Chroma/Threshold processor)
  const processBackgroundRemoval = () => {
    if (!filePreview) return;
    const img = new window.Image();
    img.src = filePreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample top-left corner as candidate background color
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      const threshold = 48;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
        if (dist < threshold) {
          data[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCompressedBlobUrl(url);
        }
      }, 'image/png');
    };
  };

  // 14. TEXT FORMATTER ACTIONS
  const handleFormatText = (
    action: 'uppercase' | 'lowercase' | 'title' | 'camel' | 'cleanJson' | 'cleanMarkdown'
  ) => {
    let res = textInput;
    if (action === 'uppercase') res = textInput.toUpperCase();
    if (action === 'lowercase') res = textInput.toLowerCase();
    if (action === 'title') {
      res = textInput.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    if (action === 'camel') {
      res = textInput
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
        .replace(/\s+/g, '');
    }
    if (action === 'cleanJson') {
      try {
        const obj = JSON.parse(textInput);
        res = JSON.stringify(obj, null, 2);
      } catch (e) {
        setError('Invalid JSON string');
        return;
      }
    }
    if (action === 'cleanMarkdown') {
      res = textInput.replace(/[#*`_~]/g, '');
    }
    setOutputResult(res);
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All AI Tools</span>
        </button>

        {/* Tool Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span>{tool.category}</span>
              <span>·</span>
              <span className="text-cyan-400 font-medium">{tool.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{tool.title}</h1>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">{tool.description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Ready for processing</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Operation Notice</p>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* TOOL SPECIFIC WORKSPACE */}

        {/* 1. CHAT ASSISTANT */}
        {tool.id === 'ai-chat-assistant' && (
          <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-[650px] overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-white/5 border border-white/10 text-slate-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Synthesizing response with Gemini 2.5 Flash...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#4263FF]/20 bg-[#172554]/90 backdrop-blur-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask any technical question, architecture design, or code explanation..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={loading || !chatInput.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 2. CONTENT WRITER, BLOG, EMAIL, SUMMARIZER, SEO, KEYWORD, CODE */}
        {[
          'ai-content-writer',
          'ai-blog-generator',
          'ai-email-writer',
          'ai-summarizer',
          'seo-meta-generator',
          'keyword-analyzer',
          'code-assistant',
        ].includes(tool.id) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Column */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-base font-semibold text-white">Input Specifications</h2>

              {tool.id === 'ai-content-writer' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Topic or Brief</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Tone</label>
                      <input
                        type="text"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Format</label>
                      <input
                        type="text"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateContent}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generate Executive Content</span>
                  </button>
                </>
              )}

              {tool.id === 'ai-blog-generator' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Article Subject / Title</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Target Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleGenerateBlog}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generate Structured Blog Post</span>
                  </button>
                </>
              )}

              {tool.id === 'ai-email-writer' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Recipient Title / Role</label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Objective / Purpose</label>
                    <input
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Key Points</label>
                    <textarea
                      rows={3}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleGenerateEmail}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Draft High-Conversion Email</span>
                  </button>
                </>
              )}

              {tool.id === 'ai-summarizer' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Raw Text or Document Content</label>
                    <textarea
                      rows={8}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste research papers, meeting notes, articles, or transcripts here..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={handleSummarize}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generate Executive Summary</span>
                  </button>
                </>
              )}

              {tool.id === 'seo-meta-generator' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Page Title or Concept</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Keywords</label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleGenerateSEOMeta}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generate Optimized Meta Tags</span>
                  </button>
                </>
              )}

              {tool.id === 'keyword-analyzer' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Core Seed Keyword</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. AI automation workflows"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={handleAnalyzeKeywords}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Analyze Search Intent &amp; Clusters</span>
                  </button>
                </>
              )}

              {tool.id === 'code-assistant' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Stack / Language</label>
                    <input
                      type="text"
                      value={codeLang}
                      onChange={(e) => setCodeLang(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Engineering Task</label>
                    <input
                      type="text"
                      value={codeTask}
                      onChange={(e) => setCodeTask(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Optional Code Snippet to Refactor</label>
                    <textarea
                      rows={5}
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      placeholder="// Paste code here..."
                      className="w-full font-mono text-xs bg-white/5 border border-white/10 rounded-lg p-2.5 text-slate-300 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleGenerateCode}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generate Production Code</span>
                  </button>
                </>
              )}
            </div>

            {/* Output Column */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full min-h-[460px]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Generated Output
                </span>
                {outputResult && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-slate-300 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
                    <div className="flex items-center gap-1.5">
                      {[40, 70, 100, 60, 85, 45, 90].map((h, i) => (
                        <span
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-blue-600 via-cyan-400 to-violet-500 rounded-full animate-pulse"
                          style={{
                            height: `${h * 0.45}px`,
                            animationDelay: `${i * 0.12}s`,
                            animationDuration: '0.9s',
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-semibold text-white">Synthesizing Intelligence with Gemini 2.5 Flash</p>
                      <p className="text-[11px] text-slate-400">Executing server-side reasoning &amp; formatting...</p>
                    </div>
                  </div>
                ) : outputResult ? (
                  <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {outputResult}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                    <FileText className="w-8 h-8 opacity-40" />
                    <p className="text-xs">Specify your input parameters and click generate to synthesize output.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 9. AI IMAGE GENERATOR */}
        {tool.id === 'ai-image-generator' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Visual Prompt</label>
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Artistic Style</label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full bg-[#172554] border border-[#4263FF]/30 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                >
                  <option>Holographic Minimalist</option>
                  <option>Cyberpunk Obsidian</option>
                  <option>Deep Neural Wireframe</option>
                  <option>Clean Quantum Isometric</option>
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                <button
                  onClick={handleGenerateCanvasArt}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span>Synthesize Concept Render</span>
                </button>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full rounded-xl border border-[#4263FF]/20 shadow-2xl block bg-[#101A3B]"
                style={{ maxHeight: '480px' }}
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={downloadCanvasImage}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res Render (PNG)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 10, 11, 12: PDF UTILITIES (Merger, Splitter, Compressor) */}
        {['pdf-merger', 'pdf-splitter', 'pdf-compressor'].includes(tool.id) && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Upload PDF Document(s)
              </label>
              <div className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-colors">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <input
                  type="file"
                  accept="application/pdf"
                  multiple={tool.id === 'pdf-merger'}
                  onChange={(e) => {
                    if (e.target.files) {
                      setPdfFiles(Array.from(e.target.files));
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                <p className="text-xs text-slate-500 mt-2">
                  All PDF operations are processed locally in your browser memory for total privacy.
                </p>
              </div>
            </div>

            {pdfFiles.length > 0 && (
              <div className="p-4 bg-white/5 rounded-xl space-y-2 text-xs">
                <p className="font-semibold text-slate-300">Selected Files:</p>
                {pdfFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                      {f.name}
                    </span>
                    <span>{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            )}

            {tool.id === 'pdf-splitter' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Extract Page Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={splitPageRange}
                  onChange={(e) => setSplitPageRange(e.target.value)}
                  className="w-32 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white"
                />
              </div>
            )}

            <div className="flex gap-3">
              {tool.id === 'pdf-merger' && (
                <button
                  onClick={handleMergePDFs}
                  disabled={loading || pdfFiles.length < 2}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>Merge {pdfFiles.length} PDF Documents</span>
                </button>
              )}

              {tool.id === 'pdf-splitter' && (
                <button
                  onClick={handleSplitPDF}
                  disabled={loading || pdfFiles.length === 0}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>Split &amp; Extract Page</span>
                </button>
              )}

              {tool.id === 'pdf-compressor' && (
                <button
                  onClick={handleMergePDFs}
                  disabled={loading || pdfFiles.length === 0}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>Optimize &amp; Flatten PDF</span>
                </button>
              )}

              {pdfOutputBlobUrl && (
                <a
                  href={pdfOutputBlobUrl}
                  download={`nexus_processed_${Date.now()}.pdf`}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Processed PDF</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 13, 14, 15: IMAGE TOOLS (Compressor, Background Remover, Converter) */}
        {['image-compressor', 'background-remover', 'image-converter'].includes(tool.id) && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-colors">
              <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              <p className="text-xs text-slate-500 mt-2">Supports JPG, PNG, WEBP. Real-time canvas processing.</p>
            </div>

            {filePreview && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Original Image</p>
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg object-contain"
                  />
                  {originalSize && (
                    <p className="text-xs text-slate-400 mt-2">
                      Original Size: {(originalSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>

                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Processed Output</p>
                  {compressedBlobUrl ? (
                    <div>
                      <img
                        src={compressedBlobUrl}
                        alt="Compressed Preview"
                        className="max-h-64 mx-auto rounded-lg object-contain bg-slate-900/50 border border-white/10"
                      />
                      {compressedSize && (
                        <p className="text-xs text-emerald-400 font-semibold mt-2">
                          New Size: {(compressedSize / 1024).toFixed(1)} KB (
                          {Math.round(((originalSize! - compressedSize) / originalSize!) * 100)}% reduction)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                      Click process button below to preview result.
                    </div>
                  )}
                </div>
              </div>
            )}

            {tool.id === 'image-compressor' && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Compression Quality: {imageQuality}%</span>
                  <span>Higher quality produces crisper images</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <button
                  onClick={processImageCompression}
                  disabled={!filePreview}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
                >
                  Compress Image Now
                </button>
              </div>
            )}

            {tool.id === 'background-remover' && (
              <div>
                <p className="text-xs text-slate-400 mb-3">
                  Removes flat background colors utilizing edge-delta chroma sampling and outputs transparent PNGs.
                </p>
                <button
                  onClick={processBackgroundRemoval}
                  disabled={!filePreview}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
                >
                  Remove Solid Background
                </button>
              </div>
            )}

            {tool.id === 'image-converter' && (
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs text-slate-400">Target Format:</span>
                <select
                  value={imageFormatTarget}
                  onChange={(e) => setImageFormatTarget(e.target.value as any)}
                  className="bg-[#172554] border border-[#4263FF]/30 rounded-lg p-2 text-xs text-white"
                >
                  <option value="image/webp">WEBP (Modern &amp; Ultra-Light)</option>
                  <option value="image/png">PNG (Lossless &amp; Transparent)</option>
                  <option value="image/jpeg">JPEG (Universal)</option>
                </select>
                <button
                  onClick={processImageCompression}
                  disabled={!filePreview}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
                >
                  Convert Format
                </button>
              </div>
            )}

            {compressedBlobUrl && (
              <div className="pt-2">
                <a
                  href={compressedBlobUrl}
                  download={`nexus_processed_${Date.now()}.${
                    imageFormatTarget === 'image/webp'
                      ? 'webp'
                      : imageFormatTarget === 'image/png'
                      ? 'png'
                      : 'jpg'
                  }`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Processed Image</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* 16. TEXT FORMATTER */}
        {tool.id === 'text-formatter' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Source Text</label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste raw text, JSON, or markdown to inspect & format..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleFormatText('uppercase')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => handleFormatText('lowercase')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
              >
                lowercase
              </button>
              <button
                onClick={() => handleFormatText('title')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
              >
                Title Case
              </button>
              <button
                onClick={() => handleFormatText('camel')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
              >
                camelCase
              </button>
              <button
                onClick={() => handleFormatText('cleanJson')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
              >
                Beautify JSON
              </button>
              <button
                onClick={() => handleFormatText('cleanMarkdown')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
              >
                Strip Markdown
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl text-center text-xs">
              <div>
                <p className="text-slate-400">Characters</p>
                <p className="text-lg font-bold text-white mt-1">{textInput.length}</p>
              </div>
              <div>
                <p className="text-slate-400">Words</p>
                <p className="text-lg font-bold text-white mt-1">
                  {textInput.trim() ? textInput.trim().split(/\s+/).length : 0}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Est. Reading Time</p>
                <p className="text-lg font-bold text-white mt-1">
                  {Math.ceil((textInput.trim() ? textInput.trim().split(/\s+/).length : 0) / 200)} min
                </p>
              </div>
            </div>

            {outputResult && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Formatted Result:</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-[#101A3B]/70 border border-[#4263FF]/30 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                  {outputResult}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
