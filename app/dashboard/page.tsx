"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionUploadForm from "@/features/questions/components/QuestionUploadForm";
import CreateExamForm from "@/features/exams/components/CreateExamForm";

export default function DashboardPage() {
  const router = useRouter();
  const [instituteName, setInstituteName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for auth token
    const token = localStorage.getItem("auth_token");
    const name = localStorage.getItem("institute_name");

    if (!token) {
      // Not logged in, redirect to login
      router.push("/login");
    } else {
      setInstituteName(name || "Institute");
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-[family-name:var(--font-geist-sans)] text-white">
      {/* Background gradients matching auth pages but more spread out */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />
      
      {/* Top Navigation Bar */}
      <nav className="w-full border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-wide">{instituteName} Dashboard</span>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("institute_name");
              router.push("/login");
            }}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-full mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">
              Welcome back, {instituteName}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Manage your exams, upload question papers, and monitor student performance from your dedicated workspace.
            </p>
          </div>

          {/* Grid for Dashboard Cards / Forms */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex justify-center w-full">
              <QuestionUploadForm />
            </div>
            <div className="flex justify-center w-full">
              <CreateExamForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
