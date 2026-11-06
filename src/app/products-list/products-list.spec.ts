
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProductsList } from './products-list';
import { ProductsService } from '../products';

describe('ProductsList', () => {
  let component: ProductsList;
  let fixture: ComponentFixture<ProductsList>;

  beforeEach(async () => {
    const mockProductsService = {
      list: () => of([])
    };

    await TestBed.configureTestingModule({
      imports: [ProductsList],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ProductsService, useValue: mockProductsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
