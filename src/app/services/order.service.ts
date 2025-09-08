import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../types/order';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  addOrder(order:Order){
    return this.http.post(environment.apiUrl+"/customer/order",order);
  }

  getCustomerOrders(){
    return this.http.get<Order[]>(environment.apiUrl+"/customer/orders");
  }

   getAdminOrders(){
    return this.http.get<Order[]>(environment.apiUrl+"/order/allOrders");
  }

   updateOrderStatus(id:string, status:string){
    return this.http.post(environment.apiUrl+'/order/' + id ,{
      status:status
    });
  }
}
