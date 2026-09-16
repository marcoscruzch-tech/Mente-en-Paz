/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { BackgroundTheme } from './types';

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: 'divine-light',
    name: 'Luz Divina (Oro y Sol)',
    description: 'Tonos cálidos dorados y amarillos que evocan iluminación, perdón y la luz del mundo.',
    gradientFrom: '#1c1605',
    gradientTo: '#080602',
    glowColor: 'rgba(234, 179, 8, 0.15)',
    particleColor: 'rgba(253, 224, 71, 0.45)',
    lightGradientFrom: '#fefbf3',
    lightGradientTo: '#f5f0e1',
    lightGlowColor: 'rgba(217, 119, 6, 0.08)',
    lightParticleColor: 'rgba(245, 158, 11, 0.3)'
  },
  {
    id: 'celestial-cosmos',
    name: 'Cosmos Celestial (Violeta y Azul)',
    description: 'Un viaje profundo al espacio mental con púrpuras cósmicos y estrellas titilantes.',
    gradientFrom: '#0e0b1e',
    gradientTo: '#030208',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    particleColor: 'rgba(196, 181, 253, 0.5)',
    lightGradientFrom: '#f5f3ff',
    lightGradientTo: '#e8e5f7',
    lightGlowColor: 'rgba(124, 58, 237, 0.08)',
    lightParticleColor: 'rgba(139, 92, 246, 0.3)'
  },
  {
    id: 'peace-mist',
    name: 'Neblina de Paz (Rosa y Lavanda)',
    description: 'Colores suaves de amanecer místico, ideales para aliviar tensiones y el perdón sutil.',
    gradientFrom: '#1a1016',
    gradientTo: '#090508',
    glowColor: 'rgba(236, 72, 153, 0.12)',
    particleColor: 'rgba(252, 165, 165, 0.4)',
    lightGradientFrom: '#fff1f2',
    lightGradientTo: '#fce7f3',
    lightGlowColor: 'rgba(219, 39, 119, 0.07)',
    lightParticleColor: 'rgba(236, 72, 153, 0.3)'
  },
  {
    id: 'serene-ocean',
    name: 'Océano del Ser (Verde Jade y Turquesa)',
    description: 'Ondas fluidas color verde azulado que transmiten profundidad, pureza y calma mental.',
    gradientFrom: '#031716',
    gradientTo: '#010505',
    glowColor: 'rgba(20, 184, 166, 0.14)',
    particleColor: 'rgba(153, 246, 228, 0.45)',
    lightGradientFrom: '#f0fdfa',
    lightGradientTo: '#ccfbf1',
    lightGlowColor: 'rgba(13, 148, 136, 0.07)',
    lightParticleColor: 'rgba(20, 184, 166, 0.3)'
  },
  {
    id: 'nature-forest',
    name: 'Bosque Sagrado (Esmeralda y Musgo)',
    description: 'Tonos verdes profundos y musgo que evocan el enraizamiento, la renovación espiritual y el soplo de vida.',
    gradientFrom: '#041c0e',
    gradientTo: '#010603',
    glowColor: 'rgba(16, 185, 129, 0.13)',
    particleColor: 'rgba(110, 231, 183, 0.45)',
    lightGradientFrom: '#f0fdf4',
    lightGradientTo: '#dcfce7',
    lightGlowColor: 'rgba(5, 150, 105, 0.07)',
    lightParticleColor: 'rgba(16, 185, 129, 0.3)'
  },
  {
    id: 'nature-ocean',
    name: 'Océano Cósmico (Zafiro y Cobalto)',
    description: 'Azules profundos del océano estelar que inspiran confianza, paz divina y sanación total.',
    gradientFrom: '#020f1e',
    gradientTo: '#010308',
    glowColor: 'rgba(37, 99, 235, 0.14)',
    particleColor: 'rgba(147, 197, 253, 0.45)',
    lightGradientFrom: '#eff6ff',
    lightGradientTo: '#dbeafe',
    lightGlowColor: 'rgba(29, 78, 216, 0.07)',
    lightParticleColor: 'rgba(37, 99, 235, 0.3)'
  },
  {
    id: 'nature-desert',
    name: 'Arenas Sagradas (Siena y Terracota)',
    description: 'Tonos desérticos de atardecer místico que calman los pensamientos conflictivos con calidez espiritual.',
    gradientFrom: '#1e110b',
    gradientTo: '#080402',
    glowColor: 'rgba(249, 115, 22, 0.12)',
    particleColor: 'rgba(253, 186, 116, 0.4)',
    lightGradientFrom: '#fffaf5',
    lightGradientTo: '#ffedd5',
    lightGlowColor: 'rgba(194, 65, 12, 0.07)',
    lightParticleColor: 'rgba(249, 115, 22, 0.3)'
  },
  {
    id: 'aurora-grace',
    name: 'Gracia de Aurora (Amatista y Menta)',
    description: 'Vibraciones de gracia con violetas celestiales y destellos de luz verde aurora espiritual.',
    gradientFrom: '#190d2e',
    gradientTo: '#06030e',
    glowColor: 'rgba(168, 85, 247, 0.17)',
    particleColor: 'rgba(110, 231, 183, 0.56)',
    lightGradientFrom: '#f5ecff',
    lightGradientTo: '#dbfbe3',
    lightGlowColor: 'rgba(168, 85, 247, 0.12)',
    lightParticleColor: 'rgba(52, 211, 153, 0.4)'
  },
  {
    id: 'golden-ether',
    name: 'Éter de Oro (Lila y Ámbar)',
    description: 'Inspirado en la unión espiritual, fusionando lilas suaves con la luz radiante del oro eterno.',
    gradientFrom: '#1c1024',
    gradientTo: '#08030b',
    glowColor: 'rgba(217, 119, 6, 0.15)',
    particleColor: 'rgba(196, 181, 253, 0.55)',
    lightGradientFrom: '#fbf9ff',
    lightGradientTo: '#fffbeb',
    lightGlowColor: 'rgba(217, 119, 6, 0.08)',
    lightParticleColor: 'rgba(139, 92, 246, 0.3)'
  },
  {
    id: 'rose-sanctuary',
    name: 'Santuario de Rosas (Rubí y Durazno)',
    description: 'El calor incondicional del amor divino con tonos blush rosados y destellos durazno.',
    gradientFrom: '#240f16',
    gradientTo: '#0b0306',
    glowColor: 'rgba(244, 63, 94, 0.12)',
    particleColor: 'rgba(253, 186, 116, 0.45)',
    lightGradientFrom: '#fff5f5',
    lightGradientTo: '#fff7ed',
    lightGlowColor: 'rgba(225, 29, 72, 0.06)',
    lightParticleColor: 'rgba(244, 63, 94, 0.28)'
  },
  {
    id: 'infinite-sky',
    name: 'Cielo Infinito (Cobalto y Platino)',
    description: 'Amplitud de la mente liberada, con matices zafiro y partículas plateadas puras.',
    gradientFrom: '#0a162d',
    gradientTo: '#020610',
    glowColor: 'rgba(56, 189, 248, 0.15)',
    particleColor: 'rgba(226, 232, 240, 0.5)',
    lightGradientFrom: '#f0f9ff',
    lightGradientTo: '#f8fafc',
    lightGlowColor: 'rgba(14, 165, 233, 0.07)',
    lightParticleColor: 'rgba(148, 163, 184, 0.3)'
  },
  {
    id: 'peaceful-sunset',
    name: 'Atardecer de Paz (Coral y Siena)',
    description: 'La entrega del día en manos del perdón divino con profundos corales y oro místico.',
    gradientFrom: '#220e14',
    gradientTo: '#080204',
    glowColor: 'rgba(251, 146, 60, 0.13)',
    particleColor: 'rgba(254, 240, 138, 0.45)',
    lightGradientFrom: '#fffafb',
    lightGradientTo: '#fff7ed',
    lightGlowColor: 'rgba(249, 115, 22, 0.07)',
    lightParticleColor: 'rgba(251, 146, 60, 0.28)'
  }
];

