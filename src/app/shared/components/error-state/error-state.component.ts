import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Algo salió mal</h3>
      <p class="text-gray-500 text-sm mb-6 max-w-sm">{{ message() }}</p>
      <button
        (click)="retry.emit()"
        class="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
      >
        Reintentar
      </button>
    </div>
  `
})
export class ErrorStateComponent {
  message = input('No se pudo cargar la información. Verifica tu conexión e inténtalo de nuevo.');
  retry = output<void>();
}
