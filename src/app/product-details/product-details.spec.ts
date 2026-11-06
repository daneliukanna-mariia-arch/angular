
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProductDetails } from './product-details';
import { ProductsService, Product } from '../products';

describe('ProductDetails', () => {
  let component: ProductDetails;
  let fixture: ComponentFixture<ProductDetails>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Phone',
    description: 'Test description',
    price: 999
  };

  beforeEach(async () => {
    const mockProductsService = {
      get: () => of(mockProduct)
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ProductsService, useValue: mockProductsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
