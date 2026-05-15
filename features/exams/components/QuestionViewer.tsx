"use client";

import { useEffect, useState, useRef } from "react";
import { getQuestionPaper, submitOption } from "../../students/api/students.api";

interface QuestionViewerProps {
  examId: number;
  questionPaperId: string;
  durationMinutes: number;
  onFinish: () => void;
}

export default function QuestionViewer({ examId, questionPaperId, durationMinutes, onFinish }: QuestionViewerProps) {
  const [questionPaper, setQuestionPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  // Submission state
  const [currentQuestionNo, setCurrentQuestionNo] = useState("1");
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roughWorkFile, setRoughWorkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected option when question number changes
  useEffect(() => {
    setSelectedOption(answersMap[currentQuestionNo] || null);
  }, [currentQuestionNo, answersMap]);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const data = await getQuestionPaper(questionPaperId);
        setQuestionPaper(data);
      } catch (err: any) {
        setError(err.message || "Failed to load question paper.");
      } finally {
        setLoading(false);
      }
    };

    if (questionPaperId) {
      fetchPaper();
    }
  }, [questionPaperId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRoughWorkFile(e.target.files[0]);
      setSubmitError("");
    }
  };

  const handleOptionSubmit = async () => {
    if (!selectedOption) {
      setSubmitError("Please select an option (A, B, C, or D)");
      return;
    }
    if (!roughWorkFile) {
      setSubmitError("Rough work submission is mandatory for every answer");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      formData.append("exam_id", examId.toString());
      formData.append("question_id", currentQuestionNo);
      formData.append("selected_option", selectedOption);
      formData.append("file", roughWorkFile);

      await submitOption(formData);
      
      setSubmitSuccess(true);
      // We keep the selected option in the answersMap so it stays visible
      
      setRoughWorkFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Auto clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevQuestion = () => {
    const prev = parseInt(currentQuestionNo);
    if (prev > 1) {
      setCurrentQuestionNo((prev - 1).toString());
    }
  };

  const handleNextQuestion = () => {
    const next = parseInt(currentQuestionNo);
    setCurrentQuestionNo((next + 1).toString());
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin h-10 w-10 text-cyan-500 mb-4 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full" />
        <p className="text-gray-400">Loading your question paper...</p>
      </div>
    );
  }

  if (error || !questionPaper) {
    return (
      <div className="p-10 text-center bg-red-500/10 border border-red-500/20 rounded-3xl">
        <p className="text-red-400 font-medium">{error || "Could not load the question paper."}</p>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
  const pdfUrl = `${baseUrl}/${questionPaper.image_url.replace(/\\/g, '/')}`;

  return (
    <div className="w-full max-w-[1400px] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Header with Timer */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl gap-4 sm:gap-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="truncate">
            <h3 className="text-base sm:text-lg font-bold text-white truncate">Exam in Progress</h3>
            <p className="text-[9px] sm:text-[11px] text-gray-500 uppercase tracking-widest truncate">Question Paper ID: {questionPaperId}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
          <div className="text-left sm:text-right">
            <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Time Left</p>
            <div className={`text-xl sm:text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <button 
            onClick={onFinish}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold transition-all text-xs sm:text-sm"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Layout: 70% PDF, 30% Interaction */}
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[75vh]">
        {/* Left 70%: PDF Viewer */}
        <div className="w-full lg:w-[70%] h-[50vh] sm:h-[60vh] lg:h-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative">
          <iframe 
            src={`${pdfUrl}#toolbar=0&navpanes=0`} 
            className="w-full h-full border-none"
            title="Question Paper"
          />
        </div>

        {/* Right 30%: Interaction Panel */}
        <div className="w-full lg:w-[30%] h-auto lg:h-full flex flex-col gap-4">
          <div className="flex-1 p-6 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl overflow-y-auto">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">?</span>
              Answering Panel
            </h4>

            {/* Question Selector */}
            <div className="mb-6">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] mb-2 block">
                Current Question Number
              </label>
              <input 
                type="number" 
                min="1"
                value={currentQuestionNo}
                onChange={(e) => setCurrentQuestionNo(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Options Selector */}
            <div className="mb-6">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] mb-3 block">
                Select Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { 
                      const lowerOpt = opt.toLowerCase();
                      setSelectedOption(lowerOpt); 
                      setAnswersMap(prev => ({ ...prev, [currentQuestionNo]: lowerOpt }));
                      setSubmitError(""); 
                    }}
                    className={`h-12 rounded-xl border font-bold uppercase transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden ${
                      selectedOption === opt.toLowerCase()
                        ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/[0.08]'
                    }`}
                  >
                    {selectedOption === opt.toLowerCase() && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                    )}
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-colors ${
                      selectedOption === opt.toLowerCase() ? 'border-white/50 bg-white/20' : 'border-gray-600 group-hover:border-gray-400'
                    }`}>
                      {opt}
                    </span>
                    <span className="tracking-tight text-xs">OPTION {opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rough Work Upload */}
            <div className="mb-8">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] mb-3 block">
                Mandatory Rough Work
              </label>
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                  roughWorkFile ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf"
                />
                <svg className={`w-6 h-6 mx-auto mb-2 ${roughWorkFile ? 'text-cyan-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-[11px] font-medium text-gray-400 truncate px-2">
                  {roughWorkFile ? roughWorkFile.name : "Upload calculations/rough work"}
                </p>
                <p className="text-[9px] text-gray-600 mt-1">Images or PDF allowed</p>
              </div>
            </div>

            {/* Error/Success Messages */}
            {submitError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Answer submitted successfully!
              </div>
            )}

            {/* Submit & Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevQuestion}
                className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-lg shrink-0"
                title="Previous Question"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleOptionSubmit}
                disabled={submitting}
                className={`flex-1 h-12 sm:h-14 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 sm:gap-3 ${
                  submitting 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5'
                }`}
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="truncate text-xs sm:text-sm">Submit {currentQuestionNo}</span>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>

              <button
                onClick={handleNextQuestion}
                className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-lg shrink-0"
                title="Next Question"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-gray-500 italic">
              Progress auto-saved. Question {currentQuestionNo} of the exam paper.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
