/**
 * @file Milestone 50th Birthday Demo Preset for UtsavAI
 */

import { PersonaPreset } from './types';

export const PRESET_BIRTHDAY: PersonaPreset = {
  id: 'preset-birthday',
  badge: 'Milestone 50th Birthday (₹1.5L / 60 Guests)',
  context: {
    id: 'ctx-bday-02',
    eventType: 'birthday',
    title: 'Rajesh 50th Golden Jubilee Celebration',
    totalBudget: 150000,
    originalBudget: 150000,
    guestCount: 60,
    originalGuestCount: 60,
    eventDate: '2026-02-28',
    originalEventDate: '2026-02-28',
    venueType: 'indoor',
    mustHaves: [
      'Nostalgic 1970s Memory Photo Wall',
      'Live Acoustic Singer / Karaoke',
      'Three-tier Belgian Truffle Cake',
    ],
    accessibilityNeeds: [
      'Quiet conversation alcove for senior relatives',
      'High-contrast table numbers',
      'Elevator access for ground-floor mobility',
    ],
    priorities: ['catering', 'entertainment', 'decor', 'venue', 'buffer'],
    culturalNotes: 'Warm family milestone with three generations (grandkids to grandparents).',
  },
  tasks: [
    {
      id: 'task-b-1',
      title: 'Book Rooftop Lounge / Community Hall',
      description: 'Reserve private dining space with indoor AC and outdoor deck.',
      phase: 'phase_1_concept',
      dueDate: '2026-02-05',
      originalDueDate: '2026-02-05',
      status: 'completed',
      category: 'venue',
      dependsOn: [],
      isCriticalPath: true,
    },
    {
      id: 'task-b-2',
      title: 'Customize Family Tribute Video & Photo Wall',
      description: 'Gather childhood & college memories for 10-minute projection.',
      phase: 'phase_2_core_vendors',
      dueDate: '2026-02-12',
      originalDueDate: '2026-02-12',
      status: 'in_progress',
      category: 'entertainment',
      dependsOn: ['task-b-1'],
      isCriticalPath: false,
    },
    {
      id: 'task-b-3',
      title: 'Book Live Retro Singer & Sound System',
      description: '2-hour set featuring classic golden era melodies.',
      phase: 'phase_2_core_vendors',
      dueDate: '2026-02-18',
      originalDueDate: '2026-02-18',
      status: 'pending',
      category: 'entertainment',
      dependsOn: ['task-b-1'],
      isCriticalPath: true,
    },
  ],
  sampleVendorQuotes: [
    {
      vendorName: 'Harmony Sound & Singer Trio',
      rawText: '₹28,000 for 2.5 hours live singing with portable JBL sound system and wireless mics. No extra travel charges within city limits.',
    },
    {
      vendorName: 'Echo Beats DJ & Karaoke',
      rawText: '₹22,000 base package. Extra ₹5,000 for projector screen and sound engineer overtime after 10:30 PM (₹2,500/hr).',
    },
  ],
};
