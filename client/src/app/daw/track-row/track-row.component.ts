import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DawStateService } from '../daw-state.service';
import { DAW_STEP_COUNT, OscWaveform, SYNTH_NOTES } from '../models/daw.models';

@Component({
  selector: 'app-track-row',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './track-row.component.html',
  styleUrl: './track-row.component.scss',
})
export class TrackRowComponent {
  @Input({ required: true }) trackIndex!: number;
  @Input({ required: true }) label!: string;

  readonly state = inject(DawStateService);
  readonly stepCount = DAW_STEP_COUNT;
  readonly synthNotes = SYNTH_NOTES;
  readonly waveforms: OscWaveform[] = ['sine', 'square', 'sawtooth', 'triangle'];

  readonly steps = () => this.state.pattern()[this.trackIndex] ?? [];
  readonly isMuted = () => this.state.trackMutes()[this.trackIndex] ?? false;
  readonly volume = () => this.state.trackVolumes()[this.trackIndex] ?? 1;
  readonly isSynth = () => this.trackIndex === 3;

  get synthFreqLabel(): string {
    const cfg = this.state.synthConfig();
    return (SYNTH_NOTES[cfg.noteIndex]?.freq ?? 0).toFixed(0) + ' Hz';
  }

  stepNoteLabel(stepIndex: number): string {
    const noteIdx = this.state.synthStepNotes()[stepIndex];
    if (noteIdx == null) return '';
    return SYNTH_NOTES[noteIdx]?.label ?? '';
  }

  get attackLabel(): string {
    return (this.state.synthConfig().attack * 1000).toFixed(0) + ' ms';
  }

  get releaseLabel(): string {
    return (this.state.synthConfig().release * 1000).toFixed(0) + ' ms';
  }

  toggle(step: number): void {
    this.state.toggleStep(this.trackIndex, step);
  }

  onMute(): void {
    this.state.toggleTrackMute(this.trackIndex);
  }

  onVolume(ev: Event): void {
    const v = Number((ev.target as HTMLInputElement).value);
    if (Number.isFinite(v)) this.state.setTrackVolume(this.trackIndex, v);
  }

  onWaveform(wf: string): void {
    this.state.setSynthWaveform(wf as OscWaveform);
  }

  onNoteChange(value: string | number): void {
    this.state.setSynthNote(Number(value));
  }

  onAttack(ev: Event): void {
    this.state.setSynthAttack(Number((ev.target as HTMLInputElement).value));
  }

  onRelease(ev: Event): void {
    this.state.setSynthRelease(Number((ev.target as HTMLInputElement).value));
  }
}
