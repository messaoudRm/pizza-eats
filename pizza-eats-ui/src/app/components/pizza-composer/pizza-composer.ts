import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, input, output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, of, switchMap } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import {
  CustomPizzaRequest,
  CustomPizzaResult,
  INGREDIENTS,
  Ingredient,
  PIZZA_BASES,
  PIZZA_SIZES,
  PizzaBase,
  PizzaSize,
} from '../../core/models/pizza.model';
import { PizzaService } from '../../core/services/pizza.service';
import { getErrorMessage } from '../../core/http-error';
import { Icon } from '../icon/icon';

// Composer sa pizza (US8) : base, taille, ingrédients. Le prix est calculé par l'API.
@Component({
  selector: 'app-pizza-composer',
  imports: [CurrencyPipe, Icon],
  templateUrl: './pizza-composer.html',
  styleUrl: './pizza-composer.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PizzaComposer implements OnInit {
  private pizzaService = inject(PizzaService);
  private destroyRef = inject(DestroyRef);
  // Chaque changement de composition déclenche un calcul ; switchMap annule le calcul précédent
  private changes = new Subject<CustomPizzaRequest>();

  brandId = input.required<string>();
  busy = input<boolean>(false);
  add = output<CustomPizzaRequest>();

  bases = PIZZA_BASES;
  sizes = PIZZA_SIZES;
  ingredients = INGREDIENTS;

  base: PizzaBase = 'tomato';
  size: PizzaSize = 'M';
  selectedIngredients: Ingredient[] = [];

  result: CustomPizzaResult | null = null;
  loading = false;
  error = '';

  ngOnInit(): void {
    // POST /pizzas/customize à chaque changement
    this.changes
      .pipe(
        switchMap((request) =>
          this.pizzaService.customize(request).pipe(
            // L'erreur est gérée ici pour que les calculs suivants continuent de fonctionner
            catchError((error) => {
              this.error = getErrorMessage(error, 'Impossible de calculer le prix.');
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (result) {
          this.result = result;
        }
        this.loading = false;
      });

    this.calculatePrice();
  }

  selectBase(base: PizzaBase): void {
    this.base = base;
    this.calculatePrice();
  }

  selectSize(size: PizzaSize): void {
    this.size = size;
    this.calculatePrice();
  }

  toggleIngredient(ingredient: Ingredient): void {
    if (this.isSelected(ingredient)) {
      this.selectedIngredients = this.selectedIngredients.filter((item) => item !== ingredient);
    } else {
      this.selectedIngredients = [...this.selectedIngredients, ingredient];
    }
    this.calculatePrice();
  }

  isSelected(ingredient: Ingredient): boolean {
    return this.selectedIngredients.includes(ingredient);
  }

  private calculatePrice(): void {
    this.loading = true;
    this.error = '';
    this.changes.next(this.buildRequest());
  }

  onAdd(): void {
    this.add.emit(this.buildRequest());
  }

  private buildRequest(): CustomPizzaRequest {
    return {
      brandId: this.brandId(),
      base: this.base,
      size: this.size,
      ingredients: this.selectedIngredients,
    };
  }
}
