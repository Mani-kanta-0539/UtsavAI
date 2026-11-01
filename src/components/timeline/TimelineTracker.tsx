'use client';

import React from 'react';
import { EventTask, TaskStatus } from '@/types/timeline';
import { formatGoogleCalendarUrl } from '@/engine/calendarEngine';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface TimelineTrackerProps {
  tasks: EventTask[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus, delayDays?: number) => void;
}

export const TimelineTracker: React.FC<TimelineTrackerProps> = ({
  tasks,
  onUpdateTaskStatus,
}) => {
  const delayedTasks = tasks.filter((t) => t.status === 'delayed');
  const hasDelays = delayedTasks.length > 0;

  return (
    <section aria-labelledby="timeline-heading" className="bg-white rounded-2xl border border-amber-200/70 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 id="timeline-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Dependency-Aware Timeline & Critical Path
          </h2>
          <p className="text-xs text-slate-500">
            Topological DAG tracking: Marking a prerequisite task as &quot;Delayed&quot; automatically ripples through downstream dependencies.
          </p>
        </div>

        {hasDelays && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>{delayedTasks.length} Milestones in Delay Ripple</span>
          </div>
        )}
      </div>

      <div className="space-y-4 mt-6">
        {tasks.map((task) => {
          const isDelayed = task.status === 'delayed';
          const isCompleted = task.status === 'completed';
          const hasMitigation = !!task.mitigationNote;
          const gcalUrl = formatGoogleCalendarUrl(task.title, task.description, task.dueDate);

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${
                isDelayed
                  ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300'
                  : isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 bg-slate-50/40'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-1 p-1.5 rounded-lg shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isDelayed
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isDelayed ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`font-bold text-sm ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                      {task.isCriticalPath && (
                        <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300">
                          Critical Path
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Due: {task.dueDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">{task.description}</p>

                    {/* Mitigation ripple note */}
                    {hasMitigation && (
                      <div className="mt-2 text-xs bg-amber-100/70 border border-amber-300 text-amber-900 p-2 rounded-lg flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{task.mitigationNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Toggles & Calendar */}
                <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                  <select
                    value={task.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as TaskStatus;
                      onUpdateTaskStatus(task.id, newStatus, newStatus === 'delayed' ? 7 : 0);
                    }}
                    aria-label={`Status for ${task.title}`}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isDelayed
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed (+7d Ripple)</option>
                  </select>

                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Add milestone to Google Calendar"
                    className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                    aria-label={`Add ${task.title} to Google Calendar`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
