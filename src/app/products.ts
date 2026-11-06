import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // 👈 Запитуємо тільки категорію смартфонів
  private readonly apiUrl = 'https://dummyjson.com/products/category/smartphones';
  private cachedProducts: Product[] | null = null;

  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    if (this.cachedProducts) {
      return of(this.cachedProducts);
    }

    return this.http.get<{ products: Product[] }>(this.apiUrl).pipe(
      map(res => res.products),
      tap(products => {
        this.cachedProducts = products;
      })
    );
  }

  get(id: number): Observable<Product> {
    const existing = this.cachedProducts?.find(p => p.id === id);
    if (existing) {
      return of(existing);
    }
    return this.http.get<Product>(`https://dummyjson.com/products/${id}`);
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>('https://dummyjson.com/products/add', product).pipe(
      tap(newProduct => {
        const itemWithId: Product = {
          ...newProduct,
          id: newProduct.id || Date.now()
        };

        if (this.cachedProducts) {
          this.cachedProducts = [itemWithId, ...this.cachedProducts];
        } else {
          this.cachedProducts = [itemWithId];
        }
      })
    );
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`https://dummyjson.com/products/${id}`, product).pipe(
      tap(updatedProduct => {
        if (this.cachedProducts) {
          const index = this.cachedProducts.findIndex(p => p.id === id);
          if (index !== -1) {
            this.cachedProducts[index] = { ...this.cachedProducts[index], ...updatedProduct };
          }
        }
      })
    );
  }
}
