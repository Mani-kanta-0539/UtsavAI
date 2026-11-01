'use client';

import React from 'react';
import { EventTask } from '@/types/timeline';
import { generateICSContent, formatGoogleCalendarUrl } from '@/engine/calendarEngine';
import { Download, Calendar, Printer } from 'lucide-react';

interface CalendarExportProps {
  eventName: string;
  tasks: EventTask[];
  eventDate: string;
}

export const CalendarExport: React.FC<CalendarExportProps> = ({
  eventName,
  tasks,
  eventDate,
}) => {
  const handleDownloadICS = () => {
    const icsString = generateICSContent(eventName, tasks);
    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${eventName.toLowerCase().replace(/\s+/g, '_')}_timeline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const mainEventGcal = formatGoogleCalendarUrl(
    eventName,
    `Grand celebration organized via UtsavAI.`,
    eventDate
  );

  return (
    <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-white">
      <div>
        <h3 className="text-xs font-bold text-white">
          Sync & Export Event Schedule
        </h3>
        <p className="text-[11px] text-slate-400">
          Compatible with Google Calendar, Apple iCal, Outlook, and printable run-sheets.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleDownloadICS}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export .ics</span>
        </button>

        <a
          href={mainEventGcal}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-xs font-semibold text-blue-300 flex items-center space-x-1.5 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>Google Calendar</span>
        </a>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-slate-400" />
          <span>Print Sheet</span>
        </button>
      </div>
    </div>
  );
};
