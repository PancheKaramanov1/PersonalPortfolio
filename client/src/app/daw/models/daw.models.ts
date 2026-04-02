export const DAW_TRACK_COUNT = 4;
export const DAW_STEP_COUNT = 16;

export type OscWaveform = 'sine' | 'square' | 'sawtooth' | 'triangle';

export const SYNTH_NOTES: { label: string; freq: number }[] = [
  { label: 'C2',  freq: 65.41 },
  { label: 'C#2', freq: 69.30 },
  { label: 'D2',  freq: 73.42 },
  { label: 'D#2', freq: 77.78 },
  { label: 'E2',  freq: 82.41 },
  { label: 'F2',  freq: 87.31 },
  { label: 'F#2', freq: 92.50 },
  { label: 'G2',  freq: 98.00 },
  { label: 'G#2', freq: 103.83 },
  { label: 'A2',  freq: 110.00 },
  { label: 'A#2', freq: 116.54 },
  { label: 'B2',  freq: 123.47 },
  { label: 'C3',  freq: 130.81 },
  { label: 'C#3', freq: 138.59 },
  { label: 'D3',  freq: 146.83 },
  { label: 'D#3', freq: 155.56 },
  { label: 'E3',  freq: 164.81 },
  { label: 'F3',  freq: 174.61 },
  { label: 'F#3', freq: 185.00 },
  { label: 'G3',  freq: 196.00 },
  { label: 'G#3', freq: 207.65 },
  { label: 'A3',  freq: 220.00 },
  { label: 'A#3', freq: 233.08 },
  { label: 'B3',  freq: 246.94 },
  { label: 'C4',  freq: 261.63 },
  { label: 'C#4', freq: 277.18 },
  { label: 'D4',  freq: 293.66 },
  { label: 'D#4', freq: 311.13 },
  { label: 'E4',  freq: 329.63 },
];

export interface DawTrackMeta {
  id: string;
  label: string;
}

export interface SynthConfig {
  waveform: OscWaveform;
  noteIndex: number;
  attack: number;
  release: number;
}

export function emptySynthStepNotes(): (number | null)[] {
  return Array.from({ length: DAW_STEP_COUNT }, () => null);
}

export function emptyGrid(): boolean[][] {
  return Array.from({ length: DAW_TRACK_COUNT }, () =>
    Array.from({ length: DAW_STEP_COUNT }, () => false)
  );
}

export function defaultGrooveGrid(): boolean[][] {
  const g = emptyGrid();
  g[0][0] = true;
  g[0][4] = true;
  g[0][8] = true;
  g[0][12] = true;
  g[0][6] = true;
  g[0][14] = true;
  g[1][0] = true;
  g[1][7] = true;
  g[1][10] = true;
  g[1][14] = true;
  g[2][3] = true;
  g[2][11] = true;
  g[2][15] = true;
  g[3][0] = true;
  g[3][4] = true;
  g[3][8] = true;
  g[3][12] = true;
  return g;
}

export function defaultSynthStepNotes(): (number | null)[] {
  const notes = emptySynthStepNotes();
  notes[0] = 12;
  notes[4] = 16;
  notes[8] = 12;
  notes[12] = 21;
  return notes;
}
