/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MeditationConfig, VoiceOption } from './types';
import { BACKGROUND_THEMES } from './AbstractCanvas';
import { getSpanishVoices, speakPhrase, VIRTUAL_VOICES } from './VoiceSynthesizer';
import { HelpCircle, User, AlertCircle, Volume2, Music, Sparkles, VolumeX, Eye, Play, Sliders, Leaf, Sun, Moon, ChevronUp, ChevronDown } from 'lucide-react';

interface SetupScreenProps {
  onStart: (config: MeditationConfig) => void;
  isLightTheme: boolean;
  onToggleTheme: (light: boolean) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLightTheme, onToggleTheme }) => {
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState('');
  const [speechRate, setSpeechRate] = useState(0.9);
  const [pauseDuration, setPauseDuration] = useState(7);
  const [backgroundId, setBackgroundId] = useState('aurora-grace');
  const [themeCategory, setThemeCategory] = useState<'nature' | 'temple'>('temple');
  const [musicId, setMusicId] = useState('singing-bowls');
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [voiceVolume, setVoiceVolume] = useState(0.9);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync category if the backgroundId changes
  useEffect(() => {
    if (backgroundId.startsWith('nature-') || backgroundId === 'serene-ocean') {
      setThemeCategory('nature');
    } else {
      setThemeCategory('temple');
    }
  }, [backgroundId]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const spVoices = getSpanishVoices();
      setVoices(spVoices);
      if (spVoices.length > 0 && !selectedVoiceUri) {
        // Select the first female voice if available, otherwise the first spanish voice
        const femaleVoice = spVoices.find(v => v.isFemaleLikely);
        setSelectedVoiceUri(femaleVoice ? femaleVoice.uri : spVoices[0].uri);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceUri]);

  const handlePreviewVoice = () => {
    if (isPreviewingVoice) return;
    setIsPreviewingVoice(true);
    const welcomeText = name.trim() 
      ? `Hola ${name}, me alegra acompañarte en esta sesión de perdón.`
      : "Hola, me alegra acompañarte en esta sesión de perdón.";

    speakPhrase({
      text: welcomeText,
      voiceURI: selectedVoiceUri,
      rate: speechRate,
      volume: voiceVolume,
      onEnd: () => setIsPreviewingVoice(false),
      onError: () => setIsPreviewingVoice(false)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    onStart({
      name: name.trim() || "Hermano",
      problem: problem.trim(),
      voiceURI: selectedVoiceUri,
      speechRate,
      pauseDuration,
      backgroundId,
      musicId,
      musicVolume,
      voiceVolume
    });
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-8 md:py-16 min-h-[90vh] flex flex-col justify-center transition-colors duration-500 ${
      isLightTheme ? 'text-slate-900' : 'text-white'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 md:mb-12 flex flex-col items-center"
      >
        <div className="mb-4 relative">
          <img 
            src="/icon.svg" 
            alt="Mente en Paz Icon" 
            className="w-24 h-24 md:w-28 md:h-28 aspect-square object-contain rounded-3xl shadow-xl border border-slate-200/10 dark:border-white/5 active:scale-95 transition-all cursor-pointer"
            referrerPolicy="no-referrer"
          />
        </div>

        <span className={`px-3 py-1 text-xs tracking-widest uppercase font-semibold border rounded-full mb-3 inline-block transition-colors ${
          isLightTheme 
            ? 'text-purple-700 bg-purple-50 border-purple-200/60' 
            : 'text-amber-400 bg-amber-950/40 border-amber-900/40'
        }`}>
          Un Curso de Milagros
        </span>
        <h1 className={`text-3xl md:text-5xl font-serif tracking-tight mt-2 transition-colors duration-500 ${
          isLightTheme
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-amber-600 to-purple-800'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-slate-100 to-amber-200'
        }`}>
          60 Pensamientos de Perdón
        </h1>
        <p className={`text-sm md:text-base mt-3 max-w-2xl mx-auto font-sans leading-relaxed transition-colors duration-500 ${
          isLightTheme ? 'text-slate-600' : 'text-slate-400'
        }`}>
          Tómate un espacio sagrado de paz. Define el problema que te quita la calma y permite que cada uno de los 60 pensamientos disuelva las ilusiones de tu mente.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Theme Selector Section (Light vs Dark) - REPOSITIONED TO THE TOP */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`p-5 rounded-3xl border shadow-xl max-w-md mx-auto w-full transition-colors duration-500 ${
            isLightTheme 
              ? 'bg-gradient-to-r from-white via-violet-50/20 to-amber-50/20 border-violet-100/80 text-slate-950 shadow-purple-900/5 shadow-md' 
              : 'bg-slate-950/65 border-white/5 text-white'
          }`}
        >
          <div className="flex justify-center">
            <div className="flex gap-2 w-full max-w-[280px]">
              <button
                type="button"
                onClick={() => onToggleTheme(false)} // Set Dark Mode
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  !isLightTheme
                    ? 'border-amber-400 bg-amber-950/20 ring-1 ring-amber-500/30 text-amber-300 font-extrabold'
                    : 'border-purple-200/40 bg-purple-50/20 hover:bg-purple-100/30 text-slate-700 font-medium'
                }`}
              >
                <Moon size={12} className={!isLightTheme ? 'text-amber-400' : 'text-purple-600/75'} />
                Tema Oscuro
              </button>
              
              <button
                type="button"
                onClick={() => onToggleTheme(true)} // Set Light Mode
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  isLightTheme
                    ? 'border-violet-400 bg-gradient-to-r from-violet-500/10 to-amber-50/25 ring-1 ring-violet-500/20 text-violet-950 font-extrabold shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-900/30 text-slate-400 font-medium'
                }`}
              >
                <Sun size={12} className={isLightTheme ? 'text-amber-600 animate-spin-slow' : 'text-slate-400'} />
                Tema Claro
              </button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto w-full">
          {/* Core Fields Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`space-y-6 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border transition-colors duration-500 ${
              isLightTheme ? 'bg-gradient-to-br from-white via-violet-50/30 to-amber-50/25 border-violet-200/50 shadow-xl shadow-purple-900/5' : 'bg-slate-950/65 border-white/5'
            }`}
          >
            {/* Nombre Input */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                isLightTheme ? 'text-purple-900/90' : 'text-slate-400'
              }`}>
                <User size={14} className={isLightTheme ? 'text-purple-600' : 'text-amber-400'} />
                Nombre o situación a perdonar
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Escribe el nombre aquí (opcional)..."
                maxLength={30}
                className={`w-full focus:border-purple-500 rounded-2xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all border ${
                  isLightTheme 
                    ? 'bg-purple-50/20 border-purple-200/40 text-slate-900 placeholder-slate-400 focus:bg-white' 
                    : 'bg-slate-900/40 border-slate-800 text-slate-100 placeholder-slate-600'
                }`}
              />
            </div>

            {/* Problema Textarea */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                isLightTheme ? 'text-purple-900/90' : 'text-slate-400'
              }`}>
                <AlertCircle size={14} className={isLightTheme ? 'text-purple-600' : 'text-amber-400'} />
                ¿Qué situación o problema te quita la paz hoy? *
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe brevemente aquello que deseas sanar o perdonar (ej: Mi relación con mi padre, el temor por mi salud, la falta de abundancia...)"
                required
                className={`w-full focus:border-purple-500 rounded-2xl p-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all border h-32 resize-none leading-relaxed ${
                  isLightTheme 
                    ? 'bg-purple-50/20 border-purple-200/40 text-slate-900 placeholder-slate-400 focus:bg-white' 
                    : 'bg-slate-900/40 border-slate-800 text-slate-100 placeholder-slate-600'
                }`}
              />
              <p className="text-[11px] text-slate-500 leading-normal flex items-start gap-1">
                <Sparkles size={11} className={`${isLightTheme ? 'text-amber-600' : 'text-amber-500/80'} mt-0.5 flex-shrink-0`} />
                <span>
                  Esta situación se integrará en las oraciones para guiar tu contemplación personal de forma específica.
                </span>
              </p>
            </div>
          </motion.div>

          {/* Voice and Instructor Customization Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border transition-colors duration-500 mt-6 ${
              isLightTheme 
                ? 'bg-gradient-to-br from-white via-violet-50/30 to-amber-50/25 border-violet-200/50 shadow-xl shadow-purple-900/5' 
                : 'bg-slate-950/65 border-white/5 shadow-2xl'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between font-sans text-left focus:outline-none cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sliders size={18} className={isLightTheme ? 'text-purple-600' : 'text-amber-400'} />
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isLightTheme ? 'text-purple-950' : 'text-slate-200'}`}>
                    Voz del Instructor y Sonido
                  </h3>
                  <p className={`text-[11px] font-medium mt-0.5 ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                    Personaliza la voz del guía, la velocidad y la música de fondo
                  </p>
                </div>
              </div>
              <div className={`p-1.5 rounded-lg transition-colors ${isLightTheme ? 'bg-purple-100/50 text-purple-700' : 'bg-white/5 text-slate-400'}`}>
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden mt-6 space-y-6 pt-6 border-t border-slate-200/40 dark:border-white/5"
                >
                  {/* Selector de Voz */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLightTheme ? 'text-purple-900/90' : 'text-slate-400'}`}>
                        <Volume2 size={13} className="text-violet-500" />
                        Guía Espiritual Seleccionado
                      </label>
                      
                      <button
                        type="button"
                        onClick={handlePreviewVoice}
                        disabled={isPreviewingVoice || voices.length === 0}
                        className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] ${
                          isLightTheme 
                            ? 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100/80 shadow-sm' 
                            : 'border-amber-500/20 bg-amber-950/25 text-amber-300 hover:bg-amber-950/40'
                        }`}
                      >
                        <Play size={11} className={isPreviewingVoice ? 'animate-pulse' : ''} />
                        {isPreviewingVoice ? 'Escuchando...' : 'Escuchar Muestra'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {voices.map((v) => {
                        const isSelected = selectedVoiceUri === v.uri;
                        const virtualMatch = VIRTUAL_VOICES.find(vv => vv.id === v.uri);
                        const shortName = v.name.split(' (')[0];
                        const subtitle = virtualMatch 
                          ? virtualMatch.description
                          : v.name.includes('(') ? v.name.split(' (')[1].replace(')', '') : 'Voz del sistema';

                        return (
                          <button
                            key={v.uri}
                            type="button"
                            onClick={() => setSelectedVoiceUri(v.uri)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[74px] active:scale-[0.99] ${
                              isSelected
                                ? isLightTheme
                                  ? 'border-violet-500 bg-violet-500/5 ring-1 ring-violet-500/30 shadow-md'
                                  : 'border-amber-400 bg-amber-950/20 ring-1 ring-amber-500/30 shadow-md'
                                : isLightTheme
                                  ? 'border-slate-200/80 hover:border-purple-200 bg-slate-50/50 hover:bg-purple-50/10'
                                  : 'border-white/5 hover:border-white/10 bg-slate-900/30 hover:bg-slate-900/50'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={`text-xs font-bold transition-colors ${
                                isSelected 
                                  ? isLightTheme ? 'text-violet-950 font-extrabold' : 'text-amber-300 font-extrabold'
                                  : isLightTheme ? 'text-slate-800' : 'text-slate-300'
                              }`}>
                                {shortName}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide shrink-0 ${
                                isSelected
                                  ? isLightTheme ? 'bg-violet-100 text-violet-700' : 'bg-amber-500/15 text-amber-400'
                                  : isLightTheme ? 'bg-slate-200/60 text-slate-500' : 'bg-white/5 text-slate-500'
                              }`}>
                                {v.isFemaleLikely ? 'Ella' : 'Él'}
                              </span>
                            </div>
                            <p className={`text-[10px] mt-1.5 leading-relaxed line-clamp-2 ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                              {subtitle}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sliders Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Velocidad y Volumen */}
                    <div className="space-y-4">
                      {/* Velocidad de Lectura */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className={`text-[11px] font-bold uppercase tracking-wider ${isLightTheme ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
                            Velocidad de Lectura
                          </label>
                          <span className={`text-xs font-mono font-bold ${isLightTheme ? 'text-violet-700' : 'text-amber-400'}`}>
                            {speechRate}x
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.6"
                          max="1.2"
                          step="0.05"
                          value={speechRate}
                          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                          className="w-full accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-850"
                        />
                      </div>

                      {/* Volumen de Voz */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className={`text-[11px] font-bold uppercase tracking-wider ${isLightTheme ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
                            Volumen de la Voz
                          </label>
                          <span className={`text-xs font-mono font-bold ${isLightTheme ? 'text-violet-700' : 'text-amber-400'}`}>
                            {Math.round(voiceVolume * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={voiceVolume}
                          onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                          className="w-full accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-850"
                        />
                      </div>
                    </div>

                    {/* Pausa de Integración y Música */}
                    <div className="space-y-4">
                      {/* Pausa de Integración */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className={`text-[11px] font-bold uppercase tracking-wider ${isLightTheme ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
                            Pausa de Integración
                          </label>
                          <span className={`text-xs font-mono font-bold ${isLightTheme ? 'text-violet-700' : 'text-amber-400'}`}>
                            {pauseDuration} segundos
                          </span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="15"
                          step="1"
                          value={pauseDuration}
                          onChange={(e) => setPauseDuration(parseInt(e.target.value))}
                          className="w-full accent-amber-500 h-1 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-850"
                        />
                      </div>

                      {/* Música de Fondo */}
                      <div className="space-y-1.5">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isLightTheme ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
                          Música de Fondo
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { id: 'singing-bowls', label: 'Cuencos' },
                            { id: 'heavenly-pad', label: 'Celestial' },
                            { id: 'cosmic-drone', label: 'Zumbido' },
                            { id: 'none', label: 'Silencio' }
                          ].map((m) => {
                            const isSelected = musicId === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setMusicId(m.id)}
                                className={`py-2 px-1 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer truncate ${
                                  isSelected
                                    ? isLightTheme
                                      ? 'border-amber-500 bg-amber-500/5 text-amber-800 font-extrabold shadow-sm'
                                      : 'border-amber-400 bg-amber-950/20 text-amber-200 font-extrabold shadow-sm'
                                    : isLightTheme
                                      ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium'
                                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 font-medium'
                                }`}
                              >
                                {m.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      {/* Action Trigger - Repositioned to the very bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="pt-6 pb-2 flex flex-col items-center gap-4 w-full"
      >
        <button
          type="submit"
          disabled={!problem.trim()}
          className={`w-full max-w-xl py-4.5 font-bold rounded-2xl transition-all shadow-xl active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-30 disabled:pointer-events-none tracking-wide text-base cursor-pointer ${
            isLightTheme
              ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-600 hover:from-violet-500 hover:to-amber-500 text-white shadow-purple-600/15 shadow-lg'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/20'
          }`}
        >
          <Play size={18} className="fill-current" />
          INICIAR MEDITACIÓN ESPIRITUAL
        </button>
      </motion.div>
    </form>
    </div>
  );
};
