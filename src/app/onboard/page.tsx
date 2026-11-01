'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HomeNavbar } from '@/components/common/HomeNavbar';
import { Footer } from '@/components/common/Footer';
import { FloatingChatbot } from '@/components/common/FloatingChatbot';
import { Sparkles, ArrowRight, ArrowLeft, Check, Users, IndianRupee, HeartHandshake } from 'lucide-react';
import { EventType, PriorityCategory } from '@/types/planner';
import { CATEGORY_LABELS } from '@/engine/plannerConstants';

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState<string>('My Grand Celebration');
  const [budget, setBudget] = useState<number>(800000);
  const [guests, setGuests] = useState<number>(200);
  const [date, setDate] = useState<string>('2026-04-15');
  const [topPriority, setTopPriority] = useState<PriorityCategory>('catering');
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([
    'Quiet Senior Conversation Zone',
    'Kids Entertainment Area',
  ]);

  const accessibilityOptions = [
    'Quiet Senior Conversation Zone',
    'Kids Entertainment Area',
    'Wheelchair Ramp Access',
    'Diabetic & Low-Sodium Food Demarcation',
    'Elevator Access Near Main Dining',
  ];

  const handleFinish = () => {
    // Save to localStorage for instant load into dashboard
    const customConfig = {
      eventType,
      title,
      totalBudget: budget,
      guestCount: guests,
      eventDate: date,
      priorities: [topPriority, 'venue', 'decor', 'photography', 'buffer'],
      accessibilityNeeds: selectedAccessibility,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('utsav_custom_onboard', JSON.stringify(customConfig));
    }
    router.push('/dashboard?from=onboard');
  };

  return (
    <div className="min-h-screen ambient-glow-bg flex flex-col justify-between text-white">
      <HomeNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-16 flex-1 w-full">
        {/* Step indicator */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold text-amber-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step {step} of 4: Smart Context Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {step === 1 && 'What type of celebration are we planning?'}
            {step === 2 && 'What is the scale & budget ceiling?'}
            {step === 3 && 'What is your #1 non-negotiable priority?'}
            {step === 4 && 'Multi-Generational & Accessibility Needs'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            UtsavAI will tailor budgets, timelines, and spatial layouts specifically for your answers.
          </p>
        </div>

        {/* Card Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
          {/* Step 1: Event Type */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                Event Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Sharma Family Grand Wedding"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {[
                  { id: 'wedding', label: 'Grand Wedding', desc: 'Sangeet, Mandap & Multi-Cuisine' },
                  { id: 'birthday', label: 'Milestone 50th', desc: 'Three Generations & Memory Wall' },
                  { id: 'community', label: 'Community Fest', desc: 'Auditorium, AV & Volunteer Scale' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEventType(item.id as EventType)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      eventType === item.id
                        ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Scale & Budget */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Budget Ceiling (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min={20000}
                    step={10000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm font-bold text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Guest Headcount (Pax)
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min={10}
                    max={2000}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm font-bold text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Priority Ranking */}
          {step === 3 && (
            <div>
              <p className="text-xs text-slate-300 mb-3">
                Select your #1 top priority. UtsavAI will protect this category from any automatic cost-cutting:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['catering', 'venue', 'decor', 'photography', 'entertainment'] as PriorityCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTopPriority(cat)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      topPriority === cat
                        ? 'border-purple-400 bg-purple-500/15 ring-1 ring-purple-400'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="font-bold text-xs text-white">{CATEGORY_LABELS[cat]}</span>
                    {topPriority === cat && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Accessibility */}
          {step === 4 && (
            <div>
              <p className="text-xs text-slate-300 mb-3">
                Select required demographic features for elders, children, and mobility needs:
              </p>
              <div className="space-y-2">
                {accessibilityOptions.map((opt) => {
                  const active = selectedAccessibility.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setSelectedAccessibility((prev) =>
                          active ? prev.filter((o) => o !== opt) : [...prev, opt]
                        )
                      }
                      className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-colors ${
                        active
                          ? 'border-emerald-400 bg-emerald-500/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{opt}</span>
                      {active && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white btn-glow-purple flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-7 py-3 rounded-full text-xs font-bold text-slate-950 btn-glow-amber flex items-center gap-1.5 shadow-xl"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Master Consequence Plan</span>
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingChatbot />
    </div>
  );
}
