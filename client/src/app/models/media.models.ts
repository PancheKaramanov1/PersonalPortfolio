export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number | null;
  genre: string | null;
  cover_url: string | null;
  rating: number | null;
  top_track: string | null;
  note: string | null;
  created_at: string;
  youtube_url?: string | null;
  youtube_embed_url?: string | null;
  youtube_type?: 'playlist' | 'video' | string | null;
  youtube_title?: string | null;
  featured_track?: string | null;
  source?: string | null;
  source_url?: string | null;
  favorite?: boolean;
}

export interface AlbumCreatePayload {
  title: string;
  artist: string;
  year?: number | null;
  genre?: string | null;
  cover_url?: string | null;
  rating?: number | null;
  top_track?: string | null;
  note?: string | null;
  youtube_url?: string | null;
  youtube_embed_url?: string | null;
  youtube_type?: string | null;
  youtube_title?: string | null;
  featured_track?: string | null;
  source?: string | null;
  source_url?: string | null;
  favorite?: boolean;
}

export interface HighlightsResponse {
  albums: Album[];
}

export interface HighlightsResult {
  data: HighlightsResponse;
  offline: boolean;
}

export interface ApiListResult<T> {
  data: T[];
  offline: boolean;
}
