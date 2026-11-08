import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Brand, BrandMenu } from '../models/brand.model';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private http = inject(HttpClient);

  // GET /brands
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${environment.apiUrl}/brands`);
  }

  // GET /brands/:brandId/menu
  getMenu(brandId: string): Observable<BrandMenu> {
    return this.http.get<BrandMenu>(`${environment.apiUrl}/brands/${brandId}/menu`);
  }

  // Photo de l'enseigne (public/images), avec une image par défaut
  getImage(brandId: string): string {
    return `images/${brandId}.webp`;
  }
}
