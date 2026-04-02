import { Injectable, inject } from '@angular/core';
import { DawStateService } from './daw-state.service';
import { DAW_STEP_COUNT, DAW_TRACK_COUNT, SYNTH_NOTES } from './models/daw.models';

@Injectable({ providedIn: 'root' })
export class DawAudioService {
  private readonly state = inject(DawStateService);

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private trackGains: GainNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private playing = false;
  private nextStepTime = 0;
  private stepIndex = 0;

  start(): void {
    const ctx = this.ensureContext();
    if (this.playing) return;
    void ctx.resume();
    this.playing = true;
    this.state.setPlaying(true);
    this.nextStepTime = ctx.currentTime + 0.05;
    this.stepIndex = 0;
    this.schedule();
  }

  stop(): void {
    this.playing = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.state.setPlaying(false);
  }

  dispose(): void {
    this.stop();
  }

  private schedule(): void {
    if (!this.playing) return;
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    this.syncTrackGains();
    const lookahead = 0.14;
    const stepDur = this.stepDurationSec();

    while (this.nextStepTime < ctx.currentTime + lookahead) {
      const i = this.stepIndex;
      this.state.setCurrentStep(i);
      this.triggerStep(i, this.nextStepTime, ctx);
      this.nextStepTime += stepDur;
      this.stepIndex = (this.stepIndex + 1) % DAW_STEP_COUNT;
    }

    this.timerId = setTimeout(() => this.schedule(), 20);
  }

  private stepDurationSec(): number {
    const bpm = Math.max(60, Math.min(180, this.state.bpm()));
    return (60 / bpm) / 4;
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.32;
      this.master.connect(this.ctx.destination);
      this.noiseBuffer = this.makeNoiseBuffer(this.ctx);

      this.trackGains = [];
      for (let t = 0; t < DAW_TRACK_COUNT; t++) {
        const g = this.ctx.createGain();
        g.gain.value = 1;
        g.connect(this.master);
        this.trackGains.push(g);
      }
    }
    return this.ctx;
  }

  private syncTrackGains(): void {
    const vols = this.state.trackVolumes();
    const mutes = this.state.trackMutes();
    for (let t = 0; t < this.trackGains.length; t++) {
      this.trackGains[t].gain.value = mutes[t] ? 0 : vols[t] ?? 1;
    }
  }

  private makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const len = ctx.sampleRate * 0.2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      ch[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  private triggerStep(step: number, time: number, ctx: AudioContext): void {
    const grid = this.state.pattern();
    const mutes = this.state.trackMutes();
    for (let t = 0; t < DAW_TRACK_COUNT; t++) {
      if (grid[t]?.[step] && !mutes[t]) {
        const dest = this.trackGains[t] || this.master!;
        if (t === 0) this.playKick(time, ctx, dest);
        else if (t === 1) this.playBass(time, ctx, dest);
        else if (t === 2) this.playAmbient(time, ctx, dest);
        else if (t === 3) {
          const noteIdx = this.state.synthStepNotes()[step];
          const freq = noteIdx != null
            ? (SYNTH_NOTES[noteIdx]?.freq ?? 130.81)
            : 130.81;
          this.playSynth(time, ctx, dest, freq);
        }
      }
    }
  }

  private playKick(t: number, ctx: AudioContext, dest: GainNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(165, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.06);
    gain.gain.setValueAtTime(0.95, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  private playBass(t: number, ctx: AudioContext, dest: GainNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(58, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  private playAmbient(t: number, ctx: AudioContext, dest: GainNode): void {
    const buf = this.noiseBuffer;
    if (!buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2400, t);
    bp.Q.setValueAtTime(0.9, t);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    src.connect(bp);
    bp.connect(gain);
    gain.connect(dest);
    src.start(t);
    src.stop(t + 0.35);
  }

  private playSynth(t: number, ctx: AudioContext, dest: GainNode, freq: number): void {
    const cfg = this.state.synthConfig();
    const attack = cfg.attack;
    const release = cfg.release;
    const duration = attack + release + 0.05;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = cfg.waveform;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, t + attack + release);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + duration);
  }
}
