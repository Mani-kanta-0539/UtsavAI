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
    <nav
      aria-label="Feature Tabs"
      className="border-b border-amber-200/80 flex space-x-2 overflow-x-auto"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-4 border-b-2 font-bold text-xs flex items-center space-x-2 transition-all whitespace-nowrap ${
              isActive
                ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
