# 🧪 Plan de Batalla — Prueba Técnica DVP / NYX
> Cargo: Desarrollador Web E-commerce  
> Stack: Angular 17+ · TypeScript · TailwindCSS · Claude API  
> Tiempo objetivo: ~2 horas | Puntaje mínimo: 70/100

---

## 🎯 Decisiones de arquitectura (ya tomadas)

| Decisión | Elección | Por qué |
|---|---|---|
| Framework | **Angular 17+ standalone** | Diferencia frente a candidatos con Next.js |
| Estilos | **TailwindCSS** | UI responsive rápida, sin perder calidad visual |
| Estado carrito | **Signals + Service** | Patrón moderno Angular, sin NgRx pesado |
| Persistencia | **localStorage** | Simple, cumple el requisito |
| IA Sección 4 | **Opción C — Claude API** | Resumen de reseñas, diferenciador real |
| Deploy | **Vercel** | Bonus garantizado, rápido de configurar |
| API datos | **https://fakestoreapi.com/products** | Definida en la prueba |

---

## 📁 Estructura del proyecto

```
nyx-ecommerce/
├── src/
│   └── app/
│       ├── core/
│       │   ├── models/
│       │   │   ├── product.model.ts       # Interface Product, CartItem, Category
│       │   │   └── api-response.model.ts
│       │   ├── services/
│       │   │   ├── product.service.ts     # Todas las llamadas a FakeStore API
│       │   │   ├── cart.service.ts        # Lógica del carrito con Signals
│       │   │   └── ai.service.ts          # Claude API — resumen de reseñas
│       │   └── interceptors/
│       │       └── error.interceptor.ts   # Manejo centralizado de errores HTTP
│       ├── shared/
│       │   ├── components/
│       │   │   ├── skeleton/              # Skeleton loader reutilizable
│       │   │   ├── error-state/           # Estado de error con botón reintentar
│       │   │   └── empty-state/           # Lista vacía
│       │   └── pipes/
│       │       └── currency-cop.pipe.ts   # Opcional: formato de precio
│       ├── features/
│       │   ├── catalog/
│       │   │   ├── catalog.component.ts   # Página principal — grilla de productos
│       │   │   ├── product-card/          # Tarjeta de producto reutilizable
│       │   │   ├── product-detail/        # Modal de detalle del producto
│       │   │   ├── search-bar/            # Buscador en tiempo real
│       │   │   └── category-filter/      # Filtro por categoría
│       │   └── cart/
│       │       └── cart.component.ts      # Vista del carrito completa
│       ├── layout/
│       │   └── header/
│       │       └── header.component.ts    # Header con contador del carrito
│       └── app.routes.ts
├── tailwind.config.js
├── README.md                              # Sección 5 — respuestas de negocio
└── PLAN_PRUEBA_DVP.md                     # Este archivo
```

---

## 📦 Modelos TypeScript estrictos (Sección 3)

```typescript
// core/models/product.model.ts
export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = string;
```

---

## 🔧 Servicios clave

### product.service.ts — Capa centralizada de API
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'https://fakestoreapi.com';
  private cache = signal<Product[] | null>(null); // Caché en memoria

  getProducts(): Observable<Product[]> {
    if (this.cache()) return of(this.cache()!);
    return this.http.get<Product[]>(`${this.baseUrl}/products`).pipe(
      tap(products => this.cache.set(products))
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/products/categories`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }
}
```

### cart.service.ts — Estado con Signals
```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>(this.loadFromStorage());

  totalItems = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  add(product: Product): void { /* sumar cantidad si ya existe */ }
  remove(productId: number): void { /* eliminar del array */ }
  clear(): void { this.items.set([]); this.saveToStorage([]); }

  private saveToStorage(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
  }
  private loadFromStorage(): CartItem[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
}
```

### error.interceptor.ts — Manejo centralizado HTTP
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error.status, error.message);
      return throwError(() => error);
    })
  );
};
```

---

## 🤖 Sección 4 — Claude API (Opción C)

**Qué hace:** En el modal de detalle del producto, genera un resumen de 2 líneas automáticamente usando la descripción y el rating del producto.

```typescript
// core/services/ai.service.ts
@Injectable({ providedIn: 'root' })
export class AiService {
  private apiUrl = 'https://api.anthropic.com/v1/messages';

