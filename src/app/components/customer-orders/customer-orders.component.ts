import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../types/order';
import { ShoppingCart } from '../../types/shopping-cart';

@Component({
  selector: 'app-customer-orders',
  imports: [CommonModule, ],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.scss'
})
export class CustomerOrdersComponent implements OnInit {

  orders:Order[]=[];
  cartList: ShoppingCart[]=[];

  constructor(private orderService:OrderService) { }

  ngOnInit(): void {
    this.orderService.getCustomerOrders().subscribe((orders:any)=>{
      this.orders = orders;
    });
  }

  getTotal(): number {
  return this.cartList.reduce((total, item) => {
    const discountedPrice = this.getDiscountedPrice(item.productId.price, item.productId.discount);
    return total + discountedPrice * item.quantity;
  }, 0);
}

getDiscountedPrice(price: number, discount: number): number {
  return Math.round(price - (price * discount / 100));
}

}
