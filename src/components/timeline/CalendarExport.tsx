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
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-xs font-bold text-slate-800">
          Sync & Export Event Schedule
        </h3>
        <p className="text-[11px] text-slate-500">
          Compatible with Google Calendar, Apple iCal, Outlook, and offline run-sheets.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleDownloadICS}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Export .ics</span>
        </button>

        <a
          href={mainEventGcal}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 flex items-center space-x-1.5 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Google Calendar</span>
        </a>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Print Sheet</span>
        </button>
      </div>
    </div>
  );
};
