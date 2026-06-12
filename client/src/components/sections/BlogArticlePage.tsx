import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft, Calendar, User, Clock, Share2, Tag, ArrowRight, ExternalLink, Globe, Mail } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useApp } from '../../AppContext';

interface AuthorProfile {
  _id: string;
  name: string;
  designation?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}


export default function BlogArticlePage() {
  const { selectedBlog, setActiveSection, setActiveSubTab, setSelectedBlog, blogsLoading, blogs } = useApp();
  const [author, setAuthor] = useState<AuthorProfile | null>(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${API_BASE}/api/author`)
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setAuthor(data))
      .catch(() => { });
  }, []);

  // If no blog is selected and we are done loading, go back to blogs
  useEffect(() => {
    if (!selectedBlog && !blogsLoading) {
      setActiveSection('blogs');
      setActiveSubTab('insights');
    }
  }, [selectedBlog, blogsLoading, setActiveSection, setActiveSubTab]);

  if (blogsLoading && !selectedBlog) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-wine" size={48} />
      </div>
    );
  }

  if (!selectedBlog) return null;

  // Estimate reading time (200 words per minute)
  const wordCount = selectedBlog.content?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200) || 5;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-20 pt-28">
      {/* Header Image & Title */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 lg:px-8">
          <button
            onClick={() => {
              setActiveSection('blogs');
              setActiveSubTab('insights');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center text-xs uppercase tracking-widest font-bold hover:translate-x-1 mb-10 transition-all text-wine dark:text-rose-400 font-mono cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-2" />
            CD /BLOGS
          </button>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black dark:text-zinc-50 mb-8 tracking-tighter uppercase leading-[1.1] font-serif"
          >
            {selectedBlog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-gray-500 dark:text-zinc-400 mb-10 tracking-widest uppercase font-bold font-mono">
            <span className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 text-wine dark:bg-zinc-900 dark:border-white/10">
                <User size={14} />
              </div>
              <span className="text-[13px]">{selectedBlog.author || 'Lotlite Source'}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {selectedBlog.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {readingTime} MIN READ
            </span>
            {selectedBlog.category && (
              <span
                className="px-2 py-1 bg-wine/10 text-wine border border-wine/30 dark:bg-rose-500/10 dark:text-rose-400"
              >
                {selectedBlog.category}
              </span>
            )}
          </div>

          {selectedBlog.image && (
            <div className="w-full mt-10 mb-6 flex justify-center">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="max-w-full max-h-[400px] object-contain rounded-sm border border-gray-200 dark:border-white/10"
                onError={(e: any) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>
      </div>

      {/* Layout Container */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">

        {/* Article Content */}
        <article className="w-full">
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:text-black dark:prose-headings:text-white prose-headings:uppercase prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline prose-img:border prose-img:border-gray-200 prose-img:p-1 prose-img:bg-gray-50 text-gray-700 dark:text-zinc-300 leading-relaxed marker:text-wine prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-td:border prose-td:border-gray-300 prose-td:p-3 font-sans"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: () => null // Prevent double headings from markdown content
              }}
            >
              {selectedBlog.content}
            </ReactMarkdown>
          </div>

          {/* Inject wine color for prose links manually */}
          <style dangerouslySetInnerHTML={{
            __html: `
                        .prose a { color: #C21A22; font-weight: bold; }
                        .prose blockquote { border-left-color: #C21A22; background: rgba(194,26,34,0.05); padding: 1rem; }
                        .prose code { color: #C21A22; padding: 0.2rem 0.4rem; border: 1px solid rgba(0,0,0,0.1); }
                    `}} />

          {/* Author Profile Card */}
          {author && (
            <div className="mt-12 mb-10 border-y-2 border-black dark:border-white/20 py-8 flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden border-2 border-black dark:border-white/20 bg-gray-100">
                {author.avatar ? (
                  <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono mb-1">Written by</p>
                <h4 className="text-xl font-black uppercase tracking-tight text-black dark:text-white font-serif">{author.name}</h4>
                {author.designation && (
                  <p className="text-sm font-bold text-wine mt-0.5">{author.designation}</p>
                )}
                {author.bio && (
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mt-3 leading-relaxed">{author.bio}</p>
                )}
                <div className="flex items-center gap-4 mt-4">
                  {author.linkedin && (
                    <a href={author.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">
                      <ExternalLink size={14} /> LinkedIn
                    </a>
                  )}
                  {author.twitter && (
                    <a href={author.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-sky-500 hover:underline uppercase tracking-widest">
                      <ExternalLink size={14} /> Twitter
                    </a>
                  )}
                  {author.website && (
                    <a href={author.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:underline uppercase tracking-widest">
                      <Globe size={14} /> Website
                    </a>
                  )}
                  {author.email && (
                    <a href={`mailto:${author.email}`} className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:underline uppercase tracking-widest">
                      <Mail size={14} /> Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CTA Section Brutalist */}
          <div className="mt-16 p-8 md:p-12 relative overflow-hidden flex flex-col items-start gap-8 group bg-wine border-2 border-black dark:border-white text-black"
          >
            {/* Abstract Decor */}
            <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
              <span className="text-[200px] leading-none font-black text-black">/&gt;</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">
                Build your <br />PropTech Career
              </h3>
              <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                Join Lotlite's elite programs. Let's schedule a deep dive into the admissions process.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveSection('programs');
                setActiveSubTab('brem-admission');
                window.scrollTo(0, 0);
              }}
              className="relative z-10 inline-flex items-center justify-center px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-sm md:text-base border-2 border-black hover:bg-transparent hover:text-black transition-all font-mono cursor-pointer"
            >
              <ArrowRight size={18} className="mr-3" />
              APPLY NOW
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}