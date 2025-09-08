import { Injectable } from '@angular/core';
import { Product } from '../types/product';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  wishlists: Product[] = [];
  constructor(private http:HttpClient) { }

  init(){
    this.getWishlist().subscribe((result)=>{
      console.log('result: ', result);
      this.wishlists = result;
    });
  }

  getWishlist(){
  return this.http.get<Product[]>(environment.apiUrl + '/customer/wishlist');
  }

  addToWishlist(productId:string){
  return this.http.post<Product[]>(environment.apiUrl + '/customer/wishlist/'+ productId,{});
  }

  removeFromWishlist(productId:string){
  return this.http.delete<Product[]>(environment.apiUrl + '/customer/wishlist/'+ productId);
  }

}
