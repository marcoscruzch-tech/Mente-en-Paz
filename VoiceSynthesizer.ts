/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VoiceOption {
  name: string;
  lang: string;
  uri: string;
  isFemaleLikely: boolean;
  isNatural: boolean;
  score: number;
  rawVoice?: SpeechSynthesisVoice;
}

// Names commonly associated with female voices across different platforms (Apple, Google, Microsoft, Samsung)
const FEMALE_VOICE_NAMES = [
  'monica', 'paulina', 'helena', 'zira', 'sonia', 'marisol', 'laura', 'sofia', 
  'carmen', 'alba', 'amalia', 'lucia', 'conchita', 'penelope', 'elena', 'samantha',
  'sabrina', 'tessa', 'melina', 'yolanda', 'clara', 'victoria', 'juana', 'marta',
  'luisa', 'isabela', 'angelica', 'gloria', 'teresa', 'rosa', 'lola', 'maria',
  'daria', 'pilar', 'leyre', 'elsy', 'guadalupe', 'josephine', 'juana', 'perla',
  'ana', 'margarita', 'estela', 'rebeca'
];

export interface VirtualVoice {
  id: string;
  name: string;
  gender: 'female' | 'male';
  description: string;
  pitch: number;
  rateMultiplier: number;
  badge: string;
  targetLang: string;
}

export const VIRTUAL_VOICES: VirtualVoice[] = [
  {
    id: 'google-natural-sofia',
    name: 'Google Sofía',
    gender: 'female',
    description: 'Voz humana natural de Google (LATAM). Cálida, serena y profundamente consoladora.',
    pitch: 1.0,
    rateMultiplier: 0.95,
    badge: '⚡ Google Natural (Humana)',
    targetLang: 'es-MX'
  },
  {
    id: 'google-natural-carmen',
    name: 'Google Carmen',
    gender: 'female',
    description: 'Voz humana natural de Google (España). Suave, clara y celestial.',
    pitch: 1.0,
    rateMultiplier: 0.92,
    badge: '⚡ Google Natural (España)',
    targetLang: 'es-ES'
  },
  {
    id: 'google-natural-mateo',
    name: 'Google Mateo',
    gender: 'male',
    description: 'Voz humana natural de Google (EE. UU. / LATAM). Profunda, pausada y pacífica.',
    pitch: 0.95,
    rateMultiplier: 0.95,
    badge: '⚡ Google Natural (Humana)',
    targetLang: 'es-US'
  },
  {
    id: 'google-natural-sebastian',
    name: 'Google Sebastián',
    gender: 'male',
    description: 'Voz humana natural de Google (España). Calma, sabia y reflexiva.',
    pitch: 0.92,
    rateMultiplier: 0.90,
    badge: '⚡ Google Natural (España)',
    targetLang: 'es-ES'
  }
];

// Reference to current playing HTML5 Audio element for Google TTS streaming
let currentAudioElement: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

export const cancelSpeaking = () => {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch (e) {}
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
};

