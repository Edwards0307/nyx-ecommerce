import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Category, Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    SkeletonComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    ProductCardComponent,
    SearchBarComponent,
    CategoryFilterComponent,
    ProductDetailComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div
        class="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
      >
        <div class="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <app-search-bar [value]="searchTerm()" (searched)="searchTerm.set($event)" />
          <app-category-filter
            [categories]="categories()"
            [activeCategory]="selectedCategory()"
            (selected)="selectedCategory.set($event)"
          />
        </div>
      </div>

      <main class="max-w-7xl mx-auto px-4 py-6">
        @if (isLoading()) {
          <app-skeleton [count]="8" />
        } @else if (errorMessage()) {
          <app-error-state [message]="errorMessage()" (retry)="loadProducts()" />
        } @else if (filteredProducts().length === 0) {
          <app-empty-state />
        } @else {
          <p class="text-sm text-gray-400 mb-4">
            {{ filteredProducts().length }}
            {{ filteredProducts().length === 1 ? 'producto encontrado' : 'productos encontrados' }}
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (product of filteredProducts(); track product.id) {
              <app-product-card
                [product]="product"
                (detail)="selectedProduct.set($event)"
                (addedToCart)="addToCart($event)"
              />
            }
          </div>
        }
      </main>
    </div>

    @if (selectedProduct()) {
      <app-product-detail [product]="selectedProduct()!" (close)="selectedProduct.set(null)" />
    }
  `,
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  isLoading = signal(true);
  errorMessage = signal('');
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  searchTerm = signal('');
  selectedCategory = signal<Category | null>(null);
  selectedProduct = signal<Product | null>(null);

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.selectedCategory();
    return this.products().filter((p) => {
      const matchesSearch =
        !term || p.title.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
      const matchesCategory = !cat || p.category === cat;
      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'No se pudo cargar el catálogo. Verifica tu conexión e inténtalo de nuevo.',
        );
        this.isLoading.set(false);
      },
    });

    this.productService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
    });
  }

  addToCart(product: Product): void {
    this.cartService.add(product);
  }
}
