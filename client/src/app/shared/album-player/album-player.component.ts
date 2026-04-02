import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Album } from '../../models/media.models';
import { resolveAlbumYoutube } from '../../utils/youtube-embed';

@Component({
  selector: 'app-album-player',
  standalone: true,
  templateUrl: './album-player.component.html',
  styleUrl: './album-player.component.scss',
})
export class AlbumPlayerComponent implements OnChanges {
  @Input({ required: true }) album!: Album;

  safeUrl: SafeResourceUrl | null = null;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    const { embedUrl } = resolveAlbumYoutube(this.album);
    if (embedUrl && this.isTrustedYouTubeEmbed(embedUrl)) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.safeUrl = null;
    }
  }

  get hasEmbed(): boolean {
    return this.safeUrl !== null;
  }

  get kindLabel(): string {
    const t = resolveAlbumYoutube(this.album).type || this.album?.youtube_type;
    if (t === 'playlist') return 'Playlist';
    if (t === 'video') return 'Video';
    return 'Listen';
  }

  private isTrustedYouTubeEmbed(url: string): boolean {
    try {
      const u = new URL(url);
      const h = u.hostname.replace(/^www\./, '');
      if (h !== 'youtube.com' && h !== 'youtube-nocookie.com') {
        return false;
      }
      return u.pathname.startsWith('/embed');
    } catch {
      return false;
    }
  }
}