export const getSpanishVoices = (): VoiceOption[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const physicalVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  const spanishVoices = physicalVoices.filter(v => v.lang.toLowerCase().startsWith('es'));

  // Sort physical voices so Google voices come first
  const googlePhysicalVoices = spanishVoices.filter(v => 
    v.name.toLowerCase().includes('google') || 
    v.name.toLowerCase().includes('natural') || 
    v.name.toLowerCase().includes('neural')
  );

  // 1. Curated Google Natural Virtual Voices
  const options: VoiceOption[] = VIRTUAL_VOICES.map(virtual => {
    // Attempt to match a physical Google voice first
    let matchedVoice: SpeechSynthesisVoice | undefined;

    if (googlePhysicalVoices.length > 0) {
      if (virtual.gender === 'female') {
        matchedVoice = googlePhysicalVoices.find(v => {
          const nameLower = v.name.toLowerCase();
          const langLower = v.lang.toLowerCase();
          return (FEMALE_VOICE_NAMES.some(name => nameLower.includes(name)) || 
                  nameLower.includes('female') || 
                  nameLower.includes('mujer') || 
                  nameLower.includes('chica') ||
                  nameLower.includes('sofia') ||
                  nameLower.includes('carmen')) &&
                  (virtual.targetLang === 'es-ES' ? langLower.includes('es-es') : true);
        });
        if (!matchedVoice) matchedVoice = googlePhysicalVoices.find(v => v.lang.toLowerCase().includes(virtual.targetLang.toLowerCase())) || googlePhysicalVoices[0];
      } else {
        matchedVoice = googlePhysicalVoices.find(v => {
          const nameLower = v.name.toLowerCase();
          const langLower = v.lang.toLowerCase();
          const isFemale = FEMALE_VOICE_NAMES.some(name => nameLower.includes(name)) || nameLower.includes('female') || nameLower.includes('mujer');
          return !isFemale && (virtual.targetLang === 'es-ES' ? langLower.includes('es-es') : true);
        });
        if (!matchedVoice) matchedVoice = googlePhysicalVoices[0];
      }
    }

    // Fallback to any physical Spanish voice if Google physical voice is not directly in WebSpeech
    if (!matchedVoice && spanishVoices.length > 0) {
      if (virtual.gender === 'female') {
        matchedVoice = spanishVoices.find(v => FEMALE_VOICE_NAMES.some(name => v.name.toLowerCase().includes(name))) || spanishVoices[0];
      } else {
        matchedVoice = spanishVoices.find(v => !FEMALE_VOICE_NAMES.some(name => v.name.toLowerCase().includes(name))) || spanishVoices[0];
      }
    }

    let region = 'LATAM';
    if (virtual.targetLang === 'es-ES') region = 'España';
    else if (virtual.targetLang === 'es-US') region = 'EE. UU.';
    else if (virtual.targetLang === 'es-MX') region = 'México';

    const displayName = `${virtual.name} (${virtual.badge} - ${region})`;

    return {
      name: displayName,
      lang: matchedVoice ? matchedVoice.lang : virtual.targetLang,
      uri: virtual.id,
      isFemaleLikely: virtual.gender === 'female',
      isNatural: true,
      score: 100,
      rawVoice: matchedVoice
    };
  });

  // 2. Add System / Native Spanish Voices directly
  spanishVoices.forEach(voice => {
    const isAlreadyMapped = options.some(opt => opt.rawVoice?.voiceURI === voice.voiceURI);
    
    if (!isAlreadyMapped) {
      const isGoogle = voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('natural') || voice.name.toLowerCase().includes('neural');
      const isFemale = FEMALE_VOICE_NAMES.some(name => voice.name.toLowerCase().includes(name)) || 
                       voice.name.toLowerCase().includes('female') || 
                       voice.name.toLowerCase().includes('mujer');
      
      let country = 'Hispano';
      const langLower = voice.lang.toLowerCase();
      if (langLower.includes('es-es')) country = 'España';
      else if (langLower.includes('es-mx')) country = 'México';
      else if (langLower.includes('es-ar')) country = 'Argentina';
      else if (langLower.includes('es-us')) country = 'EE. UU.';
      else if (langLower.includes('es-co')) country = 'Colombia';

      const prefix = isGoogle ? '⚡ Google Natural: ' : 'Sistema: ';
      const displayName = `${prefix}${voice.name} (${country})`;
      
      options.push({
        name: displayName,
        lang: voice.lang,
        uri: voice.voiceURI,
        isFemaleLikely: isFemale,
        isNatural: isGoogle || voice.localService,
        score: isGoogle ? 90 : 10,
        rawVoice: voice
      });
    }
  });

  return options;
};

