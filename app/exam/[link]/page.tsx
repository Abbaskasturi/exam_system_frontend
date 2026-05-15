"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getExamDetails } from "@/features/students/api/students.api";
import StudentRegistrationForm from "@/features/students/components/StudentRegistrationForm";
import QuestionViewer from "@/features/exams/components/QuestionViewer";

export default function ExamEntryPage() {
  const params = useParams();
  const link = params.link as string;

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await getExamDetails(link);
        setExam(data);
      } catch (err: any) {
        setError(err.message || "Failed to load exam details.");
      } finally {
        setLoading(false);
      }
    };

    if (link) {
      fetchExam();
    }
  }, [link]);

  const handleRegistrationSuccess = (studentData: any) => {
    setRegistered(true);
    // In a real application, you would transition to the actual Exam Taking component here.
    // For now, we update the state to show the success/dashboard placeholder.
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-cyan-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400 animate-pulse">Loading exam environment...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Exam Not Found</h1>
        <p className="text-gray-400 max-w-md">
          {error || "The exam link you followed is invalid or has expired. Please contact your instructor."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-[family-name:var(--font-geist-sans)] text-white flex flex-col items-center justify-center p-4">
      {/* Dynamic Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-5xl flex flex-col items-center px-2">
        {!registered ? (
          <StudentRegistrationForm 
            instituteId={exam.institute_id} 
            examName={exam.name}
            onSuccess={handleRegistrationSuccess} 
          />
        ) : !finished ? (
          !examStarted ? (
            <div className="w-full text-center animate-in fade-in zoom-in duration-500">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 sm:mb-6">
                Welcome to the Exam Dashboard
              </h1>
              <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto">
                You have successfully registered for <span className="text-white font-semibold">{exam.name}</span>. The exam environment is ready.
              </p>
              
              <div className="p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
                  <div>
                    <p className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider mb-1">Course</p>
                    <p className="text-base sm:text-lg font-medium text-white">{exam.course}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                    <p className="text-base sm:text-lg font-medium text-white">{exam.duration_minute} Minutes</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider mb-1">Total Marks</p>
                    <p className="text-base sm:text-lg font-medium text-white">{exam.total_marks}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider mb-1">Status</p>
                    <p className="text-base sm:text-lg font-medium text-cyan-400">Ready to Begin</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setExamStarted(true)}
                  className="w-full mt-8 sm:mt-10 h-12 sm:h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base sm:text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-1"
                >
                  Start Answering Questions
                </button>
              </div>
            </div>
          ) : (
            <QuestionViewer 
              examId={exam.id}
              questionPaperId={exam.course} // The question paper ID is stored in 'course'
              durationMinutes={exam.duration_minute}
              onFinish={() => {
                setFinished(true);
                setExamStarted(false);
              }}
            />
          )
        ) : (
          <div className="w-full text-center animate-in fade-in zoom-in duration-500">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 sm:mb-6">
              Exam Completed
            </h1>
            <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              Your responses have been recorded. You may now close this window.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 sm:px-10 py-3 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-sm sm:text-base"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
