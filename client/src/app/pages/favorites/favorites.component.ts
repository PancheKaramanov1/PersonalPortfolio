import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';
import { AlbumCardComponent } from '../../shared/album-card/album-card.component';
import { AlbumsService } from '../../services/albums.service';
import { Album, AlbumCreatePayload } from '../../models/media.models';

type SortKey = 'title' | 'artist' | 'year' | 'rating' | 'created_at';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [FormsModule, SectionHeaderComponent, AlbumCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  private readonly albumsApi = inject(AlbumsService);

  loading = true;
  albums: Album[] = [];
  albumsOffline = false;

  search = '';
  sortKey: SortKey = 'created_at';
  sortAsc = false;
  genreFilter = '';

  addFormOpen = false;
  addForm: AlbumCreatePayload = this.emptyForm();
  addLoading = false;
  addError: string | null = null;
  addSuccess: string | null = null;

  ngOnInit(): void {
    this.albumsApi.list().subscribe({
      next: (res) => {
        this.albums = res.data;
        this.albumsOffline = res.offline;
        this.loading = false;
      },
    });
  }

  genres(): string[] {
    const set = new Set<string>();
    for (const a of this.albums) {
      if (a.genre) set.add(a.genre);
    }
    return Array.from(set).sort();
  }

  filteredAlbums(): Album[] {
    const q = this.search.trim().toLowerCase();
    const genre = this.genreFilter;

    let list = this.albums;
    if (q) {
      list = list.filter((a) => this.matchesQuery(a, q));
    }
    if (genre) {
      list = list.filter((a) => a.genre === genre);
    }
    return this.sortAlbums(list);
  }

  onSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = key === 'title' || key === 'artist';
    }
  }

  toggleAddForm(): void {
    this.addFormOpen = !this.addFormOpen;
    if (this.addFormOpen) {
      this.addForm = this.emptyForm();
      this.addError = null;
      this.addSuccess = null;
    }
  }

  submitAlbum(): void {
    if (!this.addForm.title?.trim() || !this.addForm.artist?.trim()) {
      this.addError = 'Title and artist are required.';
      return;
    }
    this.addLoading = true;
    this.addError = null;
    this.addSuccess = null;

    const payload = { ...this.addForm };
    if (payload.year != null) payload.year = Number(payload.year) || null;
    if (payload.rating != null) payload.rating = Number(payload.rating) || null;

    this.albumsApi.create(payload).subscribe({
      next: (album) => {
        this.albums = [album, ...this.albums];
        this.addLoading = false;
        this.addSuccess = `Added "${album.title}" by ${album.artist}.`;
        this.addForm = this.emptyForm();
      },
      error: () => {
        this.addLoading = false;
        this.addError = 'Failed to save album. Check the API connection.';
      },
    });
  }

  private emptyForm(): AlbumCreatePayload {
    return {
      title: '',
      artist: '',
      year: null,
      genre: null,
      cover_url: null,
      rating: null,
      top_track: null,
      note: null,
      youtube_url: null,
      favorite: false,
    };
  }

  private matchesQuery(a: Album, q: string): boolean {
    const hay = [
      a.title, a.artist, a.note, a.genre, a.top_track,
      a.featured_track, a.youtube_title,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  }

  private sortAlbums(list: Album[]): Album[] {
    const copy = [...list];
    const dir = this.sortAsc ? 1 : -1;
    const key = this.sortKey;

    copy.sort((a, b) => {
      const va = a[key] ?? '';
      const vb = b[key] ?? '';
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
    return copy;
  }
}