export interface SpeakOptions {
  text: string;
  voiceURI?: string;
  rate?: number; // 0.5 to 2
  volume?: number; // 0 to 1
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Plays Google Natural human TTS audio using Google Translate / Google Cloud TTS Web Audio API
 */
const speakWithGoogleAudioTTS = (options: SpeakOptions, targetLang: string = 'es') => {
  cancelSpeaking();

  options.onStart?.();

  // Split text into readable chunks if needed (Google Translate TTS API limits to ~200 chars)
  const chunks = options.text.match(/[^.!?;,]+[.!?;,]?/g) || [options.text];
  let chunkIndex = 0;

  const playNextChunk = () => {
    if (chunkIndex >= chunks.length) {
      options.onEnd?.();
      return;
    }

    const chunkText = chunks[chunkIndex].trim();
    chunkIndex++;

    if (!chunkText) {
      playNextChunk();
      return;
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(chunkText)}`;

    const audio = new Audio(ttsUrl);
    currentAudioElement = audio;

    // Apply volume and playback rate
    audio.volume = Math.min(Math.max(options.volume ?? 0.9, 0), 1);
    audio.playbackRate = Math.min(Math.max((options.rate ?? 0.9) * 0.95, 0.5), 1.5);

    audio.onended = () => {
      playNextChunk();
    };

    audio.onerror = (e) => {
      console.warn("Google TTS audio streaming fallback to SpeechSynthesis due to error:", e);
      speakWithWebSpeech(options);
    };

    audio.play().catch((err) => {
      console.warn("Autoplay audio restriction or error, falling back to Web Speech API:", err);
      speakWithWebSpeech(options);
    });
  };

  playNextChunk();
};

/**
 * Speaks text using Web Speech API SpeechSynthesis
 */
const speakWithWebSpeech = (options: SpeakOptions): SpeechSynthesisUtterance | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options.onError?.(new Error("La síntesis de voz no está soportada en este navegador."));
    return null;
  }

  cancelSpeaking();

  const utterance = new SpeechSynthesisUtterance(options.text);
  activeUtterance = utterance;

  const physicalVoices = window.speechSynthesis.getVoices();
  const spanishVoices = physicalVoices.filter(v => v.lang.toLowerCase().startsWith('es'));

  let selectedVoice: SpeechSynthesisVoice | undefined;
  let customPitch = 1.0;
  let customRateMultiplier = 1.0;

  const virtual = VIRTUAL_VOICES.find(v => v.id === options.voiceURI);
  if (virtual) {
    customPitch = virtual.pitch;
    customRateMultiplier = virtual.rateMultiplier;

    // First try physical Google voices
    const googleVoices = spanishVoices.filter(v => 
      v.name.toLowerCase().includes('google') || 
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('neural')
    );

    if (googleVoices.length > 0) {
      if (virtual.gender === 'female') {
        selectedVoice = googleVoices.find(v => FEMALE_VOICE_NAMES.some(n => v.name.toLowerCase().includes(n))) || googleVoices[0];
      } else {
        selectedVoice = googleVoices.find(v => !FEMALE_VOICE_NAMES.some(n => v.name.toLowerCase().includes(n))) || googleVoices[0];
      }
    } else if (spanishVoices.length > 0) {
      if (virtual.gender === 'female') {
        selectedVoice = spanishVoices.find(v => FEMALE_VOICE_NAMES.some(n => v.name.toLowerCase().includes(n))) || spanishVoices[0];
      } else {
        selectedVoice = spanishVoices.find(v => !FEMALE_VOICE_NAMES.some(n => v.name.toLowerCase().includes(n))) || spanishVoices[0];
      }
    }
  } else if (options.voiceURI) {
    selectedVoice = physicalVoices.find(v => v.voiceURI === options.voiceURI);
  }

  if (!selectedVoice && spanishVoices.length > 0) {
    selectedVoice = spanishVoices[0];
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = 'es-ES';
  }

  const baseRate = options.rate ?? 0.88;
  utterance.rate = baseRate * customRateMultiplier;
  utterance.pitch = customPitch;
  utterance.volume = options.volume ?? 0.9;

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
    }
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
    }
    if (e.error !== 'interrupted') {
      options.onError?.(e);
    }
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const speakPhrase = (options: SpeakOptions): SpeechSynthesisUtterance | null => {
  const virtual = VIRTUAL_VOICES.find(v => v.id === options.voiceURI);

  // Check if browser has a native Google physical voice loaded in WebSpeech
  const physicalVoices = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis.getVoices() : [];
  const hasPhysicalGoogleVoice = physicalVoices.some(v => 
    v.lang.toLowerCase().startsWith('es') && 
    (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural'))
  );

  // If user selected a Google Natural voice profile and we don't have physical Google SpeechSynthesis voices in browser,
  // stream directly via Google Natural Audio TTS!
  if (virtual && !hasPhysicalGoogleVoice) {
    speakWithGoogleAudioTTS(options, virtual.targetLang);
    return null;
  }

  // Otherwise, use Web Speech API (which will use the physical Google voice if available, or best matched Spanish voice)
  return speakWithWebSpeech(options);
};