// Helper functions for parsing and interpolating colors (lerp)
function parseHex(hex: string): [number, number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, 1.0];
}

function parseRgba(rgba: string): [number, number, number, number] {
  const matches = rgba.match(/[\d\.]+/g);
  if (!matches || matches.length < 3) return [255, 255, 255, 1.0];
  const r = parseFloat(matches[0]);
  const g = parseFloat(matches[1]);
  const b = parseFloat(matches[2]);
  const a = matches[3] !== undefined ? parseFloat(matches[3]) : 1.0;
  return [r, g, b, a];
}

function parseColor(col: string): [number, number, number, number] {
  if (col.startsWith('#')) {
    return parseHex(col);
  }
  return parseRgba(col);
}

function lerpColor(current: [number, number, number, number], target: [number, number, number, number], factor = 0.015) {
  current[0] += (target[0] - current[0]) * factor;
  current[1] += (target[1] - current[1]) * factor;
  current[2] += (target[2] - current[2]) * factor;
  current[3] += (target[3] - current[3]) * factor;
}

function colorToRgbaStr(color: [number, number, number, number], customAlpha?: number) {
  const alpha = customAlpha !== undefined ? customAlpha : color[3];
  return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${alpha})`;
}

interface AbstractCanvasProps {
  themeId: string;
  isActive: boolean;
  isLightTheme: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  waveFrequency: number;
  waveAmplitude: number;
  birth: number;
  life: number;
}

export const AbstractCanvas: React.FC<AbstractCanvasProps> = ({ themeId, isActive, isLightTheme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Keep tracked target and animated color state in refs for continuous smooth transitions
  const targetsRef = useRef<{
    gradTo: [number, number, number, number];
    gradFrom: [number, number, number, number];
    glowCol: [number, number, number, number];
    partCol: [number, number, number, number];
  } | null>(null);

  const colorsRef = useRef<{
    gradTo: [number, number, number, number];
    gradFrom: [number, number, number, number];
    glowCol: [number, number, number, number];
    partCol: [number, number, number, number];
  } | null>(null);

  // Dynamic target calculations
  const theme = BACKGROUND_THEMES.find(t => t.id === themeId) || BACKGROUND_THEMES[0];
  const targetGradToRaw = isLightTheme ? (theme.lightGradientTo || '#f5f0e1') : theme.gradientTo;
  const targetGradFromRaw = isLightTheme ? (theme.lightGradientFrom || '#fefbf3') : theme.gradientFrom;
  const targetGlowColRaw = isLightTheme ? (theme.lightGlowColor || 'rgba(217, 119, 6, 0.08)') : theme.glowColor;
  const targetPartColRaw = isLightTheme ? (theme.lightParticleColor || 'rgba(217, 119, 6, 0.3)') : theme.particleColor;

  const targetGradTo = parseColor(targetGradToRaw);
  const targetGradFrom = parseColor(targetGradFromRaw);
  const targetGlowCol = parseColor(targetGlowColRaw);
  const targetPartCol = parseColor(targetPartColRaw);

  // Maintain current targets in a ref to let the canvas render loop access the latest props instantly
  targetsRef.current = {
    gradTo: targetGradTo,
    gradFrom: targetGradFrom,
    glowCol: targetGlowCol,
    partCol: targetPartCol
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const maxParticles = 45;

    const resize = () => {
      // Ensure smooth high-DPI rendering
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    // Initialize particles
    const createParticle = (isInitial = false): Particle => {
      const pLife = 8000 + Math.random() * 8000;
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + 50,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.25 + Math.random() * 0.45),
        radius: 1.5 + Math.random() * 3.5,
        alpha: 0.1 + Math.random() * 0.6,
        waveFrequency: 0.0005 + Math.random() * 0.0015,
        waveAmplitude: 15 + Math.random() * 30,
        birth: Date.now(),
        life: pLife
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle(true));
      }
    };

    // Use ResizeObserver for accurate and performant container-relative resizing
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (particles.length === 0) {
        initParticles();
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    // Fallback resize
    resize();
    initParticles();

    // Fluid background wave states
    let waveTime = 0;

    const draw = () => {
      if (!ctx) return;

      const targets = targetsRef.current;
      if (!targets) return;

      // Initialize animated colors if they are not set yet
      if (!colorsRef.current) {
        colorsRef.current = {
          gradTo: [...targets.gradTo],
          gradFrom: [...targets.gradFrom],
          glowCol: [...targets.glowCol],
          partCol: [...targets.partCol]
        };
      }

      // Smoothly transition current colors towards active target colors (lower factor = smoother transition)
      lerpColor(colorsRef.current.gradTo, targets.gradTo, 0.015);
      lerpColor(colorsRef.current.gradFrom, targets.gradFrom, 0.015);
      lerpColor(colorsRef.current.glowCol, targets.glowCol, 0.015);
      lerpColor(colorsRef.current.partCol, targets.partCol, 0.015);

      const gradTo = colorToRgbaStr(colorsRef.current.gradTo);
      const gradFrom = colorToRgbaStr(colorsRef.current.gradFrom);

      // Clear with solid base color
      ctx.fillStyle = gradTo;
      ctx.fillRect(0, 0, width, height);

      // Create a large atmospheric breathing background glow
      const now = Date.now();
      const pulse = Math.sin(now * 0.0004) * 0.15 + 1.0; // Slow breathing rate
      const grad = ctx.createRadialGradient(
        width / 2, 
        height * 0.45, 
        20, 
        width / 2, 
        height * 0.45, 
        Math.max(width, height) * 0.75 * pulse
      );
      grad.addColorStop(0, gradFrom);
      grad.addColorStop(1, gradTo);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Overlapping glowing spiritual aura shapes in the center
      ctx.save();
      // Use different blending for light mode to avoid whiteouts
      ctx.globalCompositeOperation = isLightTheme ? 'multiply' : 'screen';
      
      const numAuras = 2;
      for (let a = 0; a < numAuras; a++) {
        const offset = a * Math.PI;
        const auraX = width / 2 + Math.cos(now * 0.0003 + offset) * (width * 0.08);
        const auraY = height / 2 + Math.sin(now * 0.0002 + offset) * (height * 0.05);
        const radius = Math.min(width, height) * (0.28 + a * 0.12) * (Math.sin(now * 0.0005 + offset) * 0.08 + 1);

        const auraGrad = ctx.createRadialGradient(auraX, auraY, 0, auraX, auraY, radius);
        auraGrad.addColorStop(0, colorToRgbaStr(colorsRef.current.glowCol));
        auraGrad.addColorStop(0.5, colorToRgbaStr(colorsRef.current.glowCol, isLightTheme ? 0.03 : 0.04));
        auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(auraX, auraY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Slow fluid undulating waves at the bottom (2 overlapping layers)
      if (isActive) {
        waveTime += 0.0018;
      }
      
      ctx.save();
      ctx.globalCompositeOperation = isLightTheme ? 'multiply' : 'screen';
      
      // Layer 1
      ctx.fillStyle = colorToRgbaStr(colorsRef.current.glowCol, isLightTheme ? 0.03 : 0.04);
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = height - 120 + 
          Math.sin(x * 0.003 + waveTime) * 25 + 
          Math.cos(x * 0.0012 + waveTime * 0.7) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Layer 2 (offset)
      ctx.fillStyle = colorToRgbaStr(colorsRef.current.glowCol, isLightTheme ? 0.015 : 0.02);
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = height - 90 + 
          Math.cos(x * 0.004 - waveTime * 1.1) * 30 + 
          Math.sin(x * 0.0015 - waveTime * 0.5) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Update and draw floating particles
      particles.forEach((p, idx) => {
        if (isActive) {
          const age = now - p.birth;
          if (age > p.life) {
            particles[idx] = createParticle(false);
            return;
          }

          p.y += p.vy;
          // Sway horizontally in a gentle sine wave
          p.x += p.vx + Math.sin(now * p.waveFrequency + p.birth) * 0.12;
          
          // Fade in and out gently near birth and death
          const lifePercent = age / p.life;
          if (lifePercent < 0.15) {
            p.alpha = (lifePercent / 0.15) * (0.1 + Math.random() * 0.5);
          } else if (lifePercent > 0.8) {
            p.alpha = ((1 - lifePercent) / 0.2) * (0.1 + Math.random() * 0.5);
          }
        }

        // Draw glowing particle
        ctx.save();
        ctx.beginPath();
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        pGrad.addColorStop(0, colorToRgbaStr(colorsRef.current!.partCol, p.alpha));
        pGrad.addColorStop(0.5, colorToRgbaStr(colorsRef.current!.partCol, p.alpha * 0.3));
        pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = pGrad;
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Wrap around screen edges if blown out
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) {
          particles[idx] = createParticle(false);
        }
      });

      // Continue animation loop
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start drawing loop
    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [isActive]); // Re-run only when activation state shifts

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-3xl"
      id="abstract-spiritual-canvas"
    />
  );
};
