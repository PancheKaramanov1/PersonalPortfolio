import { Injectable, signal } from '@angular/core';
import {
  DAW_STEP_COUNT,
  DAW_TRACK_COUNT,
  DawTrackMeta,
  OscWaveform,
  SYNTH_NOTES,
  SynthConfig,
  defaultGrooveGrid,
  defaultSynthStepNotes,
  emptyGrid,
  emptySynthStepNotes,
} from './models/daw.models';

@Injectable({ providedIn: 'root' })
export class DawStateService {
  readonly tracks: readonly DawTrackMeta[] = [
    { id: 'drums', label: 'Drums' },
    { id: 'bass', label: 'Bass' },
    { id: 'ambient', label: 'Ambient' },
    { id: 'synth', label: 'Synth' },
  ] as const;

  readonly pattern = signal<boolean[][]>(defaultGrooveGrid());
  readonly synthStepNotes = signal<(number | null)[]>(defaultSynthStepNotes());
  readonly bpm = signal(118);
  readonly isPlaying = signal(false);
  readonly currentStep = signal<number | null>(null);

  readonly trackVolumes = signal<number[]>([0.9, 0.7, 0.6, 0.65]);
  readonly trackMutes = signal<boolean[]>([false, false, false, false]);

  readonly synthConfig = signal<SynthConfig>({
    waveform: 'sawtooth',
    noteIndex: 12,
    attack: 0.01,
    release: 0.15,
  });

  toggleStep(trackIndex: number, stepIndex: number): void {
    if (
      trackIndex < 0 || trackIndex >= DAW_TRACK_COUNT ||
      stepIndex < 0 || stepIndex >= DAW_STEP_COUNT
    ) {
      return;
    }
    const next = this.pattern().map((row) => [...row]);
    const turningOn = !next[trackIndex][stepIndex];
    next[trackIndex][stepIndex] = turningOn;
    this.pattern.set(next);

    if (trackIndex === 3) {
      const notes = [...this.synthStepNotes()];
      notes[stepIndex] = turningOn ? this.synthConfig().noteIndex : null;
      this.synthStepNotes.set(notes);
    }
  }

  clearPattern(): void {
    this.pattern.set(emptyGrid());
    this.synthStepNotes.set(emptySynthStepNotes());
  }

  setTrackVolume(trackIndex: number, vol: number): void {
    const vols = [...this.trackVolumes()];
    vols[trackIndex] = Math.max(0, Math.min(1, vol));
    this.trackVolumes.set(vols);
  }

  toggleTrackMute(trackIndex: number): void {
    const mutes = [...this.trackMutes()];
    mutes[trackIndex] = !mutes[trackIndex];
    this.trackMutes.set(mutes);
  }

  setSynthWaveform(wf: OscWaveform): void {
    this.synthConfig.update((c) => ({ ...c, waveform: wf }));
  }

  setSynthNote(index: number): void {
    if (index >= 0 && index < SYNTH_NOTES.length) {
      this.synthConfig.update((c) => ({ ...c, noteIndex: index }));
    }
  }

  setSynthAttack(v: number): void {
    this.synthConfig.update((c) => ({ ...c, attack: Math.max(0.002, Math.min(0.3, v)) }));
  }

  setSynthRelease(v: number): void {
    this.synthConfig.update((c) => ({ ...c, release: Math.max(0.02, Math.min(1.0, v)) }));
  }

  setPlaying(playing: boolean): void {
    this.isPlaying.set(playing);
    if (!playing) {
      this.currentStep.set(null);
    }
  }

  setCurrentStep(step: number | null): void {
    this.currentStep.set(step);
  }
}
