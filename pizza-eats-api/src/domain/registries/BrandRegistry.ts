import { Brand } from "../entities/Brand";

type BrandConstructor = new () => Brand;

export class BrandRegistry {
  private static brands = new Map<string, BrandConstructor>();

  static register(id: string, brand: BrandConstructor): void {
    this.brands.set(id, brand);
  }

  static get(id: string): BrandConstructor {
    const brand = this.brands.get(id);

    if (!brand) {
      throw new Error(`Brand "${id}" is not registered`);
    }

    return brand;
  }

  // us 1 : lister les enseignes enregistrées (ajouter une enseigne = ajouter une classe)
  static getAll(): string[] {
    return [...this.brands.keys()];
  }
}
