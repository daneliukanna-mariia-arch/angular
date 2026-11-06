import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./home/home').then(m => m.Home) 
  },
  { 
    path: 'products', 
    loadComponent: () => import('./products-list/products-list').then(m => m.ProductsList) 
  },
  { 
    path: 'products/new', 
    loadComponent: () => import('./product-form/product-form').then(m => m.ProductFormComponent) 
  },
  { 
    path: 'products/:id', //  Маршрут для перегляду деталей
    loadComponent: () => import('./product-details/product-details').then(m => m.ProductDetails) 
  },
  { 
    path: 'products/:id/edit', // Маршрут для редагування
    loadComponent: () => import('./product-form/product-form').then(m => m.ProductFormComponent) 
  }
];
