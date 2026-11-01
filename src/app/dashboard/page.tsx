'use client';

/**
 * @file Master Dashboard Page for UtsavAI
 * @module app/dashboard/page
 * Orchestrates consequence-aware celebration planning widgets:
 * Priority Budgeting, What-If Recalculator, DAG Timeline, Vendor Quote Comparator,
 * and Cultural Concept Studio. State is fully decoupled via useCelebrationPlanner hook.
 */

import React from 'react';
import { useCelebrationPlanner } from '@/hooks/useCelebrationPlanner';
import { Navbar } from '@/components/common/Navbar';
import { PresetSelector } from '@/components/common/PresetSelector';
import { DashboardTabs } from '@/components/common/DashboardTabs';
import { ContextWizard } from '@/components/wizard/ContextWizard';
import { WhatIfSimulator } from '@/components/budget/WhatIfSimulator';
import { ConsequenceBanner } from '@/components/budget/ConsequenceBanner';
import { BudgetDashboard } from '@/components/budget/BudgetDashboard';
import { TradeOffCards } from '@/components/budget/TradeOffCards';
import { TimelineTracker } from '@/components/timeline/TimelineTracker';
import { CalendarExport } from '@/components/timeline/CalendarExport';
import { VendorComparator } from '@/components/vendors/VendorComparator';
import { VendorChecklist } from '@/components/vendors/VendorChecklist';
import { ConceptStudio } from '@/components/concept/ConceptStudio';
import { FloatingChatbot } from '@/components/common/FloatingChatbot';
import { Footer } from '@/components/common/Footer';

export default function DashboardPage() {
  const {
    activePreset,
    context,
    categories,
    tasks,
    dateShiftDays,
    consequence,
    tradeOffStrategies,
    tradeOffSource,
    isLoadingTradeOffs,
    isPresetModalOpen,
    isHighContrast,
    activeTab,
    setContext,
    setActiveTab,
    setIsPresetModalOpen,
    toggleHighContrast,
    handleSelectPreset,
    handleGuestChange,
    handleBudgetChange,
    handleDateShiftChange,
    handleToggleItemStatus,
    handleUpdateTaskStatus,
    handleRequestTradeOffs,
    handleApplyStrategy,
    handleDismissTradeOffs,
    handleSimulateOverrun,
    handleResetToBaseline,
  } = useCelebrationPlanner();

  const topPriority = context.priorities[0] || 'catering';

  return (
    <div
      className={`min-h-screen ${
        isHighContrast ? 'high-contrast' : ''
      } text-slate-900 dark:text-white flex flex-col justify-between transition-colors`}
    >
      {/* Top Application Header */}
      <Navbar
        currentPersonaTitle={activePreset.badge}
        isHighContrast={isHighContrast}
        onToggleHighContrast={toggleHighContrast}
        onOpenPresetModal={() => setIsPresetModalOpen(true)}
      />

      {/* 1-Click Demo Persona Modal */}
      <PresetSelector
        isOpen={isPresetModalOpen}
        activePresetId={activePreset.id}
        onSelectPreset={handleSelectPreset}
        onClose={() => setIsPresetModalOpen(false)}
      />

      {/* Main Interactive Planner Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* Step 1: Context & Priority Ranker */}
        <ContextWizard context={context} onUpdateContext={setContext} />

        {/* Step 2: What-If Ripple Recalculator Bar */}
        <WhatIfSimulator
          originalGuests={context.originalGuestCount}
          currentGuests={context.guestCount}
          originalBudget={context.originalBudget}
          currentBudget={context.totalBudget}
          dateShiftDays={dateShiftDays}
          onUpdateGuests={handleGuestChange}
          onUpdateBudget={handleBudgetChange}
          onUpdateDateShift={handleDateShiftChange}
          onSimulateOverrun={handleSimulateOverrun}
          onReset={handleResetToBaseline}
        />

        {/* Step 3: Consequence Alert Diff Banner */}
        <ConsequenceBanner
          consequence={consequence}
          onRequestTradeOffs={handleRequestTradeOffs}
          isLoadingTradeOffs={isLoadingTradeOffs}
        />

        {/* Step 4: AI Over-Budget Trade-Off Compromise Cards */}
        {tradeOffStrategies.length > 0 && (
          <TradeOffCards
            strategies={tradeOffStrategies}
            source={tradeOffSource}
            onApplyStrategy={handleApplyStrategy}
            onDismiss={handleDismissTradeOffs}
          />
        )}

        {/* Step 5: Feature Navigation Tabs */}
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab 1: Priority-Weighted Budget Breakdown */}
        {activeTab === 'budget' && (
          <BudgetDashboard
            categories={categories}
            totalBudget={context.totalBudget}
            topPriority={topPriority}
            onToggleItemStatus={handleToggleItemStatus}
          />
        )}

        {/* Tab 2: Topological DAG Timeline & Calendar Export */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <TimelineTracker
              tasks={tasks}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
            <CalendarExport
              eventName={context.title}
              tasks={tasks}
              eventDate={context.eventDate}
            />
          </div>
        )}

        {/* Tab 3: AI Vendor Quote Comparator & Red Flag Checklist */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <VendorComparator
              category={topPriority}
              guestCount={context.guestCount}
              sampleQuotes={activePreset.sampleVendorQuotes}
            />
            <VendorChecklist />
          </div>
        )}

        {/* Tab 4: Multi-Generational Cultural Concept Studio */}
        {activeTab === 'concept' && <ConceptStudio context={context} />}
      </main>

      {/* Global Accessibility Footer */}
      <Footer />

      {/* Floating AI Event Copilot */}
      <FloatingChatbot />
    </div>
  );
}
