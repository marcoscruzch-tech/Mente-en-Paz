/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class AudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private biquadFilter: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private voiceGains: GainNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private filterLfo: OscillatorNode | null = null;
  private filterLfoGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentPreset: string = 'singing-bowls';
  private volume: number = 0.4;
  private bowlInterval: any = null;

  constructor() {
    // Singleton or persistent variables can go here
  }

  private initContext() {
    if (this.ctx) return;
    
    // Create audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Warm Resonant Lowpass Filter to smooth out high frequencies
    this.biquadFilter = this.ctx.createBiquadFilter();
    this.biquadFilter.type = 'lowpass';
    this.biquadFilter.frequency.setValueAtTime(450, this.ctx.currentTime); // Soft, warm filter cutoff
    this.biquadFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);
    this.biquadFilter.connect(this.masterGain);

    // Feedback Delay Line (simulates a vast cathedral-style acoustic echo)
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayGain = this.ctx.createGain();
    
    this.delayNode.delayTime.setValueAtTime(0.75, this.ctx.currentTime); // 750ms echo spacing
    this.delayGain.gain.setValueAtTime(0.35, this.ctx.currentTime); // 35% feedback loop
    
    // Delay feedback path
    this.delayNode.connect(this.delayGain);
    this.delayGain.connect(this.delayNode);
    
    // Connect wet delay output to filter
    this.delayNode.connect(this.biquadFilter);

    // Drone master gain
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    
    // Route drone to both dry (direct filter) and wet (delay) lines for lush stereo space
    this.droneGain.connect(this.biquadFilter);
    this.droneGain.connect(this.delayNode);
  }

  public start(presetId: string = 'singing-bowls') {
    this.initContext();
    if (!this.ctx || !this.masterGain || !this.droneGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    }

    this.isPlaying = true;
    this.currentPreset = presetId;

    const now = this.ctx.currentTime;

    // Fade in master gain smoothly
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.5);

    if (presetId === 'none') {
      return;
    }

    // Set up continuous drone volume fade-in
    this.droneGain.gain.cancelScheduledValues(now);
    this.droneGain.gain.setValueAtTime(0, now);
    this.droneGain.gain.linearRampToValueAtTime(0.25, now + 4.0); // Ultra-gentle swell

    // Reset lowpass frequency to baseline
    if (this.biquadFilter) {
      this.biquadFilter.frequency.cancelScheduledValues(now);
      this.biquadFilter.frequency.setValueAtTime(450, now);
    }

    if (presetId === 'singing-bowls') {
      // Clean, majestic open suspended-fifth chord (F2, C3, F3, G3, C4, F4)
      const frequencies = [87.31, 130.81, 174.61, 196.00, 261.63, 349.23];
      
      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.droneGain) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // Deep warm triangle waves
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        // Subtle organic detuning for a rich, warm chorusing effect
        osc.detune.setValueAtTime((idx - 2.5) * 3, this.ctx.currentTime); 
        
        const baseGainVal = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(baseGainVal, this.ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(this.droneGain);
        osc.start();
        
        this.oscillators.push(osc);
        this.voiceGains.push(gain);
      });

      // LFO simulating slow, serene diaphragmatic breath cycles
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();
      
      this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12 seconds per breath
      this.lfoGain.gain.setValueAtTime(0.06, this.ctx.currentTime); // Deep subtle modulation
      
      this.lfo.connect(this.lfoGain);
      if (this.droneGain) {
        this.lfoGain.connect(this.droneGain.gain);
      }
      this.lfo.start();

      // Trigger automatic, serene singing bowl chime immediately and every 13.5 seconds
      setTimeout(() => {
        if (this.isPlaying && this.currentPreset === 'singing-bowls') {
          this.triggerSingingBowl();
        }
      }, 1200);

      this.bowlInterval = setInterval(() => {
        if (this.isPlaying && this.currentPreset === 'singing-bowls') {
          this.triggerSingingBowl();
        }
      }, 13500);

    } else if (presetId === 'cosmic-drone') {
      // Deep cosmic soundscape chord (C1 sub, G1, C2, G2, C3, D3, G3)
      const frequencies = [32.70, 49.00, 65.41, 98.00, 130.81, 146.83, 196.00];
      
      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.droneGain) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // Soft pure sine waves blended with subharmonics
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.detune.setValueAtTime((idx - 3) * 4, this.ctx.currentTime); 
        
        const baseGainVal = 0.16 / (idx + 1.2);
        gain.gain.setValueAtTime(baseGainVal, this.ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(this.droneGain);
        osc.start();
        
        this.oscillators.push(osc);
        this.voiceGains.push(gain);
      });

      // Subterranean moving cosmic LFO (slow shifting ambient motion)
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();
      this.lfo.frequency.setValueAtTime(0.05, this.ctx.currentTime); // 20s wave cycle
      this.lfoGain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      
      this.lfo.connect(this.lfoGain);
      if (this.droneGain) {
        this.lfoGain.connect(this.droneGain.gain);
      }
      this.lfo.start();

      // Cosmic dynamic filter sweeping (creates space-wind/galactic wash sensation)
      if (this.biquadFilter) {
        this.filterLfo = this.ctx.createOscillator();
        this.filterLfoGain = this.ctx.createGain();
        
        this.filterLfo.frequency.setValueAtTime(0.04, this.ctx.currentTime); // 25s slow sweeps
        this.filterLfoGain.gain.setValueAtTime(140, this.ctx.currentTime); // Sweep lowpass cutoff +/- 140Hz
        
        this.filterLfo.connect(this.filterLfoGain);
        this.filterLfoGain.connect(this.biquadFilter.frequency);
        this.filterLfo.start();
      }

    } else if (presetId === 'heavenly-pad') {
      // Ethereal Major 9th chord (F2, C3, A3, C4, E4, G4)
      const frequencies = [87.31, 130.81, 220.00, 261.63, 329.63, 392.00];
      
      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.droneGain) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.detune.setValueAtTime((idx - 2.5) * 6, this.ctx.currentTime);
        
        const baseGainVal = 0.12 / (idx + 1.2);
        gain.gain.setValueAtTime(baseGainVal, this.ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(this.droneGain);
        osc.start();
        
        this.oscillators.push(osc);
        this.voiceGains.push(gain);
      });

      // Shimmer LFO for breathing pad harmonics
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();
      this.lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10 second swell
      this.lfoGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      
      this.lfo.connect(this.lfoGain);
      if (this.droneGain) {
        this.lfoGain.connect(this.droneGain.gain);
      }
      this.lfo.start();

      // Sweeping high cutoff low-pass to make it sparkle
      if (this.biquadFilter) {
        this.filterLfo = this.ctx.createOscillator();
        this.filterLfoGain = this.ctx.createGain();
        
        this.filterLfo.frequency.setValueAtTime(0.07, this.ctx.currentTime); // 14s cycle
        this.filterLfoGain.gain.setValueAtTime(180, this.ctx.currentTime); // Sweep by +/- 180Hz
        
        this.filterLfo.connect(this.filterLfoGain);
        this.filterLfoGain.connect(this.biquadFilter.frequency);
        this.filterLfo.start();
      }
    }
  }

  public triggerSingingBowl() {
    this.initContext();
    if (!this.ctx || !this.masterGain || !this.isPlaying || this.currentPreset === 'none') return;

    const now = this.ctx.currentTime;

    // Professional singing bowl formula: fundamental G3 with harmonic and rich non-harmonic overtones
    const fundamental = 196.00; // G3
    const overtones = [1.0, 2.01, 2.84, 4.02, 5.51, 6.88];
    const overtoneGains = [0.38, 0.24, 0.14, 0.09, 0.05, 0.02];
    const decayTimes = [16.0, 12.0, 9.0, 7.0, 5.0, 4.0];

    overtones.forEach((ratio, idx) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * ratio, now);
      
      // Slight randomized detuning for realistic hammer-beaten metal vibration
      osc.detune.setValueAtTime(Math.sin(idx * 38) * 8, now);

      // Amplitude envelope: instantaneous soft attack, beautiful natural decay
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(overtoneGains[idx] * 0.16, now + 0.12); // Soft warm mallet strike
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTimes[idx]);

      osc.connect(gain);
      gain.connect(this.masterGain);
      
      // Send some singing bowl chime directly into the feedback delay to echo in the space majestically!
      if (this.delayNode) {
        gain.connect(this.delayNode);
      }
      
      osc.start(now);
      osc.stop(now + decayTimes[idx] + 0.5);
    });
  }

  public stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    // Clear active singing bowl interval
    if (this.bowlInterval) {
      clearInterval(this.bowlInterval);
      this.bowlInterval = null;
    }

    // Transfer active continuous nodes to temporary arrays for click-free fade-outs
    const oscToStop = [...this.oscillators];
    const gainToFade = [...this.voiceGains];
    const lfoToStop = this.lfo;
    const filterLfoToStop = this.filterLfo;

    this.oscillators = [];
    this.voiceGains = [];
    this.lfo = null;
    this.lfoGain = null;
    this.filterLfo = null;
    this.filterLfoGain = null;

    if (this.ctx) {
      const now = this.ctx.currentTime;
      gainToFade.forEach(gain => {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        } catch (e) {}
      });

      // Gently fade out master gain
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      }
    }

    setTimeout(() => {
      oscToStop.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      if (lfoToStop) {
        try { lfoToStop.stop(); } catch(e) {}
      }
      if (filterLfoToStop) {
        try { filterLfoToStop.stop(); } catch(e) {}
      }
    }, 1800);
  }

  public setVolume(volume: number) {
    this.volume = volume;
    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(volume, now + 0.2);
    }
  }

  public setPreset(presetId: string) {
    if (this.isPlaying) {
      this.start(presetId);
    } else {
      this.currentPreset = presetId;
    }
  }
}
