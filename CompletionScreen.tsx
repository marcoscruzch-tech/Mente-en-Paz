/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MeditationConfig } from './types';
import { getThoughts } from './thoughts';
import { 
  Sparkles, Download, Check, Share2, ArrowRight, Heart, Star, Compass
} from 'lucide-react';

interface CompletionScreenProps {
  config: MeditationConfig;
  onRestart: () => void;
  isLightTheme: boolean;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ config, onRestart, isLightTheme }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate and download a personalized meditation journal text file
  const handleDownloadTxt = () => {
    try {
      const thoughts = getThoughts(config.name);
      let content = `======================================================\n`;
      content += `       MI SESIÓN DE PERDÓN - UN CURSO DE MILAGROS      \n`;
      content += `======================================================\n\n`;
      content += `Fecha: ${new Date().toLocaleDateString('es-ES')}\n`;
      content += `Meditador/a: ${config.name}\n`;
      content += `Situación entregada al perdón: "${config.problem}"\n\n`;
      content += `------------------------------------------------------\n`;
      content += `LOS 60 PENSAMIENTOS DE PERDÓN CONTEMPLADOS:\n`;
      content += `------------------------------------------------------\n\n`;

      thoughts.forEach((t) => {
        content += `${t.id}. ${t.text}\n\n`;
      });

      content += `------------------------------------------------------\n`;
      content += `Detrás de cada problema se encuentra el milagro que el\n`;
      content += `problema oculta. La paz de Dios está en mí.\n`;
      content += `======================================================\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `60_Pensamientos_Perdon_${config.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (e) {
      console.error("Txt download failed:", e);
    }
  };

  const handleCopyShare = () => {
    const text = `Acabo de realizar una meditación espiritual profunda con los "60 Pensamientos de Perdón" de Un Curso de Milagros para sanar mi mente y liberar resentimientos. ¡Te deseo la paz de Dios hoy! ✨🕊️`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto px-4 py-12 min-h-[90vh] flex flex-col justify-center items-center text-center transition-colors duration-500 ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>
      {/* Radiant Glow Circle Icons */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="relative w-24 h-24 flex items-center justify-center mb-8"
      >
        <div className={`absolute inset-0 rounded-full filter blur-xl animate-pulse ${isLightTheme ? 'bg-amber-600/10' : 'bg-amber-500/20'}`} />
        <div className={`absolute inset-0 border rounded-full animate-spin-slow ${isLightTheme ? 'border-amber-600/30' : 'border-amber-400/30'}`} />
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-950/20">
          <Heart className="text-slate-950 fill-current" size={28} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="space-y-4"
      >
        <h1 className={`text-3xl md:text-5xl font-serif transition-colors duration-500 ${
          isLightTheme 
            ? 'text-slate-800'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-slate-100 to-amber-300'
        }`}>
          {config.name ? `La paz de Dios está contigo ${config.name}.` : 'La paz de Dios está contigo.'}
        </h1>
        <p className={`text-sm md:text-base max-w-lg mx-auto font-sans leading-relaxed transition-colors ${isLightTheme ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
          Has completado los 60 pensamientos de perdón. Has tomado el tiempo sagrado para sentir cada frase y permitir que la luz disuelva toda ilusión sobre tu situación de conflicto.
        </p>
      </motion.div>

      {/* Meditation Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`w-full border p-6 rounded-3xl my-8 text-left space-y-4 backdrop-blur-md transition-colors ${
          isLightTheme 
            ? 'bg-white/70 border-slate-200/50 shadow-md' 
            : 'bg-slate-950/65 border-white/5 shadow-2xl'
        }`}
      >
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${isLightTheme ? 'text-amber-800' : 'text-amber-400'}`}>
          <Compass size={14} />
          Resumen de tu Proceso Sanador
        </div>

        <div className="space-y-3 font-sans">
          <div className={`p-4 border rounded-2xl flex items-start gap-3 transition-colors ${
            isLightTheme 
              ? 'bg-slate-100/50 border-slate-200/50' 
              : 'bg-slate-900/30 border-slate-800'
          }`}>
            <span className={`font-bold font-mono text-xs mt-0.5 ${isLightTheme ? 'text-slate-400' : 'text-slate-500'}`}>01</span>
            <div>
              <p className={`text-[10px] uppercase tracking-widest font-bold ${isLightTheme ? 'text-slate-500' : 'text-slate-500'}`}>Situación Entregada</p>
              <p className={`text-sm font-medium leading-relaxed mt-0.5 ${isLightTheme ? 'text-slate-800' : 'text-slate-200'}`}>"{config.problem}"</p>
            </div>
          </div>

          <div className={`p-4 border rounded-2xl flex items-start gap-3 transition-colors ${
            isLightTheme 
              ? 'bg-slate-100/50 border-slate-200/50' 
              : 'bg-slate-900/30 border-slate-800'
          }`}>
            <span className={`font-bold font-mono text-xs mt-0.5 ${isLightTheme ? 'text-slate-400' : 'text-slate-500'}`}>02</span>
            <div>
              <p className={`text-[10px] uppercase tracking-widest font-bold ${isLightTheme ? 'text-slate-500' : 'text-slate-500'}`}>Logro de Contemplación</p>
              <p className={`text-sm font-medium leading-relaxed mt-0.5 ${isLightTheme ? 'text-slate-800' : 'text-slate-200'}`}>
                Contemplaste los 60 decretos divinos con respiración profunda e integración consciente.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 w-full justify-center"
      >
        <button
          onClick={handleDownloadTxt}
          className={`flex-1 sm:flex-initial px-6 py-3.5 border rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isLightTheme 
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300/50 shadow-sm' 
              : 'bg-slate-900 hover:bg-slate-800 border-white/5 text-slate-200'
          }`}
        >
          {downloaded ? (
            <>
              <Check className="text-emerald-500 font-bold" size={16} />
              ¡Descargado!
            </>
          ) : (
            <>
              <Download size={16} />
              Descargar Pensamientos (TXT)
            </>
          )}
        </button>

        <button
          onClick={handleCopyShare}
          className={`flex-1 sm:flex-initial px-6 py-3.5 border rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isLightTheme 
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300/50 shadow-sm' 
              : 'bg-slate-900 hover:bg-slate-800 border-white/5 text-slate-200'
          }`}
        >
          {copied ? (
            <>
              <Check className="text-emerald-500 font-bold" size={16} />
              ¡Copiado al Portapapeles!
            </>
          ) : (
            <>
              <Share2 size={16} />
              Compartir Paz (Copiar)
            </>
          )}
        </button>

        <button
          onClick={onRestart}
          className="flex-1 sm:flex-initial px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-2xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-transparent"
        >
          Volver a Iniciar
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
};
