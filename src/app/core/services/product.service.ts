import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Category, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'https://fakestoreapi.com';
  private cache = signal<Product[] | null>(null);

  getProducts(): Observable<Product[]> {
    const cached = this.cache();
    if (cached) return of(cached);
    return this.http
      .get<Product[]>(`${this.baseUrl}/products`)
      .pipe(tap((products) => this.cache.set(products)));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/products/categories`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  clearCache(): void {
    this.cache.set(null);
  }
}
