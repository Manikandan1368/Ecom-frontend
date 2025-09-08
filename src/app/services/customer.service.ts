import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../types/product';
import { environment } from '../../environments/environment.development';
import { Category } from '../types/category';
import { Brand } from '../types/brand';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getNewProducts() {
    return this.http.get<Product[]>(
      environment.apiUrl + '/customer/new-products'
    );
  }

  getFeaturedProducts() {
    return this.http.get<Product[]>(
      environment.apiUrl + '/customer/featured-products'
    );
  }
  getCategories() {
    return this.http.get<Category[]>(
      environment.apiUrl + '/customer/categories'
    );
  }
  getBrands() {
    return this.http.get<Brand[]>(environment.apiUrl + '/customer/brands');
  }

  getProducts(
    searchItem: string,
    categoryIds: string[],
    sortBy: string,
    sortOrder: number,
    branchId: string,
    page: number,
    pageSize: number
  ) {
    const params = new URLSearchParams({
      searchItem: searchItem || '',
      categoryId: categoryIds?.join(',') || '',
      sortBy: sortBy || 'price',
      sortOrder: sortOrder.toString(),
      branchId: branchId || '',
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    return this.http.get<{ products: Product[]; totalCount: number }>(
      `${environment.apiUrl}/customer/products?${params.toString()}`
    );
  }

  getProductById(id: string) {
    return this.http.get<Product>(
      environment.apiUrl + '/customer/products/' + id
    );
  }

  addReview(productId: string, review: { user: string; comment: string }) {
    return this.http.post(
      `${environment.apiUrl}/customer/products/${productId}/reviews`,
      review
    );
  }
}
