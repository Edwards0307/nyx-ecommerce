import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a routerLink="/catalog" class="flex items-center gap-2 select-none">
          <span class="text-2xl font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            NYX
          </span>
          <span class="text-sm text-gray-400 font-medium hidden sm:block">eCommerce</span>
        </a>

        <a
          routerLink="/cart"
          class="relative flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl transition-colors font-semibold text-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="hidden sm:block">Carrito</span>
          @if (cartService.totalItems() > 0) {
            <span class="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
              {{ cartService.totalItems() }}
            </span>
          }
        </a>
      </div>
    </header>
  `
})
export class HeaderComponent {
  cartService = inject(CartService);
}
