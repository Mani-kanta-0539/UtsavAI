/**
 * @file Indian Wedding Demo Preset for UtsavAI
 */

import { PersonaPreset } from './types';

export const PRESET_WEDDING: PersonaPreset = {
  id: 'preset-wedding',
  badge: 'Indian Wedding (₹8L / 200 Guests)',
  context: {
    id: 'ctx-wedding-01',
    eventType: 'wedding',
    title: 'Aarav & Meera Grand Traditional Wedding',
    totalBudget: 800000,
    originalBudget: 800000,
    guestCount: 200,
    originalGuestCount: 200,
    eventDate: '2026-03-15',
    originalEventDate: '2026-03-15',
    venueType: 'indoor',
    mustHaves: [
      'Live Chaat & Sweets Counter',
      'Traditional Floral Mandap',
      'High-energy Sangeet DJ',
    ],
    accessibilityNeeds: [
      'Wheelchair Ramps at Mandap',
      'Quiet Seating Zone for Grandparents',
      'Kid-friendly mocktail bar',
    ],
    priorities: ['catering', 'venue', 'decor', 'photography', 'buffer'],
    culturalNotes: 'Multi-generational Gujarati & Punjabi fusion wedding celebration.',
  },
  tasks: [
    {
      id: 'task-w-1',
      title: 'Lock Banquet Venue & Deposit',
      description: 'Confirm 250-pax air-conditioned banquet hall with dedicated dining hall.',
      phase: 'phase_1_concept',
      dueDate: '2025-11-20',
      originalDueDate: '2025-11-20',
      status: 'completed',
      category: 'venue',
      dependsOn: [],
      isCriticalPath: true,
    },
    {
      id: 'task-w-2',
      title: 'Finalize Master Caterer & Food Tasting',
      description: 'Book caterer for 200 guests with 4 live counters and dessert buffet.',
      phase: 'phase_2_core_vendors',
      dueDate: '2025-12-05',
      originalDueDate: '2025-12-05',
      status: 'in_progress',
      category: 'catering',
      dependsOn: ['task-w-1'],
      isCriticalPath: true,
    },
    {
      id: 'task-w-3',
      title: 'Book Candid Wedding Photographer',
      description: 'Book traditional + candid 2-photographer team with drone coverage.',
      phase: 'phase_2_core_vendors',
      dueDate: '2025-12-20',
      originalDueDate: '2025-12-20',
      status: 'pending',
      category: 'photography',
      dependsOn: ['task-w-1'],
      isCriticalPath: false,
    },
    {
      id: 'task-w-4',
      title: 'Approve Mandap & Stage Floral Decor',
      description: 'Review 3D floral sketches and lighting plan for main stage.',
      phase: 'phase_3_invitations_decor',
      dueDate: '2026-01-15',
      originalDueDate: '2026-01-15',
      status: 'pending',
      category: 'decor',
      dependsOn: ['task-w-1', 'task-w-2'],
      isCriticalPath: true,
    },
    {
      id: 'task-w-5',
      title: 'Dispatch Digital & Print Invitations',
      description: 'Send RSVP tracking links and hotel booking details to outstation guests.',
      phase: 'phase_3_invitations_decor',
      dueDate: '2026-01-25',
      originalDueDate: '2026-01-25',
      status: 'pending',
      category: 'logistics',
      dependsOn: ['task-w-2'],
      isCriticalPath: false,
    },
    {
      id: 'task-w-6',
      title: 'Final Headcount & Table Allocation',
      description: 'Freeze plate count with caterer and assign elder VIP seating.',
      phase: 'phase_4_final_coordination',
      dueDate: '2026-03-05',
      originalDueDate: '2026-03-05',
      status: 'pending',
      category: 'catering',
      dependsOn: ['task-w-5'],
      isCriticalPath: true,
    },
  ],
  sampleVendorQuotes: [
    {
      vendorName: 'Royal Dawat Catering',
      rawText:
        '₹850 per plate base price for 200 pax. 4 live counters included. Extra: 18% GST applicable. Diesel generator for kitchen ₹12,000 extra. Mandatory staff tips ₹5,000. 50% advance on signing.',
    },
    {
      vendorName: 'Annapurna Gourmet Caterers',
      rawText:
        'All-inclusive ₹940 per plate for 200 pax. Covers food, all live counters, service staff, chafing dishes, and all taxes (GST included). Zero hidden fuel or generator charges. 30% advance on booking.',
    },
    {
      vendorName: 'Shree Krishna Banquets & Kitchen',
      rawText:
        '₹780/plate budget package. Minimum 180 pax guarantee. Cold drinks and mineral water charged on actual consumption. Hall cleaning fee ₹8,000 extra. Electricity bill charged per unit.',
    },
  ],
};
