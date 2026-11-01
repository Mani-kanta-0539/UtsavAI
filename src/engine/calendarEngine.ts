/**
 * @file Calendar and Date Ripple Utilities for UtsavAI
 * Formats Google Calendar 1-Click URLs and generates RFC-5545 standard .ics calendars.
 */

import { EventTask } from '../types/timeline';

/**
 * Creates a direct 1-click Google Calendar URL for an event milestone.
 */
export function formatGoogleCalendarUrl(
  title: string,
  description: string,
  dateIso: string
): string {
  const cleanDate = dateIso.replace(/-/g, '');
  const start = `${cleanDate}T090000Z`;
  const end = `${cleanDate}T110000Z`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[UtsavAI] ${title}`,
    details: `${description}\n\nOrganized via UtsavAI Consequence-Aware Planner.`,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates RFC-5545 compliant iCalendar (.ics) file string for all milestones.
 */
export function generateICSContent(eventName: string, tasks: EventTask[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UtsavAI//Consequence-Aware Event Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:UtsavAI - ${eventName}`,
  ];

  tasks.forEach((t) => {
    const cleanDate = t.dueDate.replace(/-/g, '');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:utsav-${t.id}-${cleanDate}@utsavai.local`);
    lines.push(`DTSTAMP:${cleanDate}T000000Z`);
    lines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
    lines.push(`SUMMARY:[UtsavAI] ${t.title}`);
    lines.push(
      `DESCRIPTION:${t.description.replace(/\n/g, ' ')} | Status: ${t.status.toUpperCase()}`
    );
    lines.push(`STATUS:${t.status === 'completed' ? 'CONFIRMED' : 'TENTATIVE'}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Calculates date shift days delta and flags compressed timeline risk.
 */
export function calculateDateShift(
  originalDateIso: string,
  newDateIso: string
): { daysDelta: number; isCompressed: boolean; urgencyRating: 'normal' | 'tight' | 'critical' } {
  const orig = new Date(originalDateIso).getTime();
  const next = new Date(newDateIso).getTime();
  const daysDelta = Math.round((next - orig) / (1000 * 60 * 60 * 24));
  const isCompressed = daysDelta < 0;

  let urgencyRating: 'normal' | 'tight' | 'critical' = 'normal';
  if (daysDelta < -14) {
    urgencyRating = 'critical';
  } else if (daysDelta < 0) {
    urgencyRating = 'tight';
  }

  return { daysDelta, isCompressed, urgencyRating };
}
