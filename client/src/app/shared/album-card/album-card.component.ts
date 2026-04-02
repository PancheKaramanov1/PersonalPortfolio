import { Component, HostListener, Input } from '@angular/core';
import { Album } from '../../models/media.models';
import { resolveAlbumYoutube } from '../../utils/youtube-embed';
import { AlbumPlayerComponent } from '../album-player/album-player.component';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [AlbumPlayerComponent],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.scss',
})
export class AlbumCardComponent {
  @Input({ required: true }) album!: Album;
  @Input() listenUi = false;

  modalOpen = false;
  coverError = false;

  get canListen(): boolean {
    return Boolean(resolveAlbumYoutube(this.album).embedUrl);
  }

  get initials(): string {
    const parts = [this.album.artist, this.album.title].filter(Boolean);
    return parts
      .map((p) => (p ?? '').charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }

  openListen(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    setTimeout(() => {
      this.modalOpen = true;
    }, 0);
  }

  closeListen(): void {
    this.modalOpen = false;
  }

  onCoverError(): void {
    this.coverError = true;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    if (this.modalOpen) {
      event.preventDefault();
      this.closeListen();
    }
  }
}
