"use client";

import { useEffect, useState } from "react";
import { getQuestions } from "../api/questions.api";

export default function QuestionList() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load question papers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="animate-spin h-6 w-6 text-indigo-500 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Question Papers
        </h3>
        <button 
          onClick={fetchQuestions}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-gray-500 italic">No question papers uploaded yet.</p>
          </div>
        ) : (
          questions.map((q) => (
            <div 
              key={q.id}
              className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                    Question Paper #{q.id}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter ${
                      q.difficulty_level === 'hard' ? 'bg-red-500/20 text-red-400' : 
                      q.difficulty_level === 'medium' ? 'bg-orange-500/20 text-orange-400' : 
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {q.difficulty_level}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Uploaded on {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <a 
                  href={`http://localhost:3005/${q.image_url.replace(/\\/g, '/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-indigo-400 transition-all"
                  title="View PDF"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </a>
                <span className="text-xs font-mono text-gray-600 select-all px-2 py-1 bg-black/20 rounded border border-white/5 group-hover:border-indigo-500/20 transition-all">
                  ID: {q.id}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <p className="text-[10px] text-gray-500 text-center mt-2 px-4">
        Use the Question Paper ID (e.g. {questions[0]?.id || "4"}) in the "Course" field when starting a new exam.
      </p>
    </div>
  );
}
