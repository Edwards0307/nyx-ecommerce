import { Component, input, output } from '@angular/core';
import { Category } from '../../../core/models/product.model';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  template: `
    <div class="flex gap-2 flex-wrap">
      <button
        (click)="selected.emit(null)"
        class="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
        [class]="
          !activeCategory()
            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
            : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300 hover:text-rose-500'
        "
      >
        Todos
      </button>
      @for (cat of categories(); track cat) {
        <button
          (click)="selected.emit(cat)"
          class="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all capitalize"
          [class]="
            activeCategory() === cat
              ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
              : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300 hover:text-rose-500'
          "
        >
          {{ cat }}
        </button>
      }
    </div>
  `,
})
export class CategoryFilterComponent {
  categories = input<Category[]>([]);
  activeCategory = input<Category | null>(null);
  selected = output<Category | null>();
}
