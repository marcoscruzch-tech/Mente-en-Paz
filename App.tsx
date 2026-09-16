/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, MeditationConfig } from './types';
import { SetupScreen } from './SetupScreen';
import { MeditationScreen } from './MeditationScreen';
import { CompletionScreen } from './CompletionScreen';
import { Sparkles, Compass, Heart, ArrowRight, Sun, Moon, Download, Laptop, Smartphone, X } from 'lucide-react';

const DEFAULT_CONFIG: MeditationConfig = {
  name: '',
  problem: '',
  voiceURI: '',
  speechRate: 0.9,
  pauseDuration: 7,
  backgroundId: 'aurora-grace',
  musicId: 'singing-bowls',
  musicVolume: 0.4,
  voiceVolume: 0.9
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [config, setConfig] = useState<MeditationConfig>(DEFAULT_CONFIG);
  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    const saved = localStorage.getItem('isLightTheme');
    return saved !== null ? saved === 'true' : false;
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('isLightTheme', String(isLightTheme));
  }, [isLightTheme]);

  const handleStartSession = (selectedConfig: MeditationConfig) => {
    setConfig(selectedConfig);
    setAppState(AppState.MEDITATING);
  };

  const handleSessionComplete = () => {
    setAppState(AppState.COMPLETED);
  };

  const handleRestart = () => {
    // Keep user information (name, problem, etc.) but allow reconfiguring or starting immediately
    setAppState(AppState.SETUP);
  };

  const handleExitToSetup = () => {
    setAppState(AppState.SETUP);
  };

  const handleEnterTemple = () => {
    setAppState(AppState.SETUP);
  };

  const isSolidBgState = appState === AppState.INTRO || appState === AppState.SETUP;

  return (
    <div className={`min-h-screen w-full font-sans select-none overflow-x-hidden relative flex flex-col justify-between transition-colors duration-500 ${
      isSolidBgState
        ? (isLightTheme ? 'bg-slate-200 text-slate-950' : 'bg-[#080d1a] text-slate-100')
        : (isLightTheme ? 'bg-gradient-to-tr from-violet-200/50 via-slate-100 to-amber-100/50 text-slate-950' : 'bg-slate-950/95 text-slate-100')
    }`}>
      {/* Dynamic Background visual layer only for non-solid States if needed */}
      {!isSolidBgState && (appState === AppState.INTRO || appState === AppState.SETUP) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Subtle slow radial glowing gradients mimicking auroras */}
          <div className={`absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full filter blur-[150px] animate-pulse transition-colors duration-500 ${isLightTheme ? 'bg-violet-300/30' : 'bg-amber-950/15'}`} style={{ animationDuration: '10s' }} />
          <div className={`absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full filter blur-[130px] animate-pulse transition-colors duration-500 ${isLightTheme ? 'bg-amber-300/25' : 'bg-violet-950/15'}`} style={{ animationDuration: '14s' }} />
          <div className={`absolute top-[20%] right-[20%] w-[50%] h-[50%] rounded-full filter blur-[120px] animate-pulse transition-colors duration-500 ${isLightTheme ? 'bg-purple-300/20' : 'bg-fuchsia-950/10'}`} style={{ animationDuration: '12s' }} />
          {/* Stars particles overlay */}
          <div className={`absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] ${isLightTheme ? 'invert opacity-[0.08]' : ''}`} />
        </div>
      )}

      {/* Main Container Stage */}
      <main className="flex-1 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {appState === AppState.INTRO && (
            <motion.div
              key="intro-screen"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center space-y-8"
            >
              {/* App Icon replacing the spinning circle */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-1">
                <img 
                  src="/icon.svg" 
                  alt="Mente en Paz Icon" 
                  className="w-full h-full aspect-square object-contain rounded-3xl shadow-xl border border-slate-200/10 dark:border-white/5 active:scale-95 transition-all duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Typography Headings */}
              <div className="space-y-4">
                <span className={`text-[10px] tracking-[0.25em] uppercase font-bold transition-colors ${isLightTheme ? 'text-purple-700' : 'text-amber-500'}`}>
                  Experiencia de Perdón Radical
                </span>
                <h1 className={`text-4xl md:text-6xl font-serif tracking-tight leading-tight text-transparent bg-clip-text transition-colors duration-500 ${
                  isLightTheme 
                    ? 'bg-gradient-to-r from-violet-700 via-amber-600 to-purple-800'
                    : 'bg-gradient-to-b from-slate-50 via-slate-100 to-amber-100'
                }`}>
                  Mente en Paz
                </h1>
                <p className={`text-sm md:text-base leading-relaxed max-w-md mx-auto transition-colors ${isLightTheme ? 'text-slate-700/90 font-medium' : 'text-slate-400'}`}>
                  Un santuario interactivo de contemplación para aplicar los 60 decretos espirituales de perdón sobre cualquier situación de temor o conflicto.
                </p>
              </div>

              {/* Theme Selector inside Intro screen */}
              <div 
                className="flex items-center gap-2 justify-center p-1 rounded-2xl border max-w-xs w-full mx-auto my-2 transition-all duration-500" 
                style={{
                  borderColor: isLightTheme ? 'rgba(109, 40, 217, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  backgroundColor: isLightTheme ? 'rgba(109, 40, 217, 0.03)' : 'rgba(245, 158, 11, 0.03)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsLightTheme(true)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isLightTheme
                      ? 'border-violet-300 bg-white text-violet-950 font-extrabold shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun size={13} className={isLightTheme ? 'text-amber-500' : 'text-slate-400'} />
                  Tema Claro
                </button>
                <button
                  type="button"
                  onClick={() => setIsLightTheme(false)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    !isLightTheme
                      ? 'border-amber-500/30 bg-amber-950/20 text-amber-300 font-extrabold shadow-sm'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Moon size={13} className={!isLightTheme ? 'text-amber-400' : 'text-slate-500'} />
                  Tema Oscuro
                </button>
              </div>

              {/* Entrance Trigger */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnterTemple}
                className={`group px-8 py-4 font-bold rounded-2xl transition-all shadow-xl flex items-center gap-2.5 cursor-pointer text-sm tracking-wider uppercase border ${
                  isLightTheme
                    ? 'bg-gradient-to-r from-violet-600 to-amber-600 hover:from-violet-500 hover:to-amber-500 text-white border-transparent shadow-purple-600/15 shadow-lg'
                    : 'bg-white hover:bg-slate-100 text-slate-950 border-white shadow-white/5'
                }`}
              >
                Ingresar al Templo
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Install Button centered, clear and elegant */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInstallClick}
                className={`px-6 py-2.5 font-bold rounded-xl transition-all border text-xs cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                  isLightTheme
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-slate-100 shadow-sm'
                    : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/10 text-slate-300 shadow-black/20 shadow-sm'
                }`}
              >
                <Download size={13} className={isLightTheme ? 'text-violet-600' : 'text-amber-400'} />
                {isInstallable ? 'Instalar en este Dispositivo' : 'Instalar como App'}
              </motion.button>
            </motion.div>
          )}

          {appState === AppState.SETUP && (
            <SetupScreen 
              key="setup-screen" 
              onStart={handleStartSession} 
              isLightTheme={isLightTheme} 
              onToggleTheme={setIsLightTheme} 
            />
          )}

          {appState === AppState.MEDITATING && (
            <MeditationScreen
              key="meditation-screen"
              config={config}
              onExit={handleExitToSetup}
              onComplete={handleSessionComplete}
              isLightTheme={isLightTheme}
            />
          )}

          {appState === AppState.COMPLETED && (
            <CompletionScreen
              key="completion-screen"
              config={config}
              onRestart={handleRestart}
              isLightTheme={isLightTheme}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Global Minimalistic Footer */}
      {(appState === AppState.INTRO || appState === AppState.SETUP) && (
        <footer className={`w-full py-6 text-center text-[10px] tracking-wider font-semibold z-10 border-t ${isLightTheme ? 'border-slate-200/50 text-slate-500' : 'border-white/5 text-slate-600'}`}>
          <div className="flex items-center justify-center gap-1.5 uppercase">
            <span>Inspirado en Un Curso de Milagros</span>
            <span>•</span>
            <span className={`flex items-center gap-1 transition-colors ${isLightTheme ? 'text-amber-700' : 'text-amber-500/80'}`}>
              <Heart size={10} className="fill-current" />
              Vivo en perfecta paz y dicha
            </span>
          </div>
        </footer>
      )}

      {/* Beautiful Install Guide Modal */}
      <AnimatePresence>
        {showInstallGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`w-full max-w-md p-6 rounded-3xl shadow-2xl border text-left relative transition-colors ${
                isLightTheme ? 'bg-white border-slate-100 text-slate-800' : 'bg-slate-950 border-white/5 text-slate-100'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-full transition-all cursor-pointer ${
                  isLightTheme ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-white/5 text-slate-500 hover:text-white'
                }`}
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className={`p-2 rounded-xl shrink-0 ${isLightTheme ? 'bg-amber-100 text-amber-600' : 'bg-amber-950/30 text-amber-400'}`}>
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg">Instalar Aplicación</h3>
                  <p className={`text-xs ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                    Lleva la meditación contigo en tu Móvil, Tablet o PC
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs md:text-sm">
                {/* iOS instructions */}
                <div className="flex gap-3 items-start">
                  <div className={`p-1.5 rounded-lg font-bold shrink-0 ${isLightTheme ? 'bg-slate-100' : 'bg-slate-900'}`}>
                    <Smartphone size={15} className="text-blue-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold">Apple iOS (iPhone/iPad / Safari)</p>
                    <p className={`text-[11px] leading-relaxed ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                      Toca el botón <span className="font-extrabold text-blue-500">Compartir (↑)</span> en el navegador Safari y selecciona <span className="font-extrabold text-blue-500">"Agregar al inicio"</span>.
                    </p>
                  </div>
                </div>

                {/* Android / Chrome instructions */}
                <div className="flex gap-3 items-start">
                  <div className={`p-1.5 rounded-lg font-bold shrink-0 ${isLightTheme ? 'bg-slate-100' : 'bg-slate-900'}`}>
                    <Smartphone size={15} className="text-emerald-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold">Android (Chrome / Samsung Internet)</p>
                    <p className={`text-[11px] leading-relaxed ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                      Toca el botón de <span className="font-extrabold text-emerald-500">menú (⋮)</span> o busca la opción <span className="font-extrabold text-emerald-500">"Instalar aplicación"</span> / <span className="font-extrabold text-emerald-500">"Agregar a pantalla de inicio"</span>.
                    </p>
                  </div>
                </div>

                {/* PC/Mac instructions */}
                <div className="flex gap-3 items-start">
                  <div className={`p-1.5 rounded-lg font-bold shrink-0 ${isLightTheme ? 'bg-slate-100' : 'bg-slate-900'}`}>
                    <Laptop size={15} className="text-amber-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold">Ordenadores (PC / Mac / Linux / iPad OS Chrome)</p>
                    <p className={`text-[11px] leading-relaxed ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                      En Chrome, Edge o Brave, haz clic en el botón de <span className="font-extrabold text-amber-500">Instalación (+)</span> situado a la derecha en la barra de direcciones superior.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInstallGuide(false)}
                  className={`py-2 px-5 font-bold rounded-xl text-xs cursor-pointer transition-all ${
                    isLightTheme
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-white text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
