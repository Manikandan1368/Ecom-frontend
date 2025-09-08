import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ShoppingCart } from '../types/shopping-cart';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  cartList: ShoppingCart[] = [];
  constructor(private http: HttpClient) {}

  init() {
    this.getCart().subscribe((result) => {
      this.cartList = result;
    });
  }

  getCart() {
    return this.http.get<ShoppingCart[]>(
      environment.apiUrl + '/customer/shopping-cart'
    );
  }

  addToCart(productId: string, quantity: number) {
    return this.http.post(
      environment.apiUrl + '/customer/shopping-cart/' + productId,
      {
        quantity: quantity,
      }
    );
  }

  removeFromCart(productId: string) {
    return this.http.delete(
      environment.apiUrl + '/customer/shopping-cart/' + productId
    );
  }

  updateCart(productId: string, quantity: number) {
    return this.http.put(
      environment.apiUrl + '/customer/shopping-cart/' + productId,
      {
        quantity: quantity,
      }
    );
  }
}
