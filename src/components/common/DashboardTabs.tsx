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
      className="border-b border-white/10 flex space-x-2 overflow-x-auto pt-2"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-4 border-b-2 font-bold text-xs flex items-center space-x-2 transition-all whitespace-nowrap rounded-t-xl ${
              isActive
                ? 'border-amber-400 text-amber-300 bg-amber-400/10 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
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
