import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-6">
      <div class="max-w-3xl mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Mi Carrito</h1>
          <a
            routerLink="/catalog"
            class="text-sm text-rose-500 hover:text-rose-600 font-semibold transition-colors"
          >
            ← Seguir comprando
          </a>
        </div>

        @if (cartService.items().length === 0) {
          <div class="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Tu carrito está vacío</h3>
            <p class="text-gray-400 text-sm mb-6">
              Agrega productos desde el catálogo para comenzar.
            </p>
            <a
              routerLink="/catalog"
              class="inline-block bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Ver catálogo
            </a>
          </div>
        } @else {
          <div class="space-y-3 mb-6">
            @for (item of cartService.items(); track item.product.id) {
              <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <img
                  [src]="item.product.image"
                  [alt]="item.product.title"
                  class="w-16 h-16 object-contain rounded-xl bg-gray-50 p-1.5 flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 line-clamp-1">
                    {{ item.product.title }}
                  </p>
                  <p class="text-xs text-gray-400 capitalize mt-0.5">{{ item.product.category }}</p>
                  <p class="text-sm font-bold text-rose-500 mt-1">
                    {{ '$' }}{{ item.product.price.toFixed(2) }}
                  </p>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <button
                    (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                    class="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-rose-300 transition-all text-sm font-bold"
                  >
                    −
                  </button>
                  <span class="w-6 text-center text-sm font-bold text-gray-800">{{
                    item.quantity
                  }}</span>
                  <button
                    (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                    class="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-rose-300 transition-all text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <div class="text-right flex-shrink-0 min-w-[70px]">
                  <p class="text-sm font-bold text-gray-900">
                    {{ '$' }}{{ (item.product.price * item.quantity).toFixed(2) }}
                  </p>
                  <button
                    (click)="cartService.remove(item.product.id)"
                    class="text-xs text-rose-400 hover:text-rose-600 transition-colors mt-1 font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            }
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-base font-bold text-gray-900 mb-4">Resumen del pedido</h2>
            <div class="space-y-2 text-sm text-gray-500 mb-4">
              @for (item of cartService.items(); track item.product.id) {
                <div class="flex justify-between gap-4">
                  <span class="truncate">{{ item.product.title }} × {{ item.quantity }}</span>
                  <span class="font-semibold text-gray-700 flex-shrink-0">
                    {{ '$' }}{{ (item.product.price * item.quantity).toFixed(2) }}
                  </span>
                </div>
              }
            </div>
            <div class="border-t border-gray-100 pt-4 flex justify-between items-center mb-5">
              <span class="font-bold text-gray-900">Total</span>
              <span class="text-2xl font-extrabold text-gray-900"
                >{{ '$' }}{{ cartService.totalPrice().toFixed(2) }}</span
              >
            </div>
            <div class="flex gap-3">
              <button
                (click)="confirmClear()"
                class="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                Vaciar carrito
              </button>
              <button
                (click)="confirmCheckout()"
                class="flex-1 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white py-3 rounded-xl text-sm font-bold transition-all"
              >
                Pagar ahora
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class CartComponent {
  cartService = inject(CartService);

  confirmClear(): void {
    if (confirm('¿Deseas vaciar el carrito?')) {
      this.cartService.clear();
    }
  }

  confirmCheckout(): void {
    alert(
      `¡Compra confirmada! 🎉\nTotal: $${this.cartService.totalPrice().toFixed(2)}\n\nTu pedido está siendo procesado.`,
    );
    this.cartService.clear();
  }
}
