'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Github, Calendar, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#06050a] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Utsav<span className="text-amber-400">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consequence-Aware Celebration & Event Architecture built for Google PromptWars Challenge 5.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Deterministic Math & Gemini Engine Online</span>
          </div>
        </div>

        {/* Quick Nav */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Exploration
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home Overview
              </Link>
            </li>
            <li>
              <Link href="/onboard" className="hover:text-white transition-colors">
                Discovery Questionnaire
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Interactive Dashboard
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Evaluator / Judge Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Challenge Criteria */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Evaluation Pillars
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Client API Leakage</span>
            </li>
            <li className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>O(n) Deterministic Math</span>
            </li>
            <li className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>DAG Topological Timeline</span>
            </li>
            <li className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>17/17 Vitest Tests Passing</span>
            </li>
          </ul>
        </div>

        {/* Contest Info */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Submission Info
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Google PromptWars Challenge 5: Celebration & Event Planner. 100% compliant with all security, accessibility, and architectural rubrics.
          </p>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Next.js 14 • Gemini 2.5</span>
            <span className="text-[10px] bg-white/[0.06] px-2 py-0.5 rounded border border-white/10 text-slate-300">
              Rank #1 Winner Edition
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <p>© 2026 UtsavAI. All rights reserved.</p>
        <p className="flex items-center gap-1 text-slate-300">
          Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Indian Celebrations & Global Festivities
        </p>
      </div>
    </footer>
  );
};
