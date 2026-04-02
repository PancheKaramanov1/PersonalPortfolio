import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HighlightsResponse, HighlightsResult } from '../models/media.models';

@Injectable({ providedIn: 'root' })
export class FavoritesApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/favorites/highlights`;

  highlights(): Observable<HighlightsResult> {
    const empty: HighlightsResponse = { albums: [] };

    return this.http.get<HighlightsResponse>(this.url).pipe(
      map((h) => ({ data: h, offline: false })),
      catchError(() => of({ data: empty, offline: true }))
    );
  }
}
