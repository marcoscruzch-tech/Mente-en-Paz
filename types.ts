/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AppState {
  INTRO = 'INTRO',
  SETUP = 'SETUP',
  MEDITATING = 'MEDITATING',
  COMPLETED = 'COMPLETED'
}

export interface MeditationConfig {
  name: string;
  problem: string;
  voiceURI: string; // SpeechSynthesisVoice URI
  speechRate: number; // 0.6 to 1.5 (default: 0.9)
  pauseDuration: number; // seconds to pause after each sentence (default: 7)
  backgroundId: string; // 'divine-light' | 'celestial-cosmos' | 'peace-mist' | 'serene-ocean'
  musicId: string; // 'none' | 'singing-bowls' | 'cosmic-drone' | 'heavenly-pad'
  musicVolume: number; // 0 to 1
  voiceVolume: number; // 0 to 1
}

export interface BackgroundTheme {
  id: string;
  name: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  particleColor: string;
  lightGradientFrom?: string;
  lightGradientTo?: string;
  lightGlowColor?: string;
  lightParticleColor?: string;
}

export interface MusicPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
}
