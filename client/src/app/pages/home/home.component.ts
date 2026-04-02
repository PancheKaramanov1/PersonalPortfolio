import { Component, OnInit, inject } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';
import { AlbumCardComponent } from '../../shared/album-card/album-card.component';
import { FavoritesApiService } from '../../services/favorites-api.service';
import { HighlightsResponse } from '../../models/media.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, SectionHeaderComponent, AlbumCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly highlightsApi = inject(FavoritesApiService);

  loading = true;
  data: HighlightsResponse | null = null;
  highlightsOffline = false;

  readonly profile = {
    name: 'Panche Karamanov',
    role: 'Full-stack developer',
    intro:
      'I build web apps end to end—clear UIs, straightforward APIs, and data that behaves. This site is half portfolio, half notebook... and the albums I keep returning to.',
  };

  readonly currentInto = [
    'REST APIs with predictable errors and contracts that read well',
    'Dark, type-led interfaces with small, purposeful motion',
    'Scores and albums that make late-night work feel like a scene',
  ];

  ngOnInit(): void {
    this.highlightsApi.highlights().subscribe({
      next: (res) => {
        this.data = res.data;
        this.highlightsOffline = res.offline;
        this.loading = false;
      },
    });
  }

  previewAlbums() {
    return (this.data?.albums ?? []).slice(0, 2);
  }
}
