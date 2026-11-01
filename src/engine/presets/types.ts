/**
 * @file Preset Interface Types
 */

import { EventContext } from '@/types/planner';
import { EventTask } from '@/types/timeline';

export interface PersonaPreset {
  id: string;
  badge: string;
  context: EventContext;
  tasks: EventTask[];
  sampleVendorQuotes: {
    vendorName: string;
    rawText: string;
  }[];
}
