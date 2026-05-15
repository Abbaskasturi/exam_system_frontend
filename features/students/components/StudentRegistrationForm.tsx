"use client";

import { useState } from "react";
import { registerStudent } from "../api/students.api";

interface StudentRegistrationFormProps {
  instituteId: number;
  examName: string;
  onSuccess: (studentData: any) => void;
}

export default function StudentRegistrationForm({ instituteId, examName, onSuccess }: StudentRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    year: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerStudent({
        ...formData,
        institute_id: instituteId,
      });
      
      // Save student info and token to local storage
      localStorage.setItem("student_info", JSON.stringify(response));
      if (response.access_token) {
        localStorage.setItem("auth_token", response.access_token);
      }
      
      // Trigger success callback to transition to exam dashboard
      onSuccess(response);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] p-8 sm:p-10 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative inner glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
          Student Details
        </h2>
        <p className="text-sm text-gray-400">
          Please enter your details to begin <span className="font-semibold text-cyan-400">{examName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5 group">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            suppressHydrationWarning
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1.5 group">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            suppressHydrationWarning
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 group">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
              Course
            </label>
            <input
              type="text"
              name="course"
              required
              value={formData.course}
              onChange={handleChange}
              placeholder="B.Sc Maths"
              suppressHydrationWarning
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1.5 group">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
              Year
            </label>
            <input
              type="text"
              name="year"
              required
              value={formData.year}
              onChange={handleChange}
              placeholder="2nd Year"
              suppressHydrationWarning
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative w-full mt-6 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
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
    </div>
  );
}
