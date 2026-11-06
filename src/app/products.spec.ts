
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductsService, Product } from './products';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const mockProductList: Product[] = [
    { id: 1, title: 'iPhone 15', description: 'Apple phone', price: 999 },
    { id: 2, title: 'Galaxy S24', description: 'Samsung phone', price: 899 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('list() має повертати список смартфонів', () => {
    service.list().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProductList);
    });

    const req = httpMock.expectOne('https://dummyjson.com/products/category/smartphones');
    expect(req.request.method).toBe('GET');
    req.flush({ products: mockProductList });
  });
});
