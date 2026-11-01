'use client';

import React from 'react';
import Link from 'next/link';
import { HomeNavbar } from '@/components/common/HomeNavbar';
import { HeroSection } from '@/components/home/HeroSection';
import { InteractiveCardsPreview } from '@/components/home/InteractiveCardsPreview';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { Footer } from '@/components/common/Footer';
import { FloatingChatbot } from '@/components/common/FloatingChatbot';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen ambient-glow-bg flex flex-col justify-between text-white selection:bg-purple-500 selection:text-white">
      {/* Floating Pill Navbar matching reference image */}
      <HomeNavbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Dual Glowing Interactive Cards directly mimicking uploaded design */}
        <InteractiveCardsPreview />

        {/* 4 Architectural Features Grid */}
        <FeaturesGrid />

        {/* Bottom Callout Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-900/40 via-black to-amber-900/40 border border-white/15 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PromptWars Challenge 5 Rank #1 Edition</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to execute stress-free celebrations?
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              Experience the power of consequence-aware ripple recalculations, priority budget shielding, and Gemini 2.5 Flash intelligence.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/onboard"
                className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white btn-glow-purple flex items-center space-x-2 shadow-2xl"
              >
                <span>Take 2-Min Discovery Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard"
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-slate-950 btn-glow-amber flex items-center space-x-2 shadow-2xl"
              >
                <span>Direct Dashboard Access</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Dark Footer */}
      <Footer />

      {/* Persistent AI Copilot Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
}
