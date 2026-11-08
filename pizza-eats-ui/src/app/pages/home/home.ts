import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Brand } from '../../core/models/brand.model';
import { BrandService } from '../../core/services/brand.service';
import { getErrorMessage } from '../../core/http-error';
import { BrandCard } from '../../components/brand-card/brand-card';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-home',
  imports: [BrandCard, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Home implements OnInit {
  brandService = inject(BrandService);

  brands: Brand[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadBrands();
  }

  // GET /brands
  loadBrands(): void {
    this.loading = true;
    this.error = '';

    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.loading = false;
      },
      error: (error) => {
        this.error = getErrorMessage(error, 'Impossible de charger les enseignes.');
        this.loading = false;
      },
    });
  }
}
