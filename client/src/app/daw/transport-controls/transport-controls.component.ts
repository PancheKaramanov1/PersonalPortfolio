import { Component, inject } from '@angular/core';
import { DawAudioService } from '../daw-audio.service';
import { DawStateService } from '../daw-state.service';

@Component({
  selector: 'app-transport-controls',
  standalone: true,
  templateUrl: './transport-controls.component.html',
  styleUrl: './transport-controls.component.scss',
})
export class TransportControlsComponent {
  readonly audio = inject(DawAudioService);
  readonly state = inject(DawStateService);

  onPlay(): void {
    this.audio.start();
  }

  onStop(): void {
    this.audio.stop();
  }

  onBpmInput(ev: Event): void {
    const v = Number((ev.target as HTMLInputElement).value);
    if (!Number.isFinite(v)) {
      return;
    }
    this.state.bpm.set(Math.round(Math.min(180, Math.max(60, v))));
  }
}
