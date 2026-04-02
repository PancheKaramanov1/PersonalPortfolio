import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) role!: string;
  @Input({ required: true }) intro!: string;
  @Input({ required: true }) primaryLabel!: string;
  @Input({ required: true }) primaryLink!: string;
  @Input({ required: true }) secondaryLabel!: string;
  @Input({ required: true }) secondaryLink!: string;
}
