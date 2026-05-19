import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.anthropic.com/v1/messages';

  generateProductSummary(product: Product): Observable<string> {
    const prompt = `Producto: ${product.title}
Descripción: ${product.description}
Rating: ${product.rating.rate}/5 (${product.rating.count} reseñas)

Generate a maximum 2-line summary in English highlighting the most attractive points of this product for a buyer. Be direct and persuasive.`;

    return this.http.post<ClaudeResponse>(
      this.apiUrl,
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'x-api-key': environment.claudeApiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        }
      }
    ).pipe(
      map(res => res.content[0].text),
      catchError(() => of('No se pudo generar el resumen en este momento.'))
    );
  }
}
