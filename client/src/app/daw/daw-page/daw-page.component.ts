import { Component, OnDestroy, inject } from '@angular/core';
import { TransportControlsComponent } from '../transport-controls/transport-controls.component';
import { SequencerGridComponent } from '../sequencer-grid/sequencer-grid.component';
import { DawAudioService } from '../daw-audio.service';
import { DawStateService } from '../daw-state.service';

@Component({
  selector: 'app-daw-page',
  standalone: true,
  imports: [TransportControlsComponent, SequencerGridComponent],
  templateUrl: './daw-page.component.html',
  styleUrl: './daw-page.component.scss',
})
export class DawPageComponent implements OnDestroy {
  private readonly audio = inject(DawAudioService);
  readonly state = inject(DawStateService);

  ngOnDestroy(): void {
    this.audio.dispose();
  }

  clearGrid(): void {
    this.state.clearPattern();
  }
}
