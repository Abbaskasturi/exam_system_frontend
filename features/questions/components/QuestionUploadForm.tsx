"use client";

import { useState, useRef } from "react";
import { uploadQuestionPaper } from "../api/questions.api";

export default function QuestionUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadedId, setUploadedId] = useState<string | undefined>();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await uploadQuestionPaper(file, difficultyLevel);
      setUploadedId(response.id?.toString());
      setSuccess(true);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] p-8 sm:p-10 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
          Prepare Question Paper
        </h2>
        <p className="text-sm text-gray-400">
          Upload a PDF and set the difficulty level
        </p>
      </div>

      {success ? (
        <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center transform transition-all">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 text-green-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-green-400 font-semibold text-lg mb-2">Upload Successful!</h3>
          <p className="text-green-300/70 text-sm mb-4">Your question paper has been added to the system.</p>
          
          {uploadedId && (
            <div className="mb-6 bg-black/30 p-3 rounded-xl border border-white/5 inline-block w-full max-w-xs">
              <span className="text-xs text-gray-400 block mb-1 uppercase tracking-widest">Question Paper ID</span>
              <span className="text-xl font-bold text-white tracking-widest">{uploadedId}</span>
              <p className="text-xs text-indigo-300 mt-2">Use this ID when creating an exam</p>
            </div>
          )}

          <button 
            onClick={() => { setSuccess(false); setUploadedId(undefined); }}
            className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all block mx-auto"
          >
            Upload Another
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

          <div className="space-y-1.5 group">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-purple-400 transition-colors">
              Question Paper (PDF)
            </label>
            <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl hover:border-purple-500/50 bg-black/20 hover:bg-black/40 transition-all cursor-pointer overflow-hidden">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg className={`w-8 h-8 mb-2 ${file ? 'text-purple-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-300 px-4 text-center truncate w-full">
                {file ? file.name : "Click to browse or drag PDF here"}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-purple-400 transition-colors">
              Difficulty Level
            </label>
            <div className="relative">
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="easy" className="bg-gray-900 text-white">Easy</option>
                <option value="medium" className="bg-gray-900 text-white">Medium</option>
                <option value="hard" className="bg-gray-900 text-white">Hard</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="relative w-full mt-6 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Upload Question Paper"
            )}
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>
      )}
    </div>
  );
}
