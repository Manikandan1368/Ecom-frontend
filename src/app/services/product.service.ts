import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  addProduct(product: any) {
    return this.http.post(`${environment.apiUrl}/product`, product);
  }

  getProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/product`);
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${environment.apiUrl}/product/${id}`);
  }

  updateProduct(id: string, product: any) {
    return this.http.put(`${environment.apiUrl}/product/${id}`, product);
  } 

  deleteProduct(id: string) {
    return this.http.delete<{ message: string; product: any[] }>(`${environment.apiUrl}/product/${id}`);
  }
}
