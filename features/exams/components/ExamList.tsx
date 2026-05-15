"use client";

import { useEffect, useState } from "react";
import { getExams } from "../api/exams.api";
import { copyToClipboard } from "@/lib/utils";


export default function ExamList() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);


  const fetchExams = async () => {
    try {
      const data = await getExams();
      setExams(data);
    } catch (err: any) {
      setError(err.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="animate-spin h-6 w-6 text-emerald-500 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full" />
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
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Active Exams
        </h3>
        <button 
          onClick={fetchExams}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.length === 0 ? (
          <div className="col-span-full p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-gray-500 italic">No exams created yet.</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div 
              key={exam.id}
              className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {exam.name}
                  </h4>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">
                    Course ID: {exam.course} • Year {exam.year}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                  exam.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {exam.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 my-3 text-[13px]">
                <div className="space-y-1">
                  <p className="text-gray-500 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duration
                  </p>
                  <p className="text-gray-300 font-medium">{exam.duration_minute} mins</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Total Marks
                  </p>
                  <p className="text-gray-300 font-medium">{exam.total_marks}</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <p className="text-[11px] text-gray-500 uppercase tracking-widest">Shareable Link</p>
                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                  <input 
                    type="text" 
                    readOnly 
                    value={`http://localhost:3000/exam/${exam.exam_link}`} 
                    className="bg-transparent text-[11px] text-gray-400 w-full focus:outline-none" 
                  />
                  <button 
                    onClick={async () => {
                      const link = `http://localhost:3000/exam/${exam.exam_link}`;
                      const success = await copyToClipboard(link);
                      if (success) {
                        setCopiedId(exam.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }
                    }}
                    className={`p-1.5 rounded transition-all ${
                      copiedId === exam.id 
                        ? 'bg-emerald-500 text-white' 
                        : 'hover:bg-white/10 text-gray-400 hover:text-emerald-400'
                    }`}
                    title={copiedId === exam.id ? "Copied!" : "Copy to clipboard"}
                  >
                    {copiedId === exam.id ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>

                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-[10px] text-gray-600">
                  Created: {new Date(exam.created_at).toLocaleDateString()}
                </p>
                <button className="text-[11px] font-bold text-emerald-400/80 hover:text-emerald-400 transition-colors uppercase tracking-widest">
                  View Results →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
