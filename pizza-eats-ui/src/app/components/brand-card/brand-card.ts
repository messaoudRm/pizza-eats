import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Brand } from '../../core/models/brand.model';

@Component({
  selector: 'app-brand-card',
  imports: [RouterLink],
  templateUrl: './brand-card.html',
  styleUrl: './brand-card.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class BrandCard {
  brand = input.required<Brand>();
  image = input.required<string>();

  // Image de secours si l'enseigne n'a pas de photo
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('images/default.webp')) {
      img.src = 'images/default.webp';
    }
  }
}
