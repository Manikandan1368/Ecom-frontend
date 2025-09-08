import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../types/order';
import { ShoppingCart } from '../../../types/shopping-cart';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, MatButtonToggleModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  orders:Order[]=[];
  cartList: ShoppingCart[]=[];

  constructor(private orderService:OrderService) { }

  ngOnInit(): void {
    this.orderService.getAdminOrders().subscribe(orders=>{
      this.orders = orders;
    })
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

updateStatus(orderId:string,event: any){
  this.orderService.updateOrderStatus(orderId,event.value).subscribe(res=>{
    alert("Order status updated successfully");
  });
}

}