  generateProductSummary(product: Product): Observable<string> {
    const prompt = `
      Producto: ${product.title}
      Descripción: ${product.description}
      Rating: ${product.rating.rate}/5 (${product.rating.count} reseñas)
      
      Genera un resumen de máximo 2 líneas en español que destaque los puntos más atractivos 
      de este producto para un comprador. Sé directo y persuasivo.
    `;

    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }]
    };

    return this.http.post<any>(this.apiUrl, body, {
      headers: {
        'x-api-key': environment.claudeApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    }).pipe(
      map(res => res.content[0].text),
      catchError(() => of('No se pudo generar el resumen en este momento.'))
    );
  }
}
```

> ⚠️ Guarda tu Claude API Key en `environment.ts` y nunca la expongas en el repo público. Menciona en el README que el reviewer debe agregar su propia key.

---

## 🗂️ Plan de commits (orden exacto)

```bash
git init
git commit -m "chore: project setup Angular 17 + TailwindCSS"
git commit -m "feat(core): add Product, CartItem and Category models with strict typing"
git commit -m "feat(core): add ProductService with centralized API calls and in-memory cache"
git commit -m "feat(core): add HTTP error interceptor for centralized error handling"
git commit -m "feat(catalog): add product grid with responsive layout"
git commit -m "feat(catalog): add real-time search and category filter"
git commit -m "feat(catalog): add product detail modal with rating and add-to-cart"
git commit -m "feat(shared): add skeleton loader, error state and empty state components"
git commit -m "feat(cart): add CartService with Signals and localStorage persistence"
git commit -m "feat(cart): add cart view with subtotals, total and checkout confirmation"
git commit -m "feat(layout): add header with live cart item counter"
git commit -m "feat(ai): integrate Claude API for product review summary (Option C)"
git commit -m "docs: add README with architecture decisions and business impact"
git commit -m "chore: deploy to Vercel and add live link to README"
```

---

## 📝 README — Respuestas Sección 5 (template)

### ¿Qué herramientas de IA usaste y para qué?
- **Claude API** — generación automática de resúmenes de productos en el detalle
- **Claude (claude.ai)** — apoyo en decisiones de arquitectura, generación de código base y revisión de lógica
- **GitHub Copilot** — autocompletado en tiempo real durante el desarrollo

### Si este fuera el eCommerce real de Hi Beauty con 10.000 usuarios diarios, ¿qué cambiarías?
- **SSR con Angular Universal** para SEO y tiempo de carga inicial
- **Caché en Redis / CDN** para el catálogo de productos (no solo en memoria)
- **NgRx** para state management robusto y predecible a escala
- **Lazy loading** por módulo/feature para reducir el bundle inicial
- **Monitoreo con Amplitude** para rastrear conversiones y abandonos de carrito
- **GTM** para gestión de eventos sin deploys

### ¿Qué métrica de negocio mejoraría más con el componente de IA?
El **resumen de reseñas con IA** impacta directamente la **tasa de conversión (CVR)**. Los usuarios que leen una descripción clara y persuasiva toman la decisión de compra más rápido y con mayor confianza, reduciendo el abandono en la página de detalle — que es el punto de mayor fricción en cualquier eCommerce.

---

## ✅ Checklist antes de entregar

- [ ] Grilla responsive con imagen, nombre, precio, categoría
- [ ] Filtro por categoría funcional
- [ ] Buscador en tiempo real
- [ ] Modal de detalle con rating y "Agregar al carrito"
- [ ] Estados: cargando (skeleton), error (con reintentar), vacío
- [ ] Carrito: agregar, eliminar, sumar cantidades (no duplicar)
- [ ] Contador en header actualizado en tiempo real
- [ ] Vista carrito: subtotal por ítem, total general, botón pagar
- [ ] Carrito persiste al navegar (localStorage)
- [ ] Botón pagar: confirmación + vaciar carrito
- [ ] Servicio centralizado para API (no fetch directo en componentes)
- [ ] TypeScript estricto: Product, CartItem, Category
- [ ] Error de red con botón "Reintentar"
- [ ] Interceptor HTTP para errores centralizados
- [ ] Caché explicado en README (con ejemplo de código)
- [ ] Sección IA funcionando con Claude API
- [ ] README con las 3 respuestas de negocio
- [ ] Commits descriptivos por sección
- [ ] Deploy en Vercel con link en README
- [ ] Correo enviado a ingrid.hernandez@doublevpartners.com

---

## 📧 Asunto del correo de entrega
```
Prueba Técnica + Edwards Ardila
```

---

*Construido con criterio técnico, código limpio y uso real de IA — DVP/NYX 2026*
