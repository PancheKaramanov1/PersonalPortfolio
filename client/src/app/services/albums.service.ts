import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Album, AlbumCreatePayload, ApiListResult } from '../models/media.models';

@Injectable({ providedIn: 'root' })
export class AlbumsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/albums`;

  list(): Observable<ApiListResult<Album>> {
    return this.http.get<Album[]>(this.base).pipe(
      map((rows) => ({ data: rows ?? [], offline: false })),
      catchError(() => of({ data: [], offline: true }))
    );
  }

  create(payload: AlbumCreatePayload): Observable<Album> {
    return this.http.post<Album>(this.base, payload);
  }
}
