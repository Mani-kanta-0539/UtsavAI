/**
 * @file Timeline and Task DAG Types for UtsavAI
 * Strict models for chronological event milestones, dependencies, and delay ripples.
 */

import { PriorityCategory } from './planner';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export type TimelinePhase =
  | 'phase_1_concept'
  | 'phase_2_core_vendors'
  | 'phase_3_invitations_decor'
  | 'phase_4_final_coordination'
  | 'phase_5_event_day';

export interface EventTask {
  id: string;
  title: string;
  description: string;
  phase: TimelinePhase;
  dueDate: string; // YYYY-MM-DD
  originalDueDate: string;
  status: TaskStatus;
  category: PriorityCategory;
  dependsOn: string[]; // List of prerequisite task IDs
  delayDays?: number;
  mitigationNote?: string;
  isCriticalPath: boolean;
}

export interface TimelinePhaseGroup {
  phase: TimelinePhase;
  title: string;
  timeframe: string;
  tasks: EventTask[];
}

export interface DAGPropagationResult {
  tasks: EventTask[];
  impactedDownstreamIds: string[];
  criticalPathAlert: boolean;
  mitigationSummary: string;
}
