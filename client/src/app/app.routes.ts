import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'About',
  },
  {
    path: 'studio',
    loadComponent: () =>
      import('./daw/daw-page/daw-page.component').then((m) => m.DawPageComponent),
    title: 'Studio',
  },
  { path: 'projects', redirectTo: 'studio', pathMatch: 'full' },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent),
    title: 'Favorites',
  },
  { path: '**', redirectTo: '' },
];
