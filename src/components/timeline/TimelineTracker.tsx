'use client';

import React from 'react';
import { EventTask, TaskStatus } from '@/types/timeline';
import { formatGoogleCalendarUrl } from '@/engine/calendarEngine';
import { Calendar, AlertTriangle, CheckCircle2, Clock, ExternalLink, ShieldAlert } from 'lucide-react';

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
    <section aria-labelledby="timeline-heading" className="glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div>
          <h2 id="timeline-heading" className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Dependency-Aware Timeline & Critical Path
          </h2>
          <p className="text-xs text-slate-400">
            Topological DAG tracking: Marking a prerequisite task as &quot;Delayed&quot; automatically ripples through downstream dependencies.
          </p>
        </div>

        {hasDelays && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{delayedTasks.length} Milestones in Delay Ripple</span>
          </div>
        )}
      </div>

      <div className="space-y-3.5 mt-6">
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
                  ? 'border-amber-400/60 bg-amber-500/10 ring-1 ring-amber-400/40'
                  : isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-1 p-1.5 rounded-lg shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : isDelayed
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-white/10 text-slate-300'
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
                      <span className={`font-bold text-sm ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </span>
                      {task.isCriticalPath && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Critical Path
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Due: {task.dueDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">{task.description}</p>

                    {hasMitigation && (
                      <div className="mt-2 text-xs bg-amber-500/15 border border-amber-500/30 text-amber-200 p-2 rounded-lg flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{task.mitigationNote}</span>
                      </div>
                    )}
                  </div>
                </div>

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
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isDelayed
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-black/60 text-slate-200 border-white/15'
                    }`}
                  >
                    <option value="pending" className="bg-[#12101e] text-white">Pending</option>
                    <option value="in_progress" className="bg-[#12101e] text-white">In Progress</option>
                    <option value="completed" className="bg-[#12101e] text-white">Completed</option>
                    <option value="delayed" className="bg-[#12101e] text-white">Delayed (+7d Ripple)</option>
                  </select>

                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Add milestone to Google Calendar"
                    className="p-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-slate-300 transition-colors"
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
