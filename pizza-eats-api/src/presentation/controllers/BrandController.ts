
import { BrandService } from "../../application/services/BrandService";

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  getAllBrands() {
    return this.brandService.getAllBrands();
  }

  getBrandMenu(brandId: string) {
    return this.brandService.getBrandMenu(brandId);
  }
}