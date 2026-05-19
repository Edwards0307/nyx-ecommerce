import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Sin resultados</h3>
      <p class="text-gray-500 text-sm max-w-sm">
        No encontramos productos que coincidan con tu búsqueda. Intenta con otros términos o
        categorías.
      </p>
    </div>
  `,
})
export class EmptyStateComponent {}
