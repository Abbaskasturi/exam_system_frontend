"use client";

import { useState } from "react";
import { createExam, ExamData } from "../api/exams.api";
import { copyToClipboard } from "@/lib/utils";


export default function CreateExamForm() {
  const [formData, setFormData] = useState<ExamData>({
    name: "",
    course: "",
    year: 1,
    duration_minute: 60,
    total_marks: 100,
    start_time: "",
    end_time: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGeneratedLink("");
    setCopied(false);

    try {
      // Ensure ISO string format for date inputs
      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };

      const response = await createExam(payload);
      
      if (response && response.link) {
        setGeneratedLink(response.link);
      } else {
        // Fallback in case the backend doesn't return the exact {link: "..."} format expected
        setGeneratedLink(`http://localhost:3000/exam/${response.exam?.exam_link || response.exam?.id || 'unknown'}`);
      }
      
      // Reset form but keep the link visible
      setFormData({
        name: "",
        course: "",
        year: 1,
        duration_minute: 60,
        total_marks: 100,
        start_time: "",
        end_time: "",
        is_active: true,
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during exam creation.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    const success = await copyToClipboard(generatedLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <div className="w-full p-8 sm:p-10 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
          Start New Exam
        </h2>
        <p className="text-sm text-gray-400">
          Configure an exam and generate a shareable link for students
        </p>
      </div>

      {generatedLink ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center transform transition-all animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-emerald-400 font-semibold text-lg mb-2">Exam Link Generated!</h3>
          <p className="text-emerald-300/70 text-sm mb-4">Share this unique link with your students to access the exam.</p>
          
          <div className="flex items-center gap-2 mb-6 bg-black/30 p-2 rounded-xl border border-white/5">
            <input 
              type="text" 
              readOnly 
              value={generatedLink} 
              className="bg-transparent text-gray-300 w-full px-2 text-sm focus:outline-none" 
            />
            <button 
              onClick={handleCopy}

              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                copied 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <button 
            onClick={() => setGeneratedLink("")}
            className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all"
          >
            Create Another Exam
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                Exam Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Math Test"
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                Course (Question Paper ID)
              </label>
              <input
                type="text"
                name="course"
                required
                value={formData.course}
                onChange={handleChange}
                placeholder="MPC or Math 101"
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                Year
              </label>
              <input
                type="number"
                name="year"
                required
                min="1"
                value={formData.year}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                Total Marks
              </label>
              <input
                type="number"
                name="total_marks"
                required
                min="1"
                value={formData.total_marks}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5 group sm:col-span-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                Duration (Minutes)
              </label>
              <input
                type="number"
                name="duration_minute"
                required
                min="1"
                value={formData.duration_minute}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="start_time"
                required
                value={formData.start_time}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all [color-scheme:dark]"
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                End Time
              </label>
              <input
                type="datetime-local"
                name="end_time"
                required
                value={formData.end_time}
                onChange={handleChange}
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full mt-6 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Start Exam"
            )}
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>
      )}
    </div>
  );
}
