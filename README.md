# NYX eCommerce

Mini tienda construida con Angular 21 standalone + TailwindCSS como parte de la prueba técnica para Double V Partners / NYX.

---

## Stack

- **Angular 21** con componentes standalone y la nueva sintaxis de control de flujo (`@if`, `@for`)
- **Signals + computed()** para estado reactivo sin NgRx
- **TailwindCSS** para los estilos
- **FakeStore API** como fuente de datos
- **Claude API** para el resumen de reseñas en el detalle del producto
- **localStorage** para persistir el carrito entre navegaciones

---

## Cómo correrlo localmente

```bash
git clone https://github.com/edwards-ardila/nyx-ecommerce.git
cd nyx-ecommerce
npm install
```

Antes de levantar el servidor, agrega tu Claude API Key en `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  claudeApiKey: 'TU_API_KEY_AQUI'
};
```

> Si no tienes una key, la sección de resumen IA simplemente muestra un mensaje de fallback. El resto de la app funciona sin problemas.

```bash
ng serve
```

Abre [http://localhost:4200](http://localhost:4200) y listo.

---

## Caché del catálogo

Esto lo resuelvo directamente en `ProductService` usando un `Signal` como caché en memoria. La primera vez que se piden los productos se hace la llamada a la API y el resultado se guarda en el signal. Cualquier llamada posterior devuelve esos datos sin tocar la red.

```ts
private cache = signal<Product[] | null>(null);

getProducts(): Observable<Product[]> {
  const cached = this.cache();
  if (cached) return of(cached);             // ya tengo datos, no llamo la API
  return this.http.get<Product[]>(`${this.baseUrl}/products`).pipe(
    tap(products => this.cache.set(products)) // guardo para la próxima
  );
}
```

Es simple, vive en memoria mientras dure la sesión y cumple perfecto para este caso. Si se necesitara algo más robusto a escala, lo reemplazaría con Redis o una capa de CDN — lo explico más abajo.

---

## Sección 5 — Preguntas de negocio

### ¿Qué herramientas de IA usaste y para qué?

- **Claude API** — integrado en el detalle del producto para generar un resumen de 2 líneas en inglés basado en la descripción y el rating. El objetivo era que el texto no sonara al copy genérico de la API, sino a algo directo y útil para quien está considerando comprar.
- **Claude Code (CLI)** — lo usé durante todo el desarrollo para tomar decisiones de arquitectura, revisar código y avanzar más rápido sin perder criterio propio.
- **GitHub Copilot** — autocompletado en tiempo real para el día a día.

---

### Si este fuera el eCommerce real de Hi Beauty con 10.000 usuarios diarios, ¿qué cambiarías?

Lo que tenemos funciona bien para un MVP, pero a esa escala hay cosas que cambiarían por necesidad, no por capricho técnico:

- **SSR con Angular Universal**: el catálogo necesita ser indexable por Google. Hoy todo se renderiza en el cliente, lo que perjudica el SEO y el tiempo de carga percibido en mobile.
- **Caché en servidor**: cambiaría el signal en memoria por una capa de caché en Redis con TTL, o dejaría que un CDN sirva el catálogo estático y solo invalidaría cuando hay cambios de inventario.
- **State management más robusto**: Signals escala bien hasta cierto punto, pero con carrito sincronizado entre tabs, historial de pedidos y sesión de usuario, NgRx da más trazabilidad y facilita el debugging en producción.
- **Lazy loading por módulo**: el bundle inicial hoy es más grande de lo necesario. Con lazy loading real se baja el tiempo de carga inicial de forma notable.
- **Monitoreo de conversión**: sin saber qué hacen los usuarios en la tienda, cualquier cambio es a ciegas. Implementaría Amplitude o similar desde el día uno para rastrear vistas de producto, adiciones al carrito y abandonos.

---

### ¿Qué métrica de negocio mejoraría más con el componente de IA que implementé?

La **tasa de conversión** en la página de detalle del producto.

El punto de mayor fricción en cualquier tienda online es ese momento donde el usuario está mirando un producto y todavía no decide. La descripción técnica muchas veces no ayuda — es larga, genérica o está en inglés. El resumen de IA toma esa información y la convierte en algo concreto y persuasivo en dos líneas.

Un usuario que entiende rápido por qué ese producto le conviene, compra más rápido y con más confianza. Eso se traduce directamente en menos abandono en el detalle y más clics en "Agregar al carrito" — que es exactamente la métrica que más le importa al negocio en esa pantalla.

---

## Deploy

🔗 [Ver demo en Vercel](https://nyx-ecommerce.vercel.app) *(link disponible tras el deploy)*

---

*Edwards Ardila — Prueba Técnica DVP / NYX 2026*
