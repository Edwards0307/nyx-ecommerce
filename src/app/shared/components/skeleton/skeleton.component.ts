import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      @for (item of items; track $index) {
        <div class="animate-pulse bg-white rounded-2xl shadow-sm p-4">
          <div class="bg-gray-200 rounded-xl h-52 mb-4"></div>
          <div class="bg-gray-200 rounded h-3 w-1/4 mb-3"></div>
          <div class="bg-gray-200 rounded h-4 w-full mb-2"></div>
          <div class="bg-gray-200 rounded h-4 w-3/4 mb-5"></div>
          <div class="flex justify-between items-center">
            <div class="bg-gray-200 rounded h-6 w-1/4"></div>
            <div class="bg-gray-200 rounded-lg h-9 w-1/3"></div>
          </div>
        </div>
      }
    </div>
  `
})
export class SkeletonComponent {
  count = input<number>(8);

  get items(): number[] {
    return Array(this.count()).fill(0);
  }
}
