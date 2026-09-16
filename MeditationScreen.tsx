/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MeditationConfig, Thought, VoiceOption } from './types';
import { AbstractCanvas, BACKGROUND_THEMES } from './AbstractCanvas';
import { getThoughts } from './thoughts';
import { speakPhrase, cancelSpeaking, getSpanishVoices } from './VoiceSynthesizer';
import { AudioSynth } from './AudioSynth';
import { 
  Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, 
  Info, HelpCircle, Home, RefreshCw, Sparkles, AlertCircle, Quote,
  Sliders, ChevronUp, ChevronDown, Music
} from 'lucide-react';

interface MeditationScreenProps {
  config: MeditationConfig;
  onExit: () => void;
  onComplete: () => void;
  isLightTheme: boolean;
}

export const MeditationScreen: React.FC<MeditationScreenProps> = ({ config, onExit, onComplete, isLightTheme }) => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sessionPhase, setSessionPhase] = useState<'intro' | 'reading' | 'pausing' | 'ending'>('intro');
  const [pauseProgress, setPauseProgress] = useState(0); // 0 to 100%
  const [musicPreset, setMusicPreset] = useState(config.musicId);
  const [musicVol, setMusicVol] = useState(config.musicVolume);
  const [voiceVol, setVoiceVol] = useState(config.voiceVolume);
  const [speedRate, setSpeedRate] = useState(config.speechRate);
  const [pauseDur, setPauseDur] = useState(config.pauseDuration);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceURI, setVoiceURI] = useState(config.voiceURI);
  const [voices, setVoices] = useState<VoiceOption[]>([]);

  // Audio Synthesizer ref
  const synthRef = useRef<AudioSynth | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Refs to track latest dynamic configuration values without restarting the core state machine
  const pauseDurRef = useRef(pauseDur);
  const speedRateRef = useRef(speedRate);
  const voiceVolRef = useRef(voiceVol);
  const voiceURIRef = useRef(voiceURI);

  useEffect(() => {
    pauseDurRef.current = pauseDur;
  }, [pauseDur]);

  useEffect(() => {
    speedRateRef.current = speedRate;
  }, [speedRate]);

  useEffect(() => {
    voiceVolRef.current = voiceVol;
    if (utteranceRef.current) {
      try {
        utteranceRef.current.volume = voiceVol;
      } catch (e) {}
    }
  }, [voiceVol]);

  useEffect(() => {
    voiceURIRef.current = voiceURI;
  }, [voiceURI]);

  // Load Spanish voices
  useEffect(() => {
    const loadVoices = () => {
      const spVoices = getSpanishVoices();
      setVoices(spVoices);
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Load thoughts customized with user name
  useEffect(() => {
    setThoughts(getThoughts(config.name));
  }, [config.name]);

  // Initialize and clean up Audio Synthesizer
  useEffect(() => {
    const synth = new AudioSynth();
    synthRef.current = synth;
    
    // Start continuous ambient drone
    synth.start(musicPreset);
    synth.setVolume(musicVol);

    // Initial 5-second soft music intro
    setSessionPhase('intro');
    let introTimer = setTimeout(() => {
      setSessionPhase('reading');
    }, 5000);

    return () => {
      clearTimeout(introTimer);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (synthRef.current) {
        synthRef.current.stop();
      }
      cancelSpeaking();
    };
  }, []);

  // Update synth on configuration changes
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.setPreset(musicPreset);
      synthRef.current.setVolume(musicVol);
    }
  }, [musicPreset, musicVol]);

  // Core Meditation State Machine
  useEffect(() => {
    if (thoughts.length === 0 || sessionPhase === 'intro') return;

    // Reset timers
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setPauseProgress(0);

    if (!isPlaying) {
      // Pause active speech
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
      return;
    } else {
      // Resume speech if paused
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        return;
      }
    }

    if (sessionPhase === 'reading') {
      const activeThought = thoughts[currentIndex];
      
      // Trigger a beautiful, rich singing bowl ring at the start of each thought!
      if (synthRef.current && musicPreset !== 'none') {
        synthRef.current.triggerSingingBowl();
      }

      // Speak current thought with Spanish TTS
      utteranceRef.current = speakPhrase({
        text: activeThought.text,
        voiceURI: voiceURIRef.current,
        rate: speedRateRef.current,
        volume: voiceVolRef.current,
        onEnd: () => {
          // Transition to the integration/breathing pause
          setSessionPhase('pausing');
        },
        onError: (err) => {
          console.warn("Speech synthesis errored/canceled:", err);
          // Fallback if speech fails (e.g. on headless browsers)
          setSessionPhase('pausing');
        }
      });
    }

    if (sessionPhase === 'pausing') {
      const activeThought = thoughts[currentIndex];
      // Final phrase gets a longer 10s pause as specified, others use custom pauseDur
      const currentPauseDuration = (currentIndex === thoughts.length - 1) ? 10 : pauseDurRef.current;
      const totalPauseMs = currentPauseDuration * 1000;
      const intervalStepMs = 100;
      let elapsedMs = 0;

      progressIntervalRef.current = setInterval(() => {
        elapsedMs += intervalStepMs;
        const progressPercent = Math.min((elapsedMs / totalPauseMs) * 100, 100);
        setPauseProgress(progressPercent);
      }, intervalStepMs);

      pauseTimerRef.current = setTimeout(() => {
        clearInterval(progressIntervalRef.current!);
        setPauseProgress(100);

        // Move to next phrase or end
        if (currentIndex < thoughts.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSessionPhase('reading');
        } else {
          // End session after final 10s pause
          setSessionPhase('ending');
          setTimeout(() => {
            onComplete();
          }, 1500);
        }
      }, totalPauseMs);
    }
  }, [currentIndex, isPlaying, sessionPhase, thoughts]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    cancelSpeaking();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    if (currentIndex < thoughts.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSessionPhase('reading');
      setIsPlaying(true);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    cancelSpeaking();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSessionPhase('reading');
      setIsPlaying(true);
    }
  };

  const currentThought = thoughts[currentIndex];

  // Locked theme as requested: Gracia de Aurora is the only visual environment projected
  const activeThemeId = 'aurora-grace';

  return (
    <div className={`absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden transition-colors duration-500 ${isLightTheme ? 'bg-slate-200 text-slate-950' : 'bg-[#080d1a] text-slate-100'}`}>
      {/* Dynamic Fluid Canvas Background */}
      <AbstractCanvas themeId={activeThemeId} isActive={isPlaying && sessionPhase !== 'ending'} isLightTheme={isLightTheme} />

      {/* Subtle Gradient Overlay for High Text Contrast */}
      <div className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-500 ${isLightTheme ? 'bg-white/10 backdrop-blur-[0.5px]' : 'bg-black/45 backdrop-blur-[1px]'}`} />

      {/* Header Bar */}
      <div className={`relative z-30 flex items-center justify-between px-6 py-4 border-b transition-colors duration-500 backdrop-blur-md ${
        isLightTheme 
          ? 'border-slate-200/40 bg-white/20' 
          : 'border-white/5 bg-black/20'
      }`}>
        <button
          onClick={onExit}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-sans ${
            isLightTheme
              ? 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-300/40'
              : 'text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10'
          }`}
        >
          <Home size={12} />
          Salir
        </button>

        <div className="text-center font-sans">
          <p className={`text-[10px] tracking-widest font-bold uppercase transition-colors ${isLightTheme ? 'text-amber-700' : 'text-amber-500'}`}>
            Aplicando pensamientos de perdón
          </p>
        </div>

        <div className="w-16 sm:w-20 flex justify-end">
          <img 
            src="/icon.svg" 
            alt="Mente en Paz Icon" 
            className="w-8 h-8 aspect-square object-contain rounded-lg shadow-md border border-slate-200/10 dark:border-white/5 active:scale-95 transition-all"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-20 flex-1 min-h-0 overflow-y-auto w-full px-4 md:px-8 py-2 md:py-6 flex flex-col items-center">
        <div className="my-auto w-full max-w-3xl flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {sessionPhase === 'intro' ? (
              <motion.div
                key="intro-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 1.5 }}
                className="space-y-4 py-4"
              >
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles className="text-amber-400" size={24} />
                </div>
                <h2 className={`text-xl font-serif font-medium tracking-wide transition-colors ${isLightTheme ? 'text-amber-800' : 'text-amber-100'}`}>
                  Respira profundamente...
                </h2>
                <p className={`text-sm max-w-sm mx-auto font-sans transition-colors ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                  La música suave se está sintonizando. Siente el silencio y pon en manos del Espíritu este momento.
                </p>
              </motion.div>
            ) : sessionPhase === 'ending' ? (
              <motion.div
                key="ending-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="space-y-3 py-4"
              >
                <div className="relative w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping" />
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center">
                    <Sparkles className="text-amber-400" size={16} />
                  </div>
                </div>
                <h2 className={`text-xl font-serif transition-colors ${isLightTheme ? 'text-amber-800' : 'text-amber-100'}`}>La paz del mundo ha regresado a ti.</h2>
                <p className={`text-xs font-sans transition-colors ${isLightTheme ? 'text-slate-500 font-medium' : 'text-slate-500'}`}>Abriendo portal de integración final...</p>
              </motion.div>
            ) : (
              <motion.div
                key={`thought-${currentIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center space-y-4 md:space-y-6 lg:space-y-8 py-4"
              >
                {/* Situation text */}
                {config.problem && (
                  <div className={`px-4 py-1.5 rounded-full border text-[10px] md:text-xs font-sans max-w-2xl text-center font-medium shadow-sm transition-colors ${
                    isLightTheme 
                      ? 'bg-amber-500/5 border-amber-500/20 text-slate-600' 
                      : 'bg-amber-950/15 border-amber-500/10 text-slate-300'
                  }`}>
                    <span className="opacity-60 font-bold uppercase mr-1 tracking-wider text-[9px] md:text-[10px]">Liberando:</span>
                    "{config.problem}"
                  </div>
                )}

                {/* Quote Graphic Decorator */}
                <div className={`mb-1 select-none transition-colors ${isLightTheme ? 'text-amber-600/10' : 'text-amber-500/15'}`}>
                  <Quote size={40} className="rotate-180 transform fill-current md:scale-125" />
                </div>

                {/* Subtitles: Active thought in big gorgeous serif font */}
                <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed md:leading-relaxed tracking-wide select-none font-medium text-balance max-w-3xl drop-shadow transition-colors duration-500 ${
                  isLightTheme
                    ? 'text-slate-800'
                    : 'text-transparent bg-clip-text bg-gradient-to-b from-slate-50 to-slate-200'
                }`}>
                  {currentThought?.text}
                </h2>

                {/* Status / Breath Indicator */}
                <div className="flex flex-col items-center gap-2 pt-3 md:pt-6">
                  <p className={`text-[10px] md:text-[11px] font-bold uppercase tracking-widest font-sans h-4 flex items-center transition-colors ${isLightTheme ? 'text-amber-700' : 'text-amber-500/80'}`}>
                    {sessionPhase === 'reading' ? (
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <span className={`w-1.5 h-1.5 rounded-full ${isLightTheme ? 'bg-amber-600' : 'bg-amber-400'}`} />
                        Escucha con atención...
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1.5 ${isLightTheme ? 'text-emerald-700 font-bold' : 'text-emerald-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isLightTheme ? 'bg-emerald-600' : 'bg-emerald-400'}`} />
                        Respira e Integra la Frase
                      </span>
                    )}
                  </p>

                  {/* Horizontal Progress Breath Bar */}
                  <div className={`w-40 md:w-48 h-1 rounded-full overflow-hidden relative border transition-colors ${isLightTheme ? 'bg-slate-200 border-slate-300/30' : 'bg-slate-900 border-white/5'}`}>
                    {sessionPhase === 'pausing' && (
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${pauseProgress}%` }}
                      />
                    )}
                    {sessionPhase === 'reading' && (
                      <div className={`h-full animate-pulse w-full ${isLightTheme ? 'bg-amber-600/35' : 'bg-amber-500/50'}`} />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Interactive Controls */}
      <div className={`relative z-30 backdrop-blur-lg border-t px-5 py-4 md:px-7 md:py-5 flex flex-col gap-4 md:gap-5 transition-colors duration-500 ${
        isLightTheme 
          ? 'bg-white/60 border-slate-200/40' 
          : 'bg-black/45 border-white/5'
      }`}>
        {/* First Row: Status and Playback Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
          {/* Left/Mobile top row: Navigation Info */}
          <div className="flex items-center justify-center sm:justify-start gap-4 w-full sm:w-auto">
            <div className={`text-xs font-sans transition-colors shrink-0 ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
              Pensamiento <span className={`font-bold font-mono transition-colors ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>{currentIndex + 1}</span> de <span className="font-mono">{thoughts.length}</span>
            </div>
          </div>

          {/* Middle/Mobile bottom row: Playback Controls and Settings Toggle */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0 || sessionPhase === 'intro'}
              className={`p-2 disabled:opacity-20 rounded-full transition-all cursor-pointer ${
                isLightTheme ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleTogglePlay}
              disabled={sessionPhase === 'intro'}
              className={`p-3 rounded-full transition-all flex items-center justify-center shadow-md cursor-pointer ${
                isPlaying 
                  ? isLightTheme
                    ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-800/20'
                    : 'bg-white text-slate-950 hover:bg-slate-200 shadow-white/5' 
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/10'
              }`}
              title={isPlaying ? "Pausar" : "Reanudar"}
            >
              {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current translate-x-0.5" />}
            </button>

            <button
              onClick={handleNext}
              disabled={sessionPhase === 'intro'}
              className={`p-2 disabled:opacity-20 rounded-full transition-all cursor-pointer ${
                isLightTheme ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={currentIndex === thoughts.length - 1 ? "Completar" : "Siguiente"}
            >
              <ChevronRight size={18} />
            </button>

            {/* Vertical separator */}
            <div className="w-[1px] h-5 bg-slate-300 dark:bg-slate-800" />

            {/* Voice & Sound Settings Toggle Button */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[9px] md:text-[10px] uppercase font-bold tracking-wider border ${
                showSettings
                  ? isLightTheme
                    ? 'bg-amber-50 border-amber-200 text-amber-800 font-extrabold'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : isLightTheme
                    ? 'border-slate-200 hover:bg-slate-100 text-slate-600'
                    : 'border-white/5 hover:bg-white/5 text-slate-400'
              }`}
              title={showSettings ? "Ocultar ajustes" : "Mostrar ajustes de voz y sonido"}
            >
              <Sliders size={13} />
              <span className="hidden xs:inline">{showSettings ? 'Ajustes' : 'Ajustes'}</span>
              {showSettings ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>

        {/* Second Row: Sliders Grid */}
        <AnimatePresence initial={false}>
          {showSettings && (
            <motion.div
              key="sound-settings-sliders"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-3 border-t border-slate-200/30 dark:border-white/5">
                {/* 1. Selección de Voz (Encima de las demás) */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    <Volume2 size={12} className="text-violet-500" />
                    <span>Voz del Instructor</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {voices.map((v) => {
                      const shortName = v.name.split(' (')[0];
                      const isSelected = voiceURI === v.uri;
                      return (
                        <button
                          key={v.uri}
                          type="button"
                          onClick={() => setVoiceURI(v.uri)}
                          className={`py-1.5 px-2 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer truncate ${
                            isSelected
                              ? isLightTheme
                                ? 'border-violet-500 bg-violet-500/5 text-violet-800 font-extrabold shadow-sm'
                                : 'border-violet-400 bg-violet-950/20 text-violet-200 font-extrabold shadow-sm'
                              : isLightTheme
                                ? 'border-slate-200 bg-slate-50 hover:bg-slate-100/75 text-slate-600'
                                : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                          }`}
                        >
                          {shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Música de Fondo (Integrada aquí) */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    <Music size={12} className="text-amber-500" />
                    <span>Música de Fondo</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'singing-bowls', label: 'Cuencos' },
                      { id: 'heavenly-pad', label: 'Celestial' },
                      { id: 'cosmic-drone', label: 'Zumbido' },
                      { id: 'none', label: 'Silencio' }
                    ].map((m) => {
                      const isSelected = musicPreset === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMusicPreset(m.id)}
                          className={`py-1.5 px-2 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer truncate ${
                            isSelected
                              ? isLightTheme
                                ? 'border-amber-500 bg-amber-500/5 text-amber-800 font-extrabold shadow-sm'
                                : 'border-amber-400 bg-amber-950/20 text-amber-200 font-extrabold shadow-sm'
                              : isLightTheme
                                ? 'border-slate-200 bg-slate-50 hover:bg-slate-100/75 text-slate-600'
                                : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Sliders de Ajuste */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Column 1: Volumes side-by-side ALWAYS */}
                  <div className="flex flex-row items-center gap-3 bg-slate-500/5 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200/30 dark:border-white/5">
                    {/* Volumen Música */}
                    <div className="flex-1 flex items-center gap-2">
                      <button
                        onClick={() => setMusicVol(prev => prev === 0 ? 0.4 : 0)}
                        className={`p-1 rounded-md transition-all cursor-pointer ${isLightTheme ? 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        title="Silenciar/Activar Música"
                      >
                        {musicVol === 0 ? <VolumeX size={13} className="text-red-500" /> : <Volume2 size={13} className="text-amber-500" />}
                      </button>
                      <div className="flex-1 flex flex-col text-left">
                        <div className="flex justify-between items-center text-[8px] uppercase font-bold tracking-wider mb-0.5 text-slate-500 dark:text-slate-400">
                          <span>Vol. Música</span>
                          <span className="font-mono text-amber-500">{Math.round(musicVol * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={musicVol}
                          onChange={(e) => setMusicVol(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 h-1 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* Vertical Divider ALWAYS visible */}
                    <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-800 shrink-0" />

                    {/* Volumen Voz */}
                    <div className="flex-1 flex items-center gap-2">
                      <button
                        onClick={() => setVoiceVol(prev => prev === 0 ? 0.9 : 0)}
                        className={`p-1 rounded-md transition-all cursor-pointer ${isLightTheme ? 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        title="Silenciar/Activar Voz"
                      >
                        {voiceVol === 0 ? <VolumeX size={13} className="text-red-500" /> : <Volume2 size={13} className="text-violet-500" />}
                      </button>
                      <div className="flex-1 flex flex-col text-left">
                        <div className="flex justify-between items-center text-[8px] uppercase font-bold tracking-wider mb-0.5 text-slate-500 dark:text-slate-400">
                          <span>Vol. Voz</span>
                          <span className="font-mono text-violet-500">{Math.round(voiceVol * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={voiceVol}
                          onChange={(e) => setVoiceVol(parseFloat(e.target.value))}
                          className="w-full accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Speeds and Pauses side-by-side ALWAYS */}
                  <div className="flex flex-row items-center gap-3 bg-slate-500/5 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200/30 dark:border-white/5 text-left">
                    {/* Velocidad de Lectura */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center text-[8px] uppercase font-bold tracking-wider mb-0.5 text-slate-500 dark:text-slate-400">
                          <span>Velocidad</span>
                          <span className="font-mono text-violet-500">{speedRate}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.6"
                          max="1.2"
                          step="0.05"
                          value={speedRate}
                          onChange={(e) => setSpeedRate(parseFloat(e.target.value))}
                          className="w-full accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* Vertical Divider ALWAYS visible */}
                    <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-800 shrink-0" />

                    {/* Pausa de Integración */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center text-[8px] uppercase font-bold tracking-wider mb-0.5 text-slate-500 dark:text-slate-400">
                          <span>Pausa</span>
                          <span className="font-mono text-amber-500">{pauseDur}s</span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="15"
                          step="1"
                          value={pauseDur}
                          onChange={(e) => setPauseDur(parseInt(e.target.value))}
                          className="w-full accent-amber-500 h-1 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
