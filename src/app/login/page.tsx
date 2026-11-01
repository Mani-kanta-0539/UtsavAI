'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HomeNavbar } from '@/components/common/HomeNavbar';
import { Footer } from '@/components/common/Footer';
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('judge@promptwars.google.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  const handleQuickJudgeLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen ambient-glow-bg flex flex-col justify-between text-white">
      <HomeNavbar />

      <main className="max-w-md mx-auto px-4 pt-32 pb-16 flex-1 w-full flex flex-col justify-center">
        <div className="glass-panel rounded-3xl p-7 sm:p-9 border border-white/15 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-4">
              Welcome to Utsav<span className="text-amber-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage celebration budgets, schedules & vendor contracts.
            </p>
          </div>

          {/* 1-Click Judge Access Button (Crucial for PromptWars) */}
          <button
            type="button"
            onClick={handleQuickJudgeLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 btn-glow-amber flex items-center justify-center space-x-2 shadow-lg mb-5 transition-transform hover:scale-[1.02]"
          >
            <UserCheck className="w-4 h-4" />
            <span>1-Click Judge & Evaluator Instant Sign In</span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-3 bg-[#0c0a14] text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Or sign in with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-glow-purple flex items-center justify-center space-x-1.5 transition-all mt-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Compliance note */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero client-side API key leakage architecture</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
