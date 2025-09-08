import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsCardComponent } from '../products-card/products-card.component';
import { Product } from '../../types/product';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCart } from '../../types/shopping-cart';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButton,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit {
  searchItem: string = '';
  cartList: ShoppingCart[] = [];
  orderStep: number = 0;
  addressForm!: FormGroup;
  paymentType: string = 'cash';
  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartList = this.shoppingCartService.cartList;
    this.initialization();
  }

  trackByFn(index: number, item: Product) {
    return item._id;
  }

  getTotal(): number {
    return this.cartList.reduce((total, item) => {
      const discountedPrice = this.getDiscountedPrice(
        item.productId.price,
        item.productId.discount
      );
      return total + discountedPrice * item.quantity;
    }, 0);
    // this.orderStep = 0;
  }

  getDiscountedPrice(price: number, discount: number): number {
    return Math.round(price - (price * discount) / 100);
  }

  increaseQty(item: ShoppingCart): void {
    item.quantity++;
    if (item.productId._id) {
      this.shoppingCartService
        .updateCart(item.productId._id, item.quantity)
        .subscribe();
    }
  }

  decreaseQty(item: ShoppingCart): void {
    if (item.quantity > 1) {
      item.quantity--;
      if (item.productId._id) {
        this.shoppingCartService
          .updateCart(item.productId._id, item.quantity)
          .subscribe();
      }
    }
  }

  onQuantityChange(item: ShoppingCart): void {
    if (item.quantity < 1 || isNaN(item.quantity)) {
      item.quantity = 1;
    }
    if (item.productId._id) {
      this.shoppingCartService
        .updateCart(item.productId._id, item.quantity)
        .subscribe();
    }
  }

  updateCartItem(item: ShoppingCart): void {
    this.shoppingCartService
      .addToCart(item.productId._id!, item.quantity)
      .subscribe({
        next: () => {
          console.log('Cart updated');
        },
        error: (err) => console.error(err),
      });
  }

  confirmRemove(productId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
      width: '320px',
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeFromCart(productId);
        Swal.fire(
          'Removed!',
          'Item has been removed from your cart.',
          'success'
        );
      }
    });
  }

  removeFromCart(productId: string): void {
    this.shoppingCartService.removeFromCart(productId).subscribe(() => {
      this.shoppingCartService.getCart().subscribe((result) => {
        this.cartList = result;
      });
    });
  }

  checkOut() {
    this.orderStep = 1;
  }

  initialization() {
    this.addressForm = this.fb.group({
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      pincode: [''],
    });
  }

  address() {
    this.orderStep = 2;
  }

  Cart() {
    this.orderStep = 0;
  }

  order() {
    let order = {
      items: this.cartList,
      paymentType: this.paymentType,
      address: this.addressForm.value,
      date: new Date(),
      totalAmount: this.getTotal(),
    };
    this.orderService.addOrder(order).subscribe({
      next: (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been successfully submitted.',
          confirmButtonText: 'OK',
        });
        this.shoppingCartService.init();
        this.cartList = [];
        this.addressForm.reset();
        this.orderStep = 0;
        this.router.navigateByUrl('/order');
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: 'Something went wrong. Please try again.',
          confirmButtonText: 'Retry',
        });
      },
    });
  }
}
