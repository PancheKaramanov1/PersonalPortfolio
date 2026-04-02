import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/studio', label: 'Studio' },
    { path: '/favorites', label: 'Favorites' },
  ] as const;
}
