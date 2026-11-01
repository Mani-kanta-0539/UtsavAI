/**
 * @file Master Demo Presets Registry for UtsavAI
 * Re-exports domain presets for 1-click evaluation during Google PromptWars.
 */

import { PersonaPreset } from './presets/types';
import { PRESET_WEDDING } from './presets/weddingPreset';
import { PRESET_BIRTHDAY } from './presets/birthdayPreset';
import { PRESET_COMMUNITY } from './presets/communityPreset';

export type { PersonaPreset } from './presets/types';
export { PRESET_WEDDING, PRESET_BIRTHDAY, PRESET_COMMUNITY };

export const ALL_PRESETS: PersonaPreset[] = [
  PRESET_WEDDING,
  PRESET_BIRTHDAY,
  PRESET_COMMUNITY,
];
