import { Component, inject } from '@angular/core';
import { TrackRowComponent } from '../track-row/track-row.component';
import { DawStateService } from '../daw-state.service';
import { DAW_STEP_COUNT } from '../models/daw.models';

@Component({
  selector: 'app-sequencer-grid',
  standalone: true,
  imports: [TrackRowComponent],
  templateUrl: './sequencer-grid.component.html',
  styleUrl: './sequencer-grid.component.scss',
})
export class SequencerGridComponent {
  readonly state = inject(DawStateService);
  readonly stepCount = DAW_STEP_COUNT;
  readonly stepLabels = Array.from({ length: DAW_STEP_COUNT }, (_, i) => i + 1);
}
