/**
 * @file Community Tech Meetup Demo Preset for UtsavAI
 */

import { PersonaPreset } from './types';

export const PRESET_COMMUNITY: PersonaPreset = {
  id: 'preset-community',
  badge: 'Community Tech Meetup (₹3L / 350 Attendees)',
  context: {
    id: 'ctx-comm-03',
    eventType: 'community',
    title: 'Bangalore Open Source & AI Developers Fest',
    totalBudget: 300000,
    originalBudget: 300000,
    guestCount: 350,
    originalGuestCount: 350,
    eventDate: '2026-04-10',
    originalEventDate: '2026-04-10',
    venueType: 'indoor',
    mustHaves: [
      'Dual 4K Projectors & Lapel Mics',
      'Ultra High-speed 500Mbps Wi-Fi',
      'Grab-and-Go Bento Box Lunches',
    ],
    accessibilityNeeds: [
      'Live Closed Captioning on Main Screen',
      'Gender-neutral restrooms',
      'Assisted wheelchair stage ramp',
    ],
    priorities: ['venue', 'logistics', 'catering', 'entertainment', 'buffer'],
    culturalNotes: 'Fast-paced developer summit focused on low turnaround time and high bandwidth.',
  },
  tasks: [
    {
      id: 'task-c-1',
      title: 'Secure University Auditorium or Tech Park Hall',
      description: 'Ensure 400-seating theater format with reliable power backup.',
      phase: 'phase_1_concept',
      dueDate: '2026-02-15',
      originalDueDate: '2026-02-15',
      status: 'completed',
      category: 'venue',
      dependsOn: [],
      isCriticalPath: true,
    },
    {
      id: 'task-c-2',
      title: 'Set up AV, Wi-Fi & Live Stream Crew',
      description: 'Book 3-camera live stream operator and dedicated leased internet line.',
      phase: 'phase_2_core_vendors',
      dueDate: '2026-03-01',
      originalDueDate: '2026-03-01',
      status: 'in_progress',
      category: 'logistics',
      dependsOn: ['task-c-1'],
      isCriticalPath: true,
    },
  ],
  sampleVendorQuotes: [
    {
      vendorName: 'Spectra AV Systems',
      rawText: '₹75,000 complete package: 2 laser projectors, 4 cordless handheld mics, 2 lapel mics, 400-pax sound array, and on-site technician.',
    },
    {
      vendorName: 'Apex Tech Rentals',
      rawText: '₹60,000 basic gear. Mics and operator charged separately at ₹15,000. Cabling and HDMI switchers require ₹8,000 security deposit.',
    },
  ],
};
