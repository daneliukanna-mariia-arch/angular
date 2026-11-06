import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService, Product } from '../products';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.scss']
})
export class ProductsList implements OnInit {
  private readonly productsService = inject(ProductsService);

  // Стан через Signals
  allProducts = signal<Product[]>([]);
  selectedBrand = signal<string>('All');
  currentPage = signal<number>(1);
  pageSize = signal<number>(4);

  loading = signal<boolean>(false);
  error = signal<string>('');

  // Список унікальних брендів
  brands = computed(() => {
    const uniqueBrands = new Set(
      this.allProducts().map(p => p.brand || 'Other')
    );
    return ['All', ...Array.from(uniqueBrands)];
  });

  // Фільтрація за брендом
  filteredProducts = computed(() => {
    const brand = this.selectedBrand();
    if (brand === 'All') {
      return this.allProducts();
    }
    return this.allProducts().filter(p => (p.brand || 'Other') === brand);
  });

  paginatedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProducts().slice(startIndex, startIndex + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize()) || 1;
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    this.productsService.list().subscribe({
      next: (data) => {
        this.allProducts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження товарів:', err);
        this.error.set('Не вдалося завантажити товари. Спробуйте пізніше.');
        this.loading.set(false);
      }
    });
  }

  onBrandChange(brand: string): void {
    this.selectedBrand.set(brand);
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  trackById(_index: number, item: Product): number {
    return item.id;
  }
}
