'use client';

import React from 'react';
import Link from 'next/link';
import { HomeNavbar } from '@/components/common/HomeNavbar';
import { HeroSection } from '@/components/home/HeroSection';
import { InteractiveCardsPreview } from '@/components/home/InteractiveCardsPreview';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { Footer } from '@/components/common/Footer';
import { FloatingChatbot } from '@/components/common/FloatingChatbot';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-900 dark:text-white selection:bg-purple-500 selection:text-white transition-colors">
      <HomeNavbar />

      <main className="flex-1 w-full">
        <HeroSection />
        <InteractiveCardsPreview />
        <FeaturesGrid />

        {/* Bottom Callout Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-rose-500/15 dark:from-purple-900/40 dark:via-black dark:to-amber-900/40 border border-amber-500/30 dark:border-white/15 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/70 dark:bg-white/10 text-amber-700 dark:text-amber-300 text-xs font-bold mb-4 border border-amber-500/25 dark:border-white/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PromptWars Challenge 5 Rank #1 Edition</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to execute stress-free celebrations?
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed font-medium">
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

      <Footer />
      <FloatingChatbot />
    </div>
  );
}
