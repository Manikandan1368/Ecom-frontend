import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ShoppingCart } from '../types/shopping-cart';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  cartList: ShoppingCart[] = [];
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  init() {
    this.getCart().subscribe((result) => {
      console.log('result: ', result);
      this.cartSubject.next(result); 
      this.cartList = result;
    });
  }

  // get cartLists(): any[] {
  //   return this.cartSubject.value;
  // }

  getCart() {
    return this.http.get<ShoppingCart[]>(
      environment.apiUrl + '/customer/shopping-cart'
    );
  }

  addToCart(productId: string, quantity: number) {
    console.log('quantity: ', quantity);
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
