import { Component, input, output } from '@angular/core';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div
      class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group p-4 flex flex-col h-full"
      (click)="detail.emit(product())"
      (keydown.enter)="detail.emit(product())"
      role="article"
      tabindex="0"
    >
      <div
        class="relative h-48 flex items-center justify-center mb-4 rounded-xl bg-gray-50 overflow-hidden"
      >
        <img
          [src]="product().image"
          [alt]="product().title"
          class="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <span class="text-xs font-semibold text-rose-500 uppercase tracking-wide mb-1 capitalize">
        {{ product().category }}
      </span>

      <p class="text-sm font-semibold text-gray-800 line-clamp-2 flex-1 mb-3 leading-snug">
        {{ product().title }}
      </p>

      <div class="flex items-center gap-1 mb-3">
        @for (star of stars; track $index) {
          <svg
            class="w-3.5 h-3.5 flex-shrink-0"
            [class]="$index < filledStars ? 'text-amber-400' : 'text-gray-200'"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        }
        <span class="text-xs text-gray-400 ml-1">({{ product().rating.count }})</span>
      </div>

      <div class="flex items-center justify-between mt-auto gap-2">
        <span class="text-lg font-bold text-gray-900"
          >{{ '$' }}{{ product().price.toFixed(2) }}</span
        >
        <button
          (click)="onAddToCart($event)"
          class="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-150 whitespace-nowrap"
          aria-label="Agregar al carrito"
        >
          + Carrito
        </button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  product = input.required<Product>();
  detail = output<Product>();
  addedToCart = output<Product>();

  readonly stars = Array(5).fill(0);

  get filledStars(): number {
    return Math.round(this.product().rating.rate);
  }

  onAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    this.addedToCart.emit(this.product());
  }
}
