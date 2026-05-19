import { computed, Injectable, signal } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'nyx_cart';

  items = signal<CartItem[]>(this.loadFromStorage());

  totalItems = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  add(product: Product): void {
    const current = this.items();
    const existing = current.find(i => i.product.id === product.id);
    const updated = existing
      ? current.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      : [...current, { product, quantity: 1 }];
    this.items.set(updated);
    this.saveToStorage(updated);
  }

  remove(productId: number): void {
    const updated = this.items().filter(i => i.product.id !== productId);
    this.items.set(updated);
    this.saveToStorage(updated);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    const updated = this.items().map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    this.items.set(updated);
    this.saveToStorage(updated);
  }

  clear(): void {
    this.items.set([]);
    this.saveToStorage([]);
  }

  private saveToStorage(items: CartItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private loadFromStorage(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
