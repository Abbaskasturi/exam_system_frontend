"use client";

import { useState } from "react";
import Link from "next/link";
import { registerInstitute } from "../api/auth.api";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subdomain: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerInstitute(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", password: "", subdomain: "" });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] p-8 sm:p-10 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]" suppressHydrationWarning>
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
          Institute Registration
        </h2>
        <p className="text-sm text-gray-400">
          Set up your institute's dedicated environment
        </p>
      </div>

      {success ? (
        <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center transform transition-all">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 text-green-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-green-400 font-semibold text-lg mb-2">Registration Successful!</h3>
          <p className="text-green-300/70 text-sm mb-6">Your institute workspace is ready to use.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all"
          >
            Register another
          </button>
        </div>
      ) : (
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
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">
              Institute Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter institute name"
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">
              Subdomain
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="subdomain"
                required
                value={formData.subdomain}
                onChange={handleChange}
                placeholder="subdomain"
                suppressHydrationWarning
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-24 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
              <span className="absolute right-4 text-gray-500 text-sm font-medium pointer-events-none">
                .exam.com
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            suppressHydrationWarning
            className="relative w-full mt-6 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Complete Registration"
            )}
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-sm text-gray-400">
          Already have an institute workspace?{" "}
          <Link href="/login" className="font-semibold text-white hover:text-indigo-400 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
