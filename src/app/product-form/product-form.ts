import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../products';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Форма товару
  productForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    brand: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    thumbnail: ['', Validators.required]
  });

  isEditMode = false;
  productId: number | null = null;

  loading = false;
  submitting = false;

  errorMessage = '';
  successMessage = '';

  // Перевірка режиму створення або редагування
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      this.loadProductData(this.productId);
    }
  }

  // Завантаження даних товару
  private loadProductData(id: number): void {
    this.loading = true;

    this.productsService.get(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          title: product.title,
          brand: product.brand ?? '',
          price: product.price,
          description: product.description,
          thumbnail: product.thumbnail
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Помилка завантаження:', error);
        this.errorMessage = 'Не вдалося завантажити товар.';
        this.loading = false;
      }
    });
  }

  // Отримання полів форми
  get f() {
    return this.productForm.controls;
  }

  // Відправлення форми
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    const formValues = this.productForm.getRawValue();

    // UPDATE — оновлення товару
    if (this.isEditMode && this.productId !== null) {
      const updatedProduct: Partial<Product> = {
        title: formValues.title,
        brand: formValues.brand,
        price: Number(formValues.price),
        description: formValues.description,
        thumbnail: formValues.thumbnail
      };
      this.productsService.update(
        this.productId,
        updatedProduct
      ).subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Товар успішно оновлено!';
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1500);
        },
        error: (error) => {
          console.error('Помилка оновлення:', error);
          this.errorMessage = 'Не вдалося оновити товар.';
          this.submitting = false;
        }
      });
    } else {
      // CREATE — створення нового товару
      const newProduct: Omit<Product, 'id'> = {
        title: formValues.title,
        brand: formValues.brand,
        price: Number(formValues.price),
        description: formValues.description,
        thumbnail: formValues.thumbnail,
        category: 'smartphones'
      };
      this.productsService.create(newProduct).subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Товар успішно створено!';
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1500);
        },
        error: (error) => {
          console.error('Помилка створення:', error);
          this.errorMessage = 'Не вдалося створити товар.';
          this.submitting = false;
        }
      });
    }
  }
}
