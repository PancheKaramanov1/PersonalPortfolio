import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SectionHeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly skills = [
    { group: 'Frontend', items: ['Angular', 'TypeScript', 'SCSS'] },
    { group: 'Backend', items: ['Node.js', 'Express', 'REST APIs'] },
    { group: 'Data', items: ['SQL', 'Query and procedure optimization'] },
    { group: 'Delivery', items: ['Git', 'Railway'] },
  ];

  readonly interests = [
    'Visual design and interface details',
    'How systems behave under real use',
  ];
}
