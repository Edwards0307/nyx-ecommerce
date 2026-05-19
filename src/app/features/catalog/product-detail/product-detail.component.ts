import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { AiService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      (click)="onBackdropClick($event)"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex justify-end p-4 pb-0">
          <button
            (click)="close.emit()"
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 pb-4 grid md:grid-cols-2 gap-6">
          <div class="flex items-center justify-center bg-gray-50 rounded-xl p-6 h-64">
            <img
              [src]="product().image"
              [alt]="product().title"
              class="h-full w-full object-contain"
            />
          </div>

          <div class="flex flex-col gap-3">
            <span class="text-xs font-semibold text-rose-500 uppercase tracking-wide capitalize">
              {{ product().category }}
            </span>
            <h2 class="text-lg font-bold text-gray-900 leading-tight">{{ product().title }}</h2>

            <div class="flex items-center gap-2">
              <div class="flex gap-0.5">
                @for (star of stars; track $index) {
                  <svg
                    class="w-4 h-4"
                    [class]="$index < filledStars ? 'text-amber-400' : 'text-gray-200'"
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
              </div>
              <span class="text-sm text-gray-500">
                {{ product().rating.rate }} · {{ product().rating.count }} reseñas
              </span>
            </div>

            <p class="text-2xl font-bold text-gray-900">{{'$'}}{{ product().price.toFixed(2) }}</p>

            <button
              (click)="addToCart()"
              class="w-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-auto"
            >
              Agregar al carrito
            </button>
          </div>
        </div>

        <div class="px-6 pb-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Descripción</h3>
          <p class="text-sm text-gray-600 leading-relaxed">{{ product().description }}</p>
        </div>

        <div class="mx-6 mb-6 bg-rose-50 border border-rose-100 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-xs font-bold text-rose-600 uppercase tracking-wide">Resumen IA</span>
          </div>
          @if (aiLoading()) {
            <div class="space-y-2">
              <div class="animate-pulse bg-rose-200 rounded h-3 w-full"></div>
              <div class="animate-pulse bg-rose-200 rounded h-3 w-3/4"></div>
            </div>
          } @else {
            <p class="text-sm text-rose-800 leading-relaxed">{{ aiSummary() }}</p>
          }
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product = input.required<Product>();
  close = output<void>();

  private cartService = inject(CartService);
  private aiService = inject(AiService);

  aiSummary = signal('');
  aiLoading = signal(true);

  readonly stars = Array(5).fill(0);

  get filledStars(): number {
    return Math.round(this.product().rating.rate);
  }

  ngOnInit(): void {
    this.aiService.generateProductSummary(this.product()).subscribe(summary => {
      this.aiSummary.set(summary);
      this.aiLoading.set(false);
    });
  }

  addToCart(): void {
    this.cartService.add(this.product());
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
