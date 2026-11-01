'use client';

import React from 'react';
import { DollarSign, Clock, Users, Sparkles, LucideIcon } from 'lucide-react';

export type DashboardTabId = 'budget' | 'timeline' | 'vendors' | 'concept';

interface TabItem {
  id: DashboardTabId;
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { id: 'budget', label: 'Budget & Transparency', icon: DollarSign },
  { id: 'timeline', label: 'Dependency Timeline', icon: Clock },
  { id: 'vendors', label: 'Vendor Quote Comparator', icon: Users },
  { id: 'concept', label: 'Cultural Concept Studio', icon: Sparkles },
];

interface DashboardTabsProps {
  activeTab: DashboardTabId;
  onTabChange: (tab: DashboardTabId) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Celebration Planning Feature Navigation"
      className="border-b border-amber-500/20 dark:border-white/10 flex space-x-2 overflow-x-auto pt-2"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-4 border-b-2 font-bold text-xs flex items-center space-x-2 transition-all whitespace-nowrap rounded-t-xl ${
              isActive
                ? 'border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-400/10 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.03]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
