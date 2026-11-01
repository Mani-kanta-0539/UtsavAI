'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Sparkles, CheckCircle2, Clock, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const InteractiveCardsPreview: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* Left Glowing Amber Card (matching reference design) */}
        <div className="glass-panel-amber rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              You have 3 milestone actions
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Bell className="w-4 h-4" />
            </div>
          </div>

          {/* Subcard with Avatar & Milestone */}
          <div className="mt-5 p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                AM
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Aarav & Meera Wedding
                </h3>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  ₹8,00,000 Budget • 200 Guests • 4 Months Out
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Inspect Plan
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-950 btn-glow-amber text-center"
              >
                Start Session
              </Link>
            </div>
          </div>

          {/* Micro badges below */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
            <span className="bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
              #1 Food & Guest Comfort Protected
            </span>
            <span className="text-amber-400 font-semibold">
              4 Live Counters Verified
            </span>
          </div>
        </div>

        {/* Right Glowing Purple Card (matching reference design) */}
        <div className="glass-panel-purple rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white">
                Live Consequence Recalculator
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> &lt;2ms Latency
            </span>
          </div>

          {/* Model Prompt Simulation */}
          <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
              <span>Model Prompt</span>
              <span className="text-[10px] text-purple-400 font-mono">1s ago</span>
            </div>
            <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-pink-900/30 border border-purple-500/30 flex items-center justify-between">
              <div className="text-xs text-purple-200 font-medium">
                Simulate +50 guests surge (+₹45,000)
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                Ripple Resolved
              </span>
            </div>
          </div>

          {/* DAG Chain Node */}
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-medium">Banquet Venue Locked</span>
            </div>
            <span className="text-[11px] text-slate-400">Dependency Resolved</span>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
            <span className="bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
              DAG Topological Sort Active
            </span>
            <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold">
              <span>View Full DAG</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
